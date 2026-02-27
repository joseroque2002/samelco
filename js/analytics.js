document.addEventListener('DOMContentLoaded', function () {
  var userName = localStorage.getItem('userName');
  if (!userName) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('user-name').textContent = userName;

  document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
  });

  // branches button dropdown
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

  var navDotsBtn = document.getElementById('nav-dots-btn');
  var navDotsDropdown = document.getElementById('nav-dots-dropdown');
  if (navDotsBtn && navDotsDropdown) {
    navDotsBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navDotsDropdown.classList.toggle('is-open');
      navDotsBtn.setAttribute('aria-expanded', navDotsDropdown.classList.contains('is-open'));
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
        else if (action === 'records') window.location.href = 'records.html';
        else if (action === 'analytics') { /* already here */ }
        else if (action === 'branches') window.location.href = 'branches.html';
        else if (action === 'etc') window.location.href = 'about.html';
      });
    });
  }

  // Get problem locations from localStorage (set by dashboard or other pages)
  var problemLocations = [];
  try {
    var stored = localStorage.getItem('problemLocations');
    if (stored) {
      problemLocations = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error parsing problem locations:', e);
  }

  // municipality helpers (shared data comes from municipalities-data.js)
  var MUNICIPALITIES = Array.isArray(window.SAMELCO_MUNICIPALITIES) ? window.SAMELCO_MUNICIPALITIES : [];
  function findMunicipalityByName(name) {
    if (!name) return null;
    var lower = String(name).toLowerCase();
    return MUNICIPALITIES.find(function(m){ return (m.name||'').toLowerCase() === lower; }) || null;
  }
  function findMunicipalityByLocationText(text) {
    if (!text) return null;
    var s = String(text).toLowerCase();
    var hit = MUNICIPALITIES.find(function(m){ return s.indexOf((m.name||'').toLowerCase()) !== -1; });
    return hit || null;
  }
  function distanceApprox(a, b) {
    var Rlat = (a.lat - b.lat), Rlng = (a.lng - b.lng) * Math.cos(a.lat * Math.PI/180);
    return Math.sqrt(Rlat*Rlat + Rlng*Rlng);
  }
  var BRANCH_NAMES = ['Paranas', 'Catbalogan', 'Villareal', 'Basey'];
  var BRANCH_CENTERS = {};
  BRANCH_CENTERS['Paranas'] = findMunicipalityByName('Paranas (Wright)') || findMunicipalityByName('Paranas');
  BRANCH_CENTERS['Catbalogan'] = findMunicipalityByName('Catbalogan City') || findMunicipalityByName('Catbalogan');
  BRANCH_CENTERS['Villareal'] = findMunicipalityByName('Villareal');
  BRANCH_CENTERS['Basey'] = findMunicipalityByName('Basey');
  function inferBranch(muniName) {
    var muni = findMunicipalityByName(muniName) || findMunicipalityByLocationText(muniName);
    if (!muni) return 'Others';
    var best = 'Others', bestD = Infinity;
    BRANCH_NAMES.forEach(function(bn){
      var c = BRANCH_CENTERS[bn];
      if (c && typeof c.lat === 'number' && typeof c.lng === 'number') {
        var d = distanceApprox(muni, c);
        if (d < bestD) { bestD = d; best = bn; }
      }
    });
    return best;
  }

  // helper to recompute branch counters and update cards
  function computeBranchProblems() {
    branchProblems = {
      'Paranas': 0,
      'Catbalogan': 0,
      'Villareal': 0,
      'Basey': 0,
      'Others': 0
    };
    problemLocations.forEach(function(problem) {
      var branch = inferBranch(problem.name || '');
      if (!branchProblems.hasOwnProperty(branch)) branch = 'Others';
      branchProblems[branch]++;
    });

    // Update summary cards
    var activeProblemsEl = document.getElementById('active-problems-count');
    if (activeProblemsEl) {
      activeProblemsEl.textContent = problemLocations.length;
    }
    // total records becomes same as problems length for now
    var totalRecordsEl = document.getElementById('total-records-count');
    if (totalRecordsEl) {
      totalRecordsEl.textContent = problemLocations.length;
    }
    // restored services count from local storage (municipality- and barangay-level)
    var restoredCount = 0;
    try {
      var rLoc = localStorage.getItem('restoredLocations');
      if (rLoc) {
        var arr = JSON.parse(rLoc) || [];
        if (Array.isArray(arr)) restoredCount += arr.length;
      }
    } catch (e) {}
    try {
      var rB = localStorage.getItem('restoredBarangays');
      if (rB) {
        var obj = JSON.parse(rB) || {};
        if (obj && typeof obj === 'object') {
          Object.keys(obj).forEach(function(m) {
            var bucket = obj[m] || {};
            restoredCount += Object.keys(bucket).length;
          });
        }
      }
    } catch (e) {}
    var restoredEl = document.getElementById('restored-services-count');
    if (restoredEl) {
      restoredEl.textContent = restoredCount;
    }
  }

  // function responsible for drawing or updating charts
  var branchPieChart, branchBarChart, trendChart;
  function drawCharts() {
    computeBranchProblems();

    // pie
    const branchChartCanvas = document.getElementById('branch-status-pie-chart');
    if (branchChartCanvas && typeof Chart !== 'undefined') {
      const ctx = branchChartCanvas.getContext('2d');
      Chart.register(ChartDataLabels);
      if (branchPieChart) branchPieChart.destroy();
      branchPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Paranas Main Office', 'Catbalogan Branch Office', 'Villareal Branch Office', 'Basey Branch Office'],
          datasets: [{
            data: [
              branchProblems['Paranas'] || 0,
              branchProblems['Catbalogan'] || 0,
              branchProblems['Villareal'] || 0,
              branchProblems['Basey'] || 0
            ],
            backgroundColor: ['#059669', '#dc2626', '#3b82f6', '#f59e0b'],
            borderColor: ['#047857', '#991b1b', '#1d4ed8', '#d97706'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#0e0d0d', font: { family: "'Outfit', sans-serif", size: 12 } } },
            datalabels: {
              color: '#ffffff',
              font: { weight: 'bold', size: 14, family: "'Outfit', sans-serif" },
              formatter: function(value, context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return percentage + '%';
              }
            }
          }
        }
      });
    }

    // bar
    const comparisonCanvas = document.getElementById('branch-comparison-bar-chart');
    if (comparisonCanvas && typeof Chart !== 'undefined') {
      const compCtx = comparisonCanvas.getContext('2d');
      if (branchBarChart) branchBarChart.destroy();
      branchBarChart = new Chart(compCtx, {
        type: 'bar',
        data: {
          labels: ['Paranas', 'Catbalogan', 'Villareal', 'Basey'],
          datasets: [{
            label: 'Active Issues',
            data: [
              branchProblems['Paranas'] || 0,
              branchProblems['Catbalogan'] || 0,
              branchProblems['Villareal'] || 0,
              branchProblems['Basey'] || 0
            ],
            backgroundColor: ['#059669', '#dc2626', '#3b82f6', '#f59e0b'],
            borderColor: ['#047857', '#991b1b', '#1d4ed8', '#d97706'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { position: 'top', labels: { color: '#0e0d0d', font: { family: "'Outfit', sans-serif", size: 12 } } } },
          scales: {
            y: { beginAtZero: true, ticks: { color: '#0c0c0c', font: { family: "'Outfit', sans-serif" } } },
            x: { ticks: { color: '#000', font: { family: "'Outfit', sans-serif" } } }
          }
        }
      });
    }

    // trend chart still static for now
    const trendChartCanvas = document.getElementById('issues-trend-chart');
    if (trendChartCanvas && typeof Chart !== 'undefined') {
      const trendCtx = trendChartCanvas.getContext('2d');
      if (trendChart) trendChart.destroy();
      trendChart = new Chart(trendCtx, {
        data: {
          labels: ['Feb 12', 'Feb 13', 'Feb 14', 'Feb 15', 'Feb 16', 'Feb 17', 'Feb 18'],
          datasets: [
            { label: 'Paranas', data: [2,2,1,3,2,2,1], borderColor: '#059669', backgroundColor: 'rgba(5, 150, 105, 0.1)', tension: 0.3, fill: true },
            { label: 'Catbalogan', data: [1,2,2,2,3,4,1], borderColor: '#dc2626', backgroundColor: 'rgba(220, 38, 38, 0.1)', tension: 0.3, fill: true },
            { label: 'Villareal', data: [1,1,0,1,1,2,1], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', tension: 0.3, fill: true },
            { label: 'Basey', data: [1,3,1,4,2,4,1], borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', tension: 0.3, fill: true }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { position: 'top', labels: { color: '#070707', font: { family: "'Outfit', sans-serif", size: 12 } } } },
          scales: {
            y: { beginAtZero: true, max: 5, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#0c0c0c', font: { family: "'Outfit', sans-serif" } } },
            x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#000', font: { family: "'Outfit', sans-serif" } } }
          }
        }
      });
    }
  }

  // load analytic data from Supabase if credentials available
  async function loadAnalyticsData() {
    var cfg = window.SAMELCO_SUPABASE || {};
    if (!cfg.url || !cfg.anonKey || !cfg.reportsTable) return;
    try {
      var res = await fetch(cfg.url + '/rest/v1/' + cfg.reportsTable + '?select=*&limit=500', {
        headers: { apikey: cfg.anonKey, Authorization: 'Bearer ' + cfg.anonKey }
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var rows = await res.json();
      if (Array.isArray(rows)) {
        var problems = rows.map(function(r) {
          var locTxt = r.location_text || r.location || r.address || r.municipality || '';
          var found = findMunicipalityByName(r.municipality) || findMunicipalityByLocationText(locTxt);
          var muniName = found ? found.name : (r.municipality || '');
          return { name: muniName, issue: r.issue || r.issue_type || '' };
        }).filter(function(p){ return p.name && p.name.length; });
        localStorage.setItem('problemLocations', JSON.stringify(problems));
        problemLocations = problems;
      }
      computeBranchProblems();
      drawCharts();
    } catch (err) {
      console.warn('Failed to load analytics data:', err);
    }
  }

  // initial draw based on whatever is in local storage
  computeBranchProblems();
  drawCharts();
  // then refresh from Supabase
  loadAnalyticsData();

  // reflect changes when other tabs/pages update restoration flags
  window.addEventListener('storage', function(e) {
    if (e.key === 'restoredLocations' || e.key === 'restoredBarangays' || e.key === 'problemLocations') {
      try {
        var stored = localStorage.getItem('problemLocations');
        if (stored) problemLocations = JSON.parse(stored) || [];
      } catch (e) {}
      computeBranchProblems();
      drawCharts();
    }
  });


});
