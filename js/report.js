document.addEventListener('DOMContentLoaded', function () {
  var cfg = window.SAMELCO_SUPABASE || {};
  var form = document.getElementById('report-form');
  var gpsBtn = document.getElementById('capture-gps-btn');
  var gpsStatus = document.getElementById('gps-status');
  var latEl = document.getElementById('report-lat');
  var lngEl = document.getElementById('report-lng');
  var municipalityEl = document.getElementById('report-municipality');
  var barangayEl = document.getElementById('report-barangay');
  var streetEl = document.getElementById('report-location');
  var municipalityData = [];

  function fillSelectOptions(selectEl, values, placeholder) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    var emptyOpt = document.createElement('option');
    emptyOpt.value = '';
    emptyOpt.textContent = placeholder;
    emptyOpt.selected = true;
    emptyOpt.disabled = true;
    emptyOpt.hidden = true;
    selectEl.appendChild(emptyOpt);

    values.forEach(function (value) {
      var opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      selectEl.appendChild(opt);
    });
  }

  function onMunicipalityChange() {
    if (!municipalityEl || !barangayEl) return;
    var selected = municipalityEl.value;
    var muni = municipalityData.find(function (m) { return m.name === selected; });
    var barangays = muni && Array.isArray(muni.barangays) ? muni.barangays : [];
    fillSelectOptions(barangayEl, barangays, 'Select barangay');
    barangayEl.disabled = !barangays.length;
    if (!barangays.length) barangayEl.value = '';
  }

  function toRadians(value) {
    return value * (Math.PI / 180);
  }

  function distanceKm(lat1, lng1, lat2, lng2) {
    var earthRadiusKm = 6371;
    var dLat = toRadians(lat2 - lat1);
    var dLng = toRadians(lng2 - lng1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  function findNearestMunicipality(latitude, longitude) {
    if (!Array.isArray(municipalityData) || !municipalityData.length) return null;
    var nearest = null;
    var nearestDistance = Infinity;

    municipalityData.forEach(function (m) {
      var mLat = Number(m.lat);
      var mLng = Number(m.lng);
      if (!Number.isFinite(mLat) || !Number.isFinite(mLng)) return;
      var d = distanceKm(latitude, longitude, mLat, mLng);
      if (d < nearestDistance) {
        nearestDistance = d;
        nearest = m;
      }
    });

    return nearest;
  }

  function autoSelectMunicipalityFromGps(latitude, longitude) {
    if (!municipalityEl) return null;
    var nearest = findNearestMunicipality(latitude, longitude);
    if (!nearest) return null;
    var current = municipalityEl.value || '';
    // Huwag galawin ang pinili ng user; auto-fill lang kapag empty
    if (!current) {
      municipalityEl.value = nearest.name;
      onMunicipalityChange();
    }
    return nearest.name; // ibalik ang detected para maipakita sa status
  }

  async function initLocationDropdowns() {
    if (!municipalityEl || !barangayEl) return;
    municipalityData = Array.isArray(window.SAMELCO_MUNICIPALITIES) ? window.SAMELCO_MUNICIPALITIES : [];
    if (!municipalityData.length) {
      console.warn('Municipality dataset not found. Ensure municipalities-data.js is loaded before report.js.');
    }

    var municipalityNames = municipalityData.map(function (m) { return m.name; });
    fillSelectOptions(municipalityEl, municipalityNames, 'Select municipality');
    fillSelectOptions(barangayEl, [], 'Select barangay');
    barangayEl.disabled = true;

    municipalityEl.addEventListener('change', onMunicipalityChange);
  }

  function setGpsStatus(text, ok) {
    if (!gpsStatus) return;
    gpsStatus.textContent = text;
    gpsStatus.style.color = '#111111';
  }

  initLocationDropdowns();

  function captureGpsCoordinates() {
    return new Promise(function (resolve, reject) {
      if (!navigator.geolocation) {
        setGpsStatus('Geolocation not supported in this browser.', false);
        reject(new Error('Geolocation not supported'));
        return;
      }

      setGpsStatus('Capturing GPS...', true);
      navigator.geolocation.getCurrentPosition(function (pos) {
        latEl.value = pos.coords.latitude.toFixed(7);
        lngEl.value = pos.coords.longitude.toFixed(7);
        var detectedMunicipality = autoSelectMunicipalityFromGps(Number(latEl.value), Number(lngEl.value));
        var gpsText = 'GPS captured: ' + latEl.value + ', ' + lngEl.value;
        if (detectedMunicipality) {
          var selectedNow = (municipalityEl && municipalityEl.value) ? municipalityEl.value : '';
          if (selectedNow && selectedNow !== detectedMunicipality) {
            gpsText += ' | Nearby: ' + detectedMunicipality;
          } else {
            gpsText += ' | Municipality: ' + detectedMunicipality;
          }
        }
        setGpsStatus(gpsText, true);
        resolve({ latitude: Number(latEl.value), longitude: Number(lngEl.value) });
      }, function () {
        setGpsStatus('Unable to capture GPS. Please enable location permission and try again.', false);
        reject(new Error('Unable to capture GPS'));
      }, { enableHighAccuracy: true, timeout: 12000 });
    });
  }

  if (gpsBtn) {
    gpsBtn.addEventListener('click', async function () {
      try {
        await captureGpsCoordinates();
      } catch (_) {
        // Status is already updated in captureGpsCoordinates.
      }
    });
  }

  function autoCaptureGpsOnLoad() {
    if (!latEl || !lngEl) return;
    if (latEl.value && lngEl.value) return;
    captureGpsCoordinates().catch(function () {
      setGpsStatus('Auto GPS capture unavailable. Tap "Capture GPS".', false);
    });
  }

  autoCaptureGpsOnLoad();

  async function insertReport(row) {
    var res = await fetch(cfg.url + '/rest/v1/' + cfg.reportsTable, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: cfg.anonKey,
        Authorization: 'Bearer ' + cfg.anonKey,
        Prefer: 'return=representation'
      },
      body: JSON.stringify(row)
    });
    if (!res.ok) {
      var errText = await res.text();
      throw new Error(errText || ('HTTP ' + res.status));
    }
    return res.json();
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!cfg.url || !cfg.anonKey || !cfg.reportsTable) {
        alert('Supabase config is missing.');
        return;
      }

      if (!latEl.value || !lngEl.value) {
        try {
          await captureGpsCoordinates();
        } catch (_) {
          alert('Exact location is required. Please allow GPS/location permission, then submit again.');
          return;
        }
      }

      var latitude = Number(latEl.value);
      var longitude = Number(lngEl.value);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        alert('Invalid GPS coordinates captured. Please tap "Capture GPS" and submit again.');
        return;
      }

      var selectedMunicipality = municipalityEl ? municipalityEl.value : '';
      var selectedBarangay = barangayEl ? barangayEl.value : '';
      var streetValue = streetEl ? streetEl.value.trim() : '';
      if (!selectedMunicipality || !selectedBarangay || !streetValue) {
        alert('Please select municipality, select barangay, and type the street.');
        return;
      }

      var descEl = document.getElementById('report-description');
      var description = descEl ? String(descEl.value || '').trim() : '';
      var row = {
        full_name: document.getElementById('report-name').value.trim(),
        contact: document.getElementById('report-contact').value.trim(),
        location_text: streetValue + ', ' + selectedBarangay + ', ' + selectedMunicipality,
        issue_type: document.getElementById('report-issue').value.trim(),
        description: description,
        latitude: latitude,
        longitude: longitude,
        source: 'messenger_form'
      };

      try {
        await insertReport(row);
        alert('Report submitted successfully.');
        form.reset();
        latEl.value = '';
        lngEl.value = '';
        if (barangayEl) {
          fillSelectOptions(barangayEl, [], 'Select barangay');
          barangayEl.disabled = true;
        }
        setGpsStatus('GPS not captured yet', false);
      } catch (err) {
        console.error(err);
        alert('Failed to submit report. Please verify the "reports" table and RLS insert policy in Supabase.');
      }
    });
  }
});
