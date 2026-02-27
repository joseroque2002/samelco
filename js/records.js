document.addEventListener('DOMContentLoaded', function () {
  // Check if user is logged in
  var userName = localStorage.getItem('userName');
  if (!userName) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('user-name').textContent = userName;

  // Get problem locations from localStorage (set by dashboard or previous visits)
  var problemLocations = [];
  try {
    var stored = localStorage.getItem('problemLocations');
    if (stored) {
      problemLocations = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error parsing problem locations:', e);
  }

  // Pull restored locations from localStorage as well (optional feature)
  var restoredLocations = [];
  function loadRestoredLocations() {
    try {
      var storedRest = localStorage.getItem('restoredLocations');
      if (storedRest) {
        var parsed = JSON.parse(storedRest);
        // Normalize: Ensure all entries are strings (municipality names)
        restoredLocations = parsed.map(function(item) {
          return (typeof item === 'string') ? item : (item.name || '');
        }).filter(Boolean);
      }
    } catch (e) {
      console.error('Error parsing restored locations:', e);
    }
  }
  loadRestoredLocations();
  var pendingAssignments = {};
  function loadPendingAssignments() {
    try {
      var storedPA = localStorage.getItem('pendingAssignments');
      if (storedPA) {
        pendingAssignments = JSON.parse(storedPA) || {};
      } else {
        pendingAssignments = {};
      }
    } catch (e) {
      pendingAssignments = {};
    }
  }
  loadPendingAssignments();

  // Listen for storage changes from other tabs/pages (like dashboard)
  window.addEventListener('storage', function (e) {
    if (e.key === 'restoredLocations') {
      loadRestoredLocations();
      updateRecordsWithProblems();
    }
    if (e.key === 'pendingAssignments') {
      loadPendingAssignments();
      updateAssignedInTable();
    }
  });

  // Update records table with restored-service status
  function updateRecordsWithProblems() {
    const tableRows = document.querySelectorAll('.records-table-row');
    tableRows.forEach(function (row) {
      const restoredCell = row.querySelector('.col-restored');
      const rowMun = (row.getAttribute('data-municipality') || '').toLowerCase();

      if (restoredCell) {

        // Default: Not restored (Pending)
        restoredCell.textContent = 'Pending';
        restoredCell.className = 'col-restored status-pending';
        row.removeAttribute('data-restored');

        // Check if this row is restored (STRICT: by municipality name only)
        restoredLocations.forEach(function (restoredLoc) {
          const rLocLower = restoredLoc.toLowerCase();
          if (rowMun === rLocLower) {
            restoredCell.textContent = 'Restored';
            restoredCell.className = 'col-restored status-restored';
            row.setAttribute('data-restored', 'true');
          }
        });
      }
    });
    if (typeof updateCounts === 'function') updateCounts();
  }
  function updateAssignedInTable() {
    const tableRows = document.querySelectorAll('.records-table-row');
    tableRows.forEach(function(row){
      var cell = row.querySelector('.col-assigned');
      var mun = (row.getAttribute('data-municipality') || '').toLowerCase();
      var team = pendingAssignments[mun] || '';
      if (cell) cell.textContent = team || '';
      row.setAttribute('data-assigned-team', team || '');
    });
  }

  // Load consumer records from Supabase and populate table
  async function loadConsumerRecords() {
    var cfg = window.SAMELCO_SUPABASE || {};
    if (!cfg.url || !cfg.anonKey || !cfg.reportsTable) return;
    try {
      var res = await fetch(cfg.url + '/rest/v1/' + cfg.reportsTable + '?select=*&order=created_at.desc&limit=50', {
        headers: {
          apikey: cfg.anonKey,
          Authorization: 'Bearer ' + cfg.anonKey,
          Prefer: 'count=exact'
        }
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      var contentRange = res.headers.get('content-range');
      if (contentRange) {
        var total = contentRange.split('/')[1];
        var totalEl = document.getElementById('total-reports-count');
        if (totalEl) {
          totalEl.textContent = total;
        }
      }

      var rows = await res.json();
      if (Array.isArray(rows)) {
        var blacklistContacts = { '0012320': true, '012202021': true, '010200': true };
        var blacklistNames = { 'Jame': true, 'jam': true, 'MARIO': true };
        rows = rows.filter(function(r) {
          var c = String(r.contact || '').replace(/\s+/g, '');
          var n = String(r.full_name || '');
          if (blacklistContacts[c]) return false;
          if (blacklistNames[n]) return false;
          return true;
        });
      }
      // sync problem locations based on the same rows fetched
      if (Array.isArray(rows)) {
        var problems = rows.map(function(r) {
          // use location_text if available
          var address = r.location_text || '';
          if (!address) {
            var parts = [];
            if (r.municipality) parts.push(r.municipality);
            if (r.barangay) parts.push(r.barangay);
            if (r.location || r.street) parts.push(r.location || r.street);
            address = parts.join(', ');
          }
          return {
            name: address || r.municipality || r.location || '',
            issue: r.issue || r.issue_type || '' ,
            barangay: r.barangay || '',
            rawAddress: address
          };
        });
        localStorage.setItem('problemLocations', JSON.stringify(problems));
        problemLocations = problems; // update current variable so later logic sees it
      }
      populateTable(rows);
    } catch (err) {
      console.warn('Failed to load consumer records:', err);
    }
  }

  function populateTable(rows) {
    const table = document.getElementById('consumer-records-table');
    if (!table) return;
    // remove any existing data rows
    table.querySelectorAll('.records-table-row').forEach(r => r.remove());
    if (!rows || !rows.length) {
      var empty = document.createElement('div');
      empty.className = 'records-table-row';
      empty.innerHTML = '<span colspan="6" style="text-align:center;">No records found</span>';
      table.appendChild(empty);
      return;
    }
    var nowTs = Date.now();
    var newCount = 0;
    var pendingCount = 0;
    var muniSet = new Set();
    rows.forEach(function(r, idx) {
      var id = r.id || (idx + 1);
      var date = r.created_at ? r.created_at.split('T')[0] : '';
      var contact = r.contact || r.phone || '';
      var name = r.full_name || r.name || '';
      var address = r.location_text || r.location || '';
      var municipality = r.municipality || '';
      
      // if municipality is missing, try to extract it from address
      if (!municipality && address) {
        // comprehensive check for Samar municipalities - Must match dashboard names exactly
        const samarMuns = [
          'Almagro', 'Basey', 'Calbayog City', 'Calbiga', 'Catbalogan City', 'Daram', 'Gandara', 
          'Hinabangan', 'Jiabong', 'Marabut', 'Matuguinao', 'Motiong', 'Pagsanghan', 
          'Paranas (Wright)', 'Pinabacdao', 'San Jorge', 'San Jose de Buan', 
          'San Sebastian', 'Santa Margarita', 'Santa Rita', 'Santo Niño', 
          'Tagapul-an', 'Talalora', 'Tarangnan', 'Villareal', 'Zumarraga'
        ];
        const lowerAddr = address.toLowerCase();
        samarMuns.forEach(m => {
          const mLower = m.toLowerCase();
          // Extract core name for more flexible matching (e.g. "Catbalogan" matches "Catbalogan City")
          const coreName = mLower.replace(' city', '').replace(' (wright)', '');
          if (lowerAddr.includes(mLower) || lowerAddr.includes(coreName)) {
            municipality = m;
          }
        });
      }

      if (!address) {
        var parts = [];
        if (r.municipality) parts.push(r.municipality);
        if (r.barangay) parts.push(r.barangay);
        if (r.street) parts.push(r.street);
        address = parts.join(', ');
      }
      var isNew = false;
      if (r.created_at) {
        var t = Date.parse(r.created_at);
        if (!isNaN(t)) {
          isNew = (nowTs - t) <= 24 * 3600 * 1000;
        }
      }
      muniSet.add(municipality || '');
      var statusText = r.issue_type || r.issue || '';
      var row = document.createElement('div');
      row.className = 'records-table-row';
      row.setAttribute('data-status', statusText);
      row.setAttribute('data-date', date);
      row.setAttribute('data-municipality', municipality);
      row.setAttribute('data-is-new', isNew ? 'true' : 'false');
      var assignedTeam = pendingAssignments[(municipality||'').toLowerCase()] || '';
      row.innerHTML = '<span class="col-date">' + date + '</span>' +
                      '<span class="col-contact">' + contact + '</span>' +
                      '<span class="col-name">' + name + '</span>' +
                      '<span class="col-address">' + address + '</span>' +
                      '<span class="col-status">' + statusText + '</span>' +
                      '<span class="col-assigned">' + (assignedTeam || '') + '</span>' +
                      '<span class="col-restored status-pending">Pending</span>';
      row.setAttribute('data-assigned-team', assignedTeam || '');
      
      // Add click listener for restoration toggle
      const restoredCell = row.querySelector('.col-restored');
      restoredCell.addEventListener('click', function(e) {
        e.stopPropagation();
        var mun = row.getAttribute('data-municipality');
        if (!mun) return;

        // Toggle in restoredLocations
        var idx = restoredLocations.indexOf(mun);
        if (idx === -1) {
          restoredLocations.push(mun);
        } else {
          restoredLocations.splice(idx, 1);
        }
        localStorage.setItem('restoredLocations', JSON.stringify(restoredLocations));
        
        updateRecordsWithProblems();
        updateCounts();
      });

      row.addEventListener('click', function() {
        openRecordModal({
          id: id,
          date: date,
          contact: contact,
          name: name,
          address: address,
          issue: statusText,
          municipality: municipality,
          isNew: isNew
        });
      });

      table.appendChild(row);
      var isRestoredNow = restoredLocations.some(function(x){ return (x||'').toLowerCase() === (municipality||'').toLowerCase(); });
      if (!isRestoredNow) {
        if (isNew) newCount += 1; else pendingCount += 1;
      }
    });
    // if filters are already defined, apply them to the newly added rows
    if (typeof applyFilters === 'function') {
      applyFilters();
    }
    // refresh statuses based on problems/restored locations
    updateRecordsWithProblems();
    updateAssignedInTable();
    updateCounts(newCount, pendingCount);
    populateMunicipalityFilter(Array.from(muniSet).filter(Boolean));
  }

  // unified filter function
  function applyFilters() {
    const filterInput = document.getElementById('records-filter');
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('records-date');
    const recordsTable = document.getElementById('consumer-records-table');
    const munFilter = document.getElementById('mun-filter');
    
    if (!recordsTable) return;

    const tableRows = recordsTable.querySelectorAll('.records-table-row');
    const textValue = filterInput ? filterInput.value.toLowerCase().trim() : '';
    const statusValue = statusFilter ? statusFilter.value : 'all';
    const dateValue = dateFilter ? dateFilter.value : '';
    const munValue = munFilter ? munFilter.value : 'all';

    tableRows.forEach(row => {
      let show = true;
      
      // text match
      if (textValue) {
        const rowText = row.textContent.toLowerCase();
        if (!rowText.includes(textValue)) show = false;
      }

      // date match
      if (show && dateValue) {
        const rowDate = row.getAttribute('data-date');
        if (rowDate !== dateValue) show = false;
      }

      // status match
      if (show && statusValue !== 'all') {
        const isRestored = row.getAttribute('data-restored') === 'true';
        if (statusValue === 'restored') {
          if (!isRestored) show = false;
        } else if (statusValue === 'problems') {
          if (isRestored) show = false;
        }
      }

      if (show && munValue && munValue !== 'all') {
        const rowMun = row.getAttribute('data-municipality') || '';
        if (rowMun !== munValue) show = false;
      }

      if (show && quickFilter !== 'all') {
        const isRestored = row.getAttribute('data-restored') === 'true';
        if (isRestored) show = false;
        const isNew = row.getAttribute('data-is-new') === 'true';
        if (quickFilter === 'new' && !isNew) show = false;
        if (quickFilter === 'pending' && isNew) show = false;
      }

      row.style.display = show ? 'grid' : 'none';
    });
  }

  // Run the update and load records after DOM is ready
  updateRecordsWithProblems();
  // then fetch the latest reports to replace the table
  loadConsumerRecords();

  document.getElementById('records-filter').addEventListener('input', applyFilters);
  document.getElementById('records-date').addEventListener('change', applyFilters);
  document.getElementById('status-filter').addEventListener('change', applyFilters);

  // periodically refresh records so new submissions show up automatically
  setInterval(function() {
    loadConsumerRecords();
  }, 30000); // refresh every 30 seconds (adjust as needed)

  document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
  });

  // branches button dropdown (same behavior across pages)
  var branchesBtn = document.getElementById('branches-btn');
  var branchDropdown = document.getElementById('branch-dropdown');
  if (branchesBtn && branchDropdown) {
    branchesBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      branchDropdown.classList.toggle('is-open');
    });
    document.addEventListener('click', function() {
      branchDropdown.classList.remove('is-open');
    });
    branchDropdown.addEventListener('click', function(e) { e.stopPropagation(); });

    branchDropdown.querySelectorAll('.branch-option').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var branch = this.getAttribute('data-branch');
        localStorage.setItem('selectedBranch', branch);
        window.location.href = 'records.html';
      });
    });
  }

  // Three-dots menu
  var navDotsBtn = document.getElementById('nav-dots-btn');
  var navDotsDropdown = document.getElementById('nav-dots-dropdown');
  if (navDotsBtn && navDotsDropdown) {
    navDotsBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = navDotsDropdown.classList.toggle('is-open');
      navDotsBtn.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', function() {
      navDotsDropdown.classList.remove('is-open');
      navDotsBtn.setAttribute('aria-expanded', 'false');
    });
    navDotsDropdown.addEventListener('click', function(e) { e.stopPropagation(); });
    navDotsDropdown.querySelectorAll('.nav-dots-item').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var action = this.getAttribute('data-action');
        navDotsDropdown.classList.remove('is-open');
        if (action === 'home') window.location.href = 'dashboard.html';
        else if (action === 'records') { /* already here */ }
        else if (action === 'analytics') window.location.href = 'analytics.html';
        else if (action === 'branches') window.location.href = 'branches.html';
        else if (action === 'about') window.location.href = 'about.html';
        else if (action === 'contact') window.location.href = 'contact.html';
        else if (action === 'etc') window.location.href = 'about.html';
      });
    });
  }

  // Filter and Export functionality
  const filterInput = document.getElementById('records-filter');
  const statusFilter = document.getElementById('status-filter');
  const exportBtn = document.getElementById('export-excel-btn');
  const recordsTable = document.getElementById('consumer-records-table');
  const resetRestoredBtn = document.getElementById('reset-restored-btn');

  // if user selected a branch previously, pre-populate filter and clear storage
  var selectedBranch = localStorage.getItem('selectedBranch');
  if (selectedBranch && filterInput) {
    filterInput.value = selectedBranch;
    localStorage.removeItem('selectedBranch');
  }

  // check url query params for location/issue filter (from dashboard marker clicks)
  var searchParams = new URLSearchParams(window.location.search);
  function decodeParam(val) {
    if (!val) return '';
    return String(val).replace(/\+/g, ' ');
  }
  var locParam = decodeParam(searchParams.get('location'));
  var issueParam = decodeParam(searchParams.get('issue'));
  if (locParam && filterInput) {
    filterInput.value = locParam + (issueParam ? ' ' + issueParam : '');
  }
  if (issueParam && statusFilter) {
    // if an issue was specified, show problems only and include text in filter
    statusFilter.value = 'problems';
  }

  if (filterInput && recordsTable) {
    filterInput.addEventListener('input', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);

    // apply initial filter (including branch) if one is set
    applyFilters();
  }

  // export button logic separated from filtering
  if (exportBtn && recordsTable) {
    exportBtn.addEventListener('click', function() {
      const rows = recordsTable.querySelectorAll('.records-table-header, .records-table-row');
      let csvContent = [];

      rows.forEach(row => {
        if (row.style.display === 'none') return; // Skip filtered out rows
        const rowData = [];
        row.querySelectorAll('span').forEach(cell => {
          let cellText = cell.innerText.replace(/"/g, '""'); // Escape double quotes
          rowData.push(`"${cellText}"`);
        });
        csvContent.push(rowData.join(","));
      });

      const blob = new Blob([csvContent.join("\r\n")], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "consumer_records.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  var quickFilter = 'all';
  function updateCounts(prefNew, prefPending) {
    var newEl = document.getElementById('badge-new-count');
    var pendEl = document.getElementById('badge-pending-count');
    if (!newEl || !pendEl) return;
    if (typeof prefNew === 'number' && typeof prefPending === 'number') {
      newEl.textContent = String(prefNew);
      pendEl.textContent = String(prefPending);
      return;
    }
    var rows = document.querySelectorAll('.records-table-row');
    var n = 0, p = 0;
    rows.forEach(function(row){
      var isRestored = row.getAttribute('data-restored') === 'true';
      if (isRestored) return;
      var isNew = row.getAttribute('data-is-new') === 'true';
      if (isNew) n++; else p++;
    });
    newEl.textContent = String(n);
    pendEl.textContent = String(p);
  }

  function populateMunicipalityFilter(list) {
    var sel = document.getElementById('mun-filter');
    if (!sel) return;
    var existing = Array.from(sel.options).map(function(o){ return o.value; });
    list.forEach(function(m){
      if (!m || existing.includes(m)) return;
      var opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      sel.appendChild(opt);
    });
  }

  var munSel = document.getElementById('mun-filter');
  if (munSel) munSel.addEventListener('change', applyFilters);
  var badgeNew = document.getElementById('badge-new');
  var badgePending = document.getElementById('badge-pending');
  if (badgeNew) badgeNew.addEventListener('click', function(){ quickFilter = (quickFilter === 'new') ? 'all' : 'new'; applyFilters(); });
  if (badgePending) badgePending.addEventListener('click', function(){ quickFilter = (quickFilter === 'pending') ? 'all' : 'pending'; applyFilters(); });

  var recModal = document.getElementById('record-modal');
  var closeRec = document.getElementById('close-record-modal');
  var recList = document.getElementById('modal-info-list');
  var copyBtn = document.getElementById('copy-address-btn');
  var lastAddress = '';
  function openRecordModal(info) {
    if (!recModal || !recList) return;
    recList.innerHTML = '';
    var data = [
      ['Date', info.date || ''],
      ['Account No.', info.contact || ''],
      ['Name', info.name || ''],
      ['Municipality', info.municipality || ''],
      ['Address', info.address || ''],
      ['Issue', info.issue || ''],
      ['New', info.isNew ? 'Yes' : 'No']
    ];
    data.forEach(function(kv){
      var li = document.createElement('li');
      li.textContent = kv[0] + ': ' + kv[1];
      recList.appendChild(li);
    });
    lastAddress = info.address || '';
    recModal.style.display = 'block';
  }
  if (closeRec) closeRec.addEventListener('click', function(){ recModal.style.display = 'none'; });
  if (recModal) recModal.addEventListener('click', function(e){ if (e.target === recModal) recModal.style.display = 'none'; });
  if (copyBtn) copyBtn.addEventListener('click', function(){ if (lastAddress && navigator.clipboard) navigator.clipboard.writeText(lastAddress); });

  if (resetRestoredBtn) {
    resetRestoredBtn.addEventListener('click', function() {
      restoredLocations = [];
      localStorage.setItem('restoredLocations', JSON.stringify(restoredLocations));
      updateRecordsWithProblems();
      updateCounts();
    });
  }
});
