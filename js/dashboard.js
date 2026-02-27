document.addEventListener('DOMContentLoaded', function () {
  // Check if user is logged in
  var userName = localStorage.getItem('userName');
  if (!userName) {
    window.location.href = 'index.html';
    return;
  }

  // Display user name
  document.getElementById('user-name').textContent = userName;

  // Logout functionality
  function logout() {
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
  }

  var logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      logout();
    });
  }

  // Branches button (top of nav) â€“ show dropdown with choices
  var branchesBtn = document.getElementById('branches-btn');
  var branchDropdown = document.getElementById('branch-dropdown');
  if (branchesBtn && branchDropdown) {
    branchesBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var open = branchDropdown.classList.toggle('is-open');
    });
    document.addEventListener('click', function() {
      branchDropdown.classList.remove('is-open');
    });
    branchDropdown.addEventListener('click', function(e) { e.stopPropagation(); });

    // branch selection
    branchDropdown.querySelectorAll('.branch-option').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var branch = this.getAttribute('data-branch');
        localStorage.setItem('selectedBranch', branch);
        window.location.href = 'records.html';
      });
    });
  }

  // Three-dots menu toggle
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
    navDotsDropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    navDotsDropdown.querySelectorAll('.nav-dots-item').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var action = this.getAttribute('data-action');
        navDotsDropdown.classList.remove('is-open');
        if (action === 'home') {
          window.location.href = 'dashboard.html';
        } else if (action === 'records') {
          window.location.href = 'records.html';
        } else if (action === 'analytics') {
          window.location.href = 'analytics.html';
        } else if (action === 'branches') {
          window.location.href = 'branches.html';
        } else if (action === 'etc') {
          window.location.href = 'about.html';
        } else if (action === 'contact') {
          window.location.href = 'contact.html';
        }
        else if (action === 'logout') {
          logout();
        }
      });
    });
  }

  // Municipalities data - All municipalities and cities in Samar province (26 total)
  var municipalities = [
    { name: 'Almagro', lat: 11.9167, lng: 124.2833, barangays: ['Bacjao', 'Biasong I', 'Biasong II', 'Costa Rica', 'Costa Rica II', 'Guin-ansan', 'Imelda', 'Kerikite', 'Lunang I', 'Lunang II', 'Mabuhay', 'Magsaysay', 'Malobago', 'Marasbaras', 'Panjobjoban I', 'Panjobjoban II', 'Poblacion', 'RoÃ±o', 'San Isidro', 'San Jose', 'Talahid', 'Tonga-tonga', 'Veloso'] },
    { name: 'Basey', lat: 11.2833, lng: 125.0667, barangays: ['Amandayehan', 'Anglit', 'Bacubac', 'Balante', 'Baloog', 'Basiao', 'Baybay', 'Binongtu-an', 'Buenavista', 'Bulao', 'Burgos', 'Buscada', 'Cambayan', 'Can-abay', 'Cancaiyas', 'Canmanila', 'Catadman', 'Cogon', 'Del Pilar', 'Dolongan', 'Guintigui-an', 'Guirang', 'Iba', 'Inuntan', 'Lawa-an', 'Loog', 'Loyo', 'Mabini', 'Magallanes', 'Manlilinab', 'May-it', 'Mercado', 'Mongabong', 'New San Agustin', 'Nouvelas Occidental', 'Old San Agustin', 'Palaypay', 'Panugmonon', 'Pelit', 'Roxas', 'Salvacion', 'San Antonio', 'San Fernando', 'Sawa', 'Serum', 'Sugca', 'Sugponon', 'Sulod', 'Tinaogan', 'Tingib', 'Villa Aurora'] },
    { name: 'Calbayog City', lat: 12.0672, lng: 124.5972, barangays: ['Acedillo', 'Aguit-itan', 'Alibaba', 'Amampacang', 'Anislag', 'Awang East', 'Awang West', 'Ba-ay', 'Bagacay', 'Bagong Lipunan', 'Baja', 'Balud', 'Bante', 'Bantian', 'Basud', 'Bayo', 'Begaho', 'Binaliw', 'Bontay', 'Buenavista', 'Bugtong', 'Cabacungan', 'Cabatuan', 'Cabicahan', 'Cabugawan', 'Cacaransan', 'Cag-anahaw', 'Cag-anibong', 'Cag-olango', 'Cagbanayacao', 'Cagbayang', 'Cagbilwang', 'Cagboborac', 'Caglanipao Sur', 'Cagmanipes Norte', 'Cagmanipes Sur', 'Cagnipa', 'Cagsalaosao', 'Cahumpan', 'Calocnayan', 'Cangomaod', 'Canhumadac', 'Capacuhan', 'Capoocan', 'Carayman', 'Carmen', 'Catabunan', 'Caybago', 'Central', 'Cogon', 'Dagum', 'Danao I', 'Danao II', 'Dawo', 'De Victoria', 'Dinabongan', 'Dinagan', 'Dinawacan', 'Esperanza', 'Gamay', 'Gadgaran', 'Gasdo', 'Geraga-an', 'Guimbaoyan Norte', 'Guimbaoyan Sur', 'Guin-on', 'Hamorawon', 'Helino', 'Hibabngan', 'Hibatang', 'Higasaan', 'Himalandrog', 'Hugon Rosales', 'Jacinto', 'Jimautan', 'Jose A. RoÃ±o', 'Kalilihan', 'Kilikili', 'La Paz', 'Langoyon', 'Lapaan', 'Libertad', 'Limarayon', 'Longsob', 'Lonoy', 'Looc', 'Mabini I', 'Mabini II', 'Macatingog', 'Mag-ubay', 'Maguino-o', 'Malaga', 'Malajog', 'Malayog', 'Malopalo', 'Mancol', 'Mantaong', 'Manuel Barral, Sr.', 'Marcatubig', 'Matobato', 'Mawacat', 'Maybog', 'Maysalong', 'Migara', 'Nabang', 'Naga', 'Naguma', 'Navarro', 'Nijaga', 'Oboob', 'Obrero', 'Olera', 'Oquendo', 'OsmeÃ±a', 'Pagbalican', 'Palanas', 'Palanogan', 'Panlayahan', 'Panonongan', 'Panoypoy', 'Patong', 'Payahan', 'PeÃ±a', 'Pilar', 'Pinamorotan', 'Quezon', 'Rawis', 'Rizal I', 'Rizal II', 'Roxas I', 'Roxas II', 'Saljag', 'Salvacion', 'San Antonio', 'San Isidro', 'San Joaquin', 'San Jose', 'San Policarpio', 'San Rufino', 'Saputan', 'Sigo', 'Sinantan', 'Sinidman Occidental', 'Sinidman Oriental', 'Tabawan', 'Talahiban', 'Tanval', 'Tapa-e', 'Tarabucan', 'Tigbe', 'Tinambacan Norte', 'Tinambacan Sur', 'Tinaplacan', 'Tomaliguez', 'Trinidad', 'Victory', 'Villahermosa'] },
    { name: 'Calbiga', lat: 11.6167, lng: 125.0167, barangays: ['Antol', 'Bacyaran', 'Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5', 'Barangay 6', 'Barangay 7', 'Barobaybay', 'Beri', 'Binanggaran', 'Borong', 'Bulao', 'Buluan', 'Caamlongan', 'Calayaan', 'Calingonan', 'Canbagtic', 'Canticum', 'Daligan', 'Guinbanga', 'Hindang', 'Hubasan', 'Literon', 'Lubang', 'Macaalan', 'Mahangcao', 'Malabal', 'Minata', 'Otoc', 'Panayuran', 'Pasigay', 'Patong', 'Polangi', 'Rawis', 'San Ignacio', 'San Mauricio', 'Sinalangtan', 'Timbangan', 'Tinago'] },
    { name: 'Catbalogan City', lat: 11.7792, lng: 124.8842, barangays: ['Albalate', 'Bagongon', 'Bangon', 'Basiao', 'Buluan', 'Bunuanan', 'Cabugawan', 'Cagudalo', 'Cagusipan', 'Cagutian', 'Cagutsan', 'Canhawan Gote', 'Canlapwas', 'Cawayan', 'Cinco', 'Darahuway Daco', 'Darahuway Gote', 'Estaka', 'Guindaponan', 'Guinsorongan', 'Ibol', 'Iguid', 'Lagundi', 'Libas', 'Lobo', 'Manguehay', 'Maulong', 'Mercedes', 'Mombon', 'MuÃ±oz', 'New Mahayag', 'Old Mahayag', 'Palanyogon', 'Pangdan', 'Payao', 'Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Poblacion 4', 'Poblacion 5', 'Poblacion 6', 'Poblacion 7', 'Poblacion 8', 'Poblacion 9', 'Poblacion 10', 'Poblacion 11', 'Poblacion 12', 'Poblacion 13', 'Pupua', 'Rama', 'San Andres', 'San Pablo', 'San Roque', 'San Vicente', 'Silanga', 'Socorro', 'Totoringon'] },
    { name: 'Daram', lat: 11.6333, lng: 124.7833, barangays: ['Arawane', 'Astorga', 'Bachao', 'Baclayan', 'Bagacay', 'Bayog', 'Betaug', 'Birawan', 'Bono-anon', 'Buenavista', 'Burgos', 'Cabac', 'Cabil-isan', 'Cabiton-an', 'Cabugao', 'Cagboboto', 'Calawan-an', 'Cambuhay', 'Campelipa', 'Candugue', 'Canloloy', 'Cansaganay', 'Casab-ahan', 'Guindapunan', 'Guintampilan', 'Iquiran', 'Jacopon', 'Losa', 'Lucob-lucob', 'Mabini', 'Macalpe', 'Mandoyucan', 'Marupangdan', 'Mayabay', 'Mongolbongol', 'Nipa', 'Parasan', 'Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Pondang', 'Poso', 'Real', 'Rizal', 'San Antonio', 'San Jose', 'San Miguel', 'San Roque', 'San Vicente', 'Saugan', 'So-ong', 'Sua', 'Sugod', 'Talisay', 'Tugas', 'Ubo', 'Valles-Bello', 'Yangta'] },
    { name: 'Gandara', lat: 12.0167, lng: 124.8167, barangays: ['Adela Heights', 'Arong', 'Balocawe', 'Bangahon', 'Beslig', 'Buao', 'Bunyagan', 'Burabod I', 'Burabod II', 'Calirocan', 'Canhumawid', 'Caparangasan', 'Caranas', 'Carmona', 'Casab-ahan', 'Casandig', 'Catorse de Agosto', 'Caugbusan', 'Concepcion', 'Diaz', 'Dumalo-ong', 'Elcano', 'Gerali', 'Gereganan', 'Giaboc', 'Hampton', 'Hetebac', 'Himamaloto', 'Hinayagan', 'Hinugacan', 'Hiparayan', 'Jasminez', 'Lungib', 'Mabuhay', 'Macugo', 'Malayog', 'Marcos', 'Minda', 'Nacube', 'Nalihugan', 'Napalisan', 'Natimonan', 'Ngoso', 'Palambrag', 'Palanas', 'Pizarro', 'PiÃ±aplata', 'Pologon', 'Purog', 'Rawis', 'Rizal', 'Samoyao', 'San Agustin', 'San Antonio', 'San Enrique', 'San Francisco', 'San Isidro', 'San Jose', 'San Miguel', 'San Pelayo', 'San Ramon', 'Santa Elena', 'Santo NiÃ±o', 'Senibaran', 'Sidmon', 'Tagnao', 'Tambongan', 'Tawiran', 'Tigbawon'] },
    { name: 'Hinabangan', lat: 11.6833, lng: 125.0833, barangays: ['Bagacay', 'Binobucalan', 'Bucalan', 'Cabalagnan', 'Cabang', 'Canano', 'Concord', 'Consolabao', 'Dalosdoson', 'Fatima', 'Lim-ao', 'Malihao', 'Mugdo', 'OsmeÃ±a', 'Poblacion 1', 'Poblacion 2', 'Rawis', 'San Jose', 'San Rafael', 'Tabay', 'Yabon'] },
    { name: 'Jiabong', lat: 11.7667, lng: 124.9500, barangays: ['Barangay No. 1', 'Barangay No. 2', 'Barangay No. 3', 'Barangay No. 4', 'Barangay No. 5', 'Barangay No. 6', 'Barangay No. 7', 'Barangay No. 8', 'Bawang', 'Bugho', 'Camarobo-an', 'Candayao', 'Cantongtong', 'Casapa', 'Catalina', 'Cristina', 'Dogongan', 'Garcia', 'Hinaga', 'Jia-an', 'Jidanao', 'Lulugayan', 'Macabetas', 'Malino', 'Malobago', 'Mercedes', 'Nagbac', 'Parina', 'Salvacion', 'San Andres', 'San Fernando', 'San Miguel', 'Tagbayaon', 'Victory'] },
    { name: 'Marabut', lat: 11.1167, lng: 125.2167, barangays: ['Amambucale', 'Amantillo', 'Binukyahan', 'Caluwayan', 'Canyoyo', 'Catato Poblacion', 'Ferreras', 'Legaspi', 'Lipata', 'Logero', 'Mabuhay', 'Malobago', 'Odoc', 'OsmeÃ±a', 'Panan-awan', 'Pinalanga', 'Pinamitinan', 'RoÃ±o', 'San Roque', 'Santa Rita', 'Santo NiÃ±o Poblacion', 'Tagalag', 'Tinabanan', 'Veloso'] },
    { name: 'Matuguinao', lat: 12.1333, lng: 124.8833, barangays: ['Angyap', 'Bag-otan', 'Barruz', 'Camonoan', 'Carolina', 'Deit', 'Del Rosario', 'Inubod', 'Libertad', 'Ligaya', 'Mabuligon Poblacion', 'Maduroto Poblacion', 'Mahanud', 'Mahayag', 'Nagpapacao', 'Rizal', 'Salvacion', 'San Isidro', 'San Roque', 'Santa Cruz'] },
    { name: 'Motiong', lat: 11.7833, lng: 125.0000, barangays: ['Angyap', 'Barayong', 'Bayog', 'Beri', 'Bonga', 'Calantawan', 'Calapi', 'Caluyahan', 'Canatuan', 'Candomacol', 'Canvais', 'Capaysagan', 'Caranas', 'Caulayanan', 'Hinica-an', 'Inalad', 'Linonoban', 'Malobago', 'Malonoy', 'Mararangsi', 'Maypange', 'New Minarog', 'Oyandic', 'Pamamasan', 'Poblacion I', 'Poblacion I-A', 'Pusongan', 'San Andres', 'Santo NiÃ±o', 'Sarao'] },
    { name: 'Pagsanghan', lat: 11.9667, lng: 124.7167, barangays: ['Bangon', 'Buenos Aires', 'Calanyugan', 'Caloloma', 'Cambaye', 'Canlapwas', 'Libertad', 'PaÃ±ge', 'San Luis', 'Santo NiÃ±o', 'Viejo', 'Villahermosa Occidental', 'Villahermosa Oriental'] },
    { name: 'Paranas (Wright)', lat: 11.8500, lng: 125.1167, barangays: ['Anagasi', 'Apolonia', 'Bagsa', 'Balbagan', 'Bato', 'Buray', 'Cantaguic', 'Cantao-an', 'Cantato', 'Casandig I', 'Casandig II', 'Cawayan', 'Concepcion', 'Jose RoÃ±o', 'Lawaan I', 'Lawaan II', 'Lipata', 'Lokilokon', 'Mangcal', 'Maylobe', 'Minarog', 'Nawi', 'Pabanog', 'Paco', 'Pagsa-ogan', 'Pagsanjan', 'Patag', 'Pequit', 'Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Poblacion 4', 'Poblacion 5', 'Poblacion 6', 'Salay', 'San Isidro', 'Santo NiÃ±o', 'Sulopan', 'Tabucan', 'Tapul', 'Tenani', 'Tigbawon', 'Tula', 'Tutubigan'] },
    { name: 'Pinabacdao', lat: 11.6167, lng: 124.9833, barangays: ['Bangon', 'Barangay I', 'Barangay II', 'Botoc', 'Bugho', 'Calampong', 'Canlobo', 'Catigawan', 'Dolores', 'Lale', 'Lawaan', 'Laygayon', 'Layo', 'Loctob', 'Madalunot', 'Magdawat', 'Mambog', 'Manaing', 'Nabong', 'Obayan', 'Pahug', 'Parasanon', 'Pelaon', 'San Isidro'] },
    { name: 'San Jorge', lat: 11.3000, lng: 125.0833, barangays: ['Anquiana', 'Aurora', 'Bay-ang', 'Blanca Aurora', 'Buenavista I', 'Buenavista II', 'Bulao', 'Bungliw', 'Cabugao', 'Cag-olo-olo', 'Calundan', 'Cantaguic', 'Canyaki', 'Cogtoto-og', 'Erenas', 'Gayondato', 'Guadalupe', 'Guindapunan', 'Hernandez', 'Himay', 'Janipon', 'La Paz', 'Libertad', 'Lincoro', 'Mabuhay', 'Mancol', 'Matalud', 'Mobo-ob', 'Mombon', 'Puhagan', 'Quezon', 'Ranera', 'Rawis', 'Rosalim', 'San Isidro', 'San Jorge I', 'San Jorge II', 'San Juan', 'Sapinit', 'Sinit-an', 'Tomogbong'] },
    { name: 'San Jose de Buan', lat: 12.0500, lng: 125.0333, barangays: ['Aguingayan', 'Babaclayon', 'Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Can-aponte', 'Cataydongan', 'Gusa', 'Hagbay', 'Hibaca-an', 'Hiduroma', 'Hilumot', 'San Nicolas'] },
    { name: 'San Sebastian', lat: 11.7000, lng: 125.0167, barangays: ['Balogo', 'Bontod', 'Cabaywa', 'Camanhagay', 'Campiyak', 'Canduyucan', 'Dolores', 'Hita-asan I', 'Hita-asan II', 'Inobongan', 'Poblacion Barangay 1', 'Poblacion Barangay 2', 'Poblacion Barangay 3', 'Poblacion Barangay 4'] },
    { name: 'Santa Margarita', lat: 12.0378, lng: 124.6584, barangays: ['Agrupacion', 'Arapison', 'Avelino', 'Bahay', 'Balud', 'Bana-ao', 'Burabod', 'Cagsumje', 'Cautod (Poblacion)', 'Camperito', 'Campeig', 'Can-ipulan', 'Canmoros', 'Cinco', 'Curry', 'Gajo', 'Hindang', 'Ilo', 'Imelda', 'Inoraguiao', 'Jolacao', 'Lambao', 'Mabuhay', 'Mahayag', 'Matayonas', 'Monbon (Poblacion)', 'Nabulo', 'Napuro I', 'Napuro II', 'Palale', 'Panabatan', 'Panaruan', 'Roxas', 'Salvacion', 'Solsogon', 'Sundara'] },
    { name: 'Santa Rita', lat: 11.4500, lng: 124.9333, barangays: ['Alegria', 'Anibongan', 'Aslum', 'Bagolibas', 'Binanalan', 'Bokinggan Poblacion', 'Bougainvilla Poblacion', 'Cabacungan', 'Cabunga-an', 'Camayse', 'Cansadong', 'Caticugan', 'Dampigan', 'Guinbalot-an', 'Gumamela Poblacion', 'Hinangudtan', 'Igang-igang', 'La Paz', 'Lupig', 'Magsaysay', 'Maligaya', 'New Manunca', 'Old Manunca', 'Pagsulhogon', 'Rosal Poblacion', 'Salvacion', 'San Eduardo', 'San Isidro', 'San Juan', 'San Pascual', 'San Pedro', 'San Roque', 'Santa Elena', 'Santan Poblacion', 'Tagacay', 'Tominamos', 'Tulay', 'Union'] },
    { name: 'Santo NiÃ±o', lat: 11.9833, lng: 124.4667, barangays: ['Balatguti', 'Baras', 'Basud', 'Buenavista', 'Cabunga-an', 'Corocawayan', 'Ilijan', 'Ilo', 'Lobelobe', 'Pinanangnan', 'Sevilla', 'Takut', 'Villahermosa'] },
    { name: 'Tagapul-an', lat: 11.9500, lng: 124.8333, barangays: ['Baguiw', 'Balocawe', 'Guinbarucan', 'Labangbaybay', 'Luna', 'Mataluto', 'Nipa', 'Pantalan', 'Pulangbato', 'San Jose', 'San Vicente', 'Suarez', 'Sugod', 'Trinidad'] },
    { name: 'Talalora', lat: 11.5333, lng: 124.8333, barangays: ['Bo. Independencia', 'Malaguining', 'Mallorga', 'Navatas Daku', 'Navatas Guti', 'Placer', 'Poblacion Barangay 1', 'Poblacion Barangay 2', 'San Juan', 'Tatabunan', 'Victory'] },
    { name: 'Tarangnan', lat: 11.9000, lng: 124.7500, barangays: ['Alcazar', 'Awang', 'Bahay', 'Balonga-as', 'Balugo', 'Bangon Gote', 'Baras', 'Binalayan', 'Bisitahan', 'Bonga', 'Cabunga-an', 'Cagtutulo', 'Cambatutay Nuevo', 'Cambatutay Viejo', 'Canunghan', 'Catan-agan', 'Dapdap', 'Gallego', 'Imelda Poblacion', 'Lahong', 'Libucan Dacu', 'Libucan Gote', 'Lucerdoni', 'Majacob', 'Mancares', 'Marabut', 'Oeste-A', 'Oeste-B', 'Pajo', 'Palencia', 'Poblacion A', 'Poblacion B', 'Poblacion C', 'Poblacion D', 'Poblacion E', 'San Vicente', 'Santa Cruz', 'Sugod', 'Talinga', 'Tigdaranao', 'Tizon'] },
    { name: 'Villareal', lat: 11.5667, lng: 124.9333, barangays: ['Banquil', 'Bino-ongan', 'Burabod', 'Cambaguio', 'Canmucat', 'Central', 'Conant', 'Guintarcan', 'Himyangan', 'Igot', 'Inarumbacan', 'Inasudlan', 'Lam-awan', 'Lamingao', 'Lawa-an', 'Macopa', 'Mahayag', 'Malonoy', 'Mercado', 'Miramar', 'Nagcaduha', 'Pacao', 'Pacoyoy', 'Pangpang', 'Patag', 'Plaridel', 'Polangi', 'San Andres', 'San Fernando', 'San Rafael', 'San Roque', 'Santa Rosa', 'Santo NiÃ±o', 'Soledad', 'Tayud', 'Tomabe', 'Ulayan', 'Villarosa Poblacion'] },
    { name: 'Zumarraga', lat: 11.6333, lng: 124.8500, barangays: ['Alegria', 'Arteche', 'Bioso', 'Boblaran', 'Botaera', 'Buntay', 'Camayse', 'Canwarak', 'Ibarra', 'Lumalantang', 'Macalunod', 'Maga-an', 'Maputi', 'Marapilit', 'Monbon', 'Mualbual', 'Pangdan', 'Poblacion 1', 'Poblacion 2', 'Poro', 'San Isidro', 'Sugod', 'Talib', 'Tinaugan', 'Tubigan'] }
  ];
  // Prefer shared data if available (single source of truth across pages)
  if (Array.isArray(window.SAMELCO_MUNICIPALITIES) && window.SAMELCO_MUNICIPALITIES.length) {
    municipalities = window.SAMELCO_MUNICIPALITIES;
  }

  // Add all municipalities above to the right side panel
  var sidebarList = document.getElementById('municipalities-sidebar-list');
  if (sidebarList) {
    municipalities.forEach(function(m) {
      var item = document.createElement('div');
      item.className = 'sidebar-municipality-item';
      var barangayCount = Array.isArray(m.barangays) ? m.barangays.length : m.barangays;
      var header = document.createElement('div');
      header.innerHTML = '<h4>' + m.name + ' <span class="issue-badge new" style="display:none;"></span> <span class="issue-badge pending" style="display:none;"></span></h4><p>' + barangayCount + ' Barangays</p>';
      item.appendChild(header);
      var bList = document.createElement('div');
      bList.className = 'sidebar-barangays';
      bList.style.display = 'none';
      if (Array.isArray(m.barangays)) {
        m.barangays.forEach(function(b) {
          var bItem = document.createElement('div');
          bItem.className = 'barangay-item-sidebar';
          bItem.textContent = b;
          bList.appendChild(bItem);
        });
      }
      item.appendChild(bList);
      item.addEventListener('click', function() {
        bList.style.display = (bList.style.display === 'none') ? 'block' : 'none';
        if (window.map) window.map.setView([m.lat, m.lng], 11);
        var mk = municipalityMarkersIndex[(m.name || '').toLowerCase()];
        if (mk) mk.openPopup();
      });
      item.setAttribute('data-name', m.name);
      sidebarList.appendChild(item);
    });
  }

  // Initialize Map - Focused on Samar
  var map = L.map('map', {
    center: [11.7, 124.9],
    zoom: 10,
    minZoom: 9,
    maxZoom: 13,
    zoomControl: true,
    scrollWheelZoom: true,
    maxBounds: [[10.5, 124.0], [12.5, 125.5]]
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Â© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  var customIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div class="marker-pin"></div>',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });

  // New Compliance (red)
  var newIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div class="marker-pin marker-pin-new"></div>',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });

  // Pending (orange)
  var pendingIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div class="marker-pin marker-pin-pending"></div>',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });

  var restoredIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div class="marker-pin marker-pin-restored"></div>',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });

  var municipalityMarkersLayer = L.layerGroup().addTo(map);
  var reportMarkersLayer = L.layerGroup().addTo(map);
  var municipalityMarkersIndex = {};
  var reportMarkersIndex = {};

  // Deep-link target opening support
  var _pendingOpenTarget = null;
  function setPendingTargetFromUrl() {
    try {
      var sp = new URLSearchParams(window.location.search);
      var rawLoc = sp.get('location') || '';
      var mName = sp.get('mun') || sp.get('municipality') || sp.get('m') || '';
      var bName = sp.get('brgy') || sp.get('barangay') || sp.get('b') || '';
      if (!mName && rawLoc) {
        var found = findMunicipalityByLocationText(rawLoc);
        if (found) mName = found.name;
        // try to extract barangay token
        var pb = parseBarangayFromLocationText(rawLoc);
        if (pb) bName = pb;
      }
      if (!mName) return;
      var key = (mName || '').toLowerCase() + '|' + normalizeBarangayName(bName || '');
      _pendingOpenTarget = { key: key };
    } catch (e) {}
  }
  setPendingTargetFromUrl();

  // Alerts setup
  var alertsEnabled = localStorage.getItem('alertsEnabled') === '1';
  var alarmEl = document.getElementById('alarm-audio');
  var alarmPerm = document.getElementById('alarm-permission');
  var enableAlertsBtn = document.getElementById('enable-alerts-btn');
  function initAlarmSource() {
    if (!alarmEl) return;
    var candidates = ['../assest/audio/alarm.mp3', '../assets/audio/alarm.mp3'];
    var i = 0;
    function tryNext() {
      if (i >= candidates.length) return;
      var src = candidates[i++];
      var onError = function() {
        alarmEl.removeEventListener('error', onError);
        tryNext();
      };
      alarmEl.addEventListener('error', onError, { once: true });
      alarmEl.src = src;
      try { alarmEl.load(); } catch (e) {}
    }
    tryNext();
  }
  initAlarmSource();
  if (enableAlertsBtn) {
    enableAlertsBtn.addEventListener('click', function() {
      alertsEnabled = true;
      localStorage.setItem('alertsEnabled', '1');
      if (alarmPerm) alarmPerm.style.display = 'none';
      // prime audio by a user gesture
      if (alarmEl && alarmEl.pause) {
        try { alarmEl.currentTime = 0; alarmEl.play().then(function(){ alarmEl.pause(); }); } catch(e){}
      }
    });
  }
  function showEnableBanner() {
    if (alarmPerm && !alertsEnabled) alarmPerm.style.display = 'flex';
  }
  function simpleBeep(times) {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var duration = 0.15;
      var t = ctx.currentTime;
      for (var i=0;i<(times||1);i++) {
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(880, t + i*0.25);
        g.gain.setValueAtTime(0.001, t + i*0.25);
        g.gain.exponentialRampToValueAtTime(0.3, t + i*0.25 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + i*0.25 + duration);
        o.connect(g).connect(ctx.destination);
        o.start(t + i*0.25);
        o.stop(t + i*0.25 + duration);
      }
    } catch(e){}
  }
  var lastNewCount = -1;
  var alarmInitialized = false;
  function triggerAlarmIfActive(rows) {
    if (!Array.isArray(rows)) return;
    var counts = { new: 0, pending: 0 };
    rows.forEach(function(r){
      var n = r.name || 'Unknown';
      if (restoredLocations.some(function(rr){ return rr.name === n; })) return;
      var b = resolveBarangayForReport(r) || r.barangay || '';
      if (isBarangayRestored(n, b)) return;
      var assignedTeam = getAssignedTeam(n);
      if (assignedTeam) counts.pending += 1;
      else if (isNew(r.createdAt)) counts.new += 1;
      else counts.pending += 1;
    });
    var newCount = counts.new;
    if (!alarmInitialized) {
      alarmInitialized = true;
      lastNewCount = newCount;
      return;
    }
    if (newCount <= lastNewCount) {
      lastNewCount = newCount; // update downward silently
      return;
    }
    lastNewCount = newCount;
    if (!alertsEnabled) { showEnableBanner(); return; }
    var played = false;
    if (alarmEl && typeof alarmEl.play === 'function') {
      try {
        alarmEl.currentTime = 0;
        alarmEl.play();
        played = true;
      } catch (e) {
        played = false;
      }
    }
    if (!played) {
      simpleBeep(3);
      showEnableBanner();
    }
  }

  // read restored locations so dashboard can display status
  var restoredLocations = [];
  try {
    var storedR = localStorage.getItem('restoredLocations');
    if (storedR) {
      restoredLocations = JSON.parse(storedR);
    }
  } catch (e) {
    console.error('Error parsing restored locations:', e);
  }
  var pendingAssignments = {};
  try {
    var storedPA = localStorage.getItem('pendingAssignments');
    if (storedPA) pendingAssignments = JSON.parse(storedPA) || {};
  } catch (e) {}
  function getAssignedTeam(name) {
    return pendingAssignments[(name || '').toLowerCase()] || '';
  }
  function setAssignedTeam(name, team) {
    if (!name) return;
    var key = (name || '').toLowerCase();
    if (team) pendingAssignments[key] = team; else delete pendingAssignments[key];
    localStorage.setItem('pendingAssignments', JSON.stringify(pendingAssignments));
  }
  var restoredBarangays = {};
  try {
    var storedRB = localStorage.getItem('restoredBarangays');
    if (storedRB) {
      restoredBarangays = JSON.parse(storedRB) || {};
    }
  } catch (e) {}
  function isBarangayRestored(mName, bName) {
    if (!mName || !bName) return false;
    var bucket = restoredBarangays[mName] || {};
    return !!bucket[normalizeBarangayName(bName)];
  }
  function markBarangayRestored(mName, bName) {
    if (!mName || !bName) return;
    var norm = normalizeBarangayName(bName);
    if (!restoredBarangays[mName]) restoredBarangays[mName] = {};
    restoredBarangays[mName][norm] = true;
    localStorage.setItem('restoredBarangays', JSON.stringify(restoredBarangays));
  }

  function isNew(createdAt) {
    if (!createdAt) return false;
    var t = Date.parse(createdAt);
    if (isNaN(t)) return false;
    var THRESHOLD_HOURS = 24;
    return (Date.now() - t) <= THRESHOLD_HOURS * 3600 * 1000;
  }

  function renderMunicipalityMarkers(locations) {
    municipalityMarkersLayer.clearLayers();
    municipalities.forEach(function(m) {
      var muniReports = locations.filter(function(p) { return p.name === m.name; });
      // exclude barangays marked as restored
      var visibleReports = muniReports.filter(function(r) {
        var b = resolveBarangayForReport(r) || r.barangay || '';
        return !isBarangayRestored(m.name, b);
      });
      var hasProblem = visibleReports.length > 0;
      var isRestored = restoredLocations.some(function(r) { return r.name === m.name; });
      var hasNew = visibleReports.some(function(r) { return isNew(r.createdAt); });
      var isParanas = /paranas/i.test(m.name);
      var assignedTeam = getAssignedTeam(m.name);
      var isAssigned = !!assignedTeam;
      var icon;
      if (hasProblem) {
        if (isParanas) icon = restoredIcon;
        else if (isRestored) icon = restoredIcon;
        else if (isAssigned) icon = pendingIcon;
        else if (hasNew) icon = newIcon;
        else icon = pendingIcon;
      } else {
        icon = isParanas ? restoredIcon : customIcon;
      }
      var marker = L.marker([m.lat, m.lng], { icon: icon }).addTo(municipalityMarkersLayer);
      municipalityMarkersIndex[(m.name || '').toLowerCase()] = marker;
      if (hasProblem) {
        var problem = visibleReports[0] || {};
        var statusText = isRestored ? 'Restored' : (isAssigned ? 'Pending' : (hasNew ? 'New Compliance' : 'Pending'));
        var statusColor = isRestored ? 'green' : (isAssigned ? '#f97316' : (hasNew ? '#dc2626' : '#f97316'));
        var statusLine = '<br><span style="color:' + statusColor + ';">Status: ' + statusText + '</span>';
        var teamSel = '<br><label style="display:block; margin-top:4px;">Team: <select class="team-select" style="min-width:140px;"><option value="">Select team</option><option>Line Crew A</option><option>Line Crew B</option><option>Maintenance</option><option>Inspection</option></select></label>';
        var assigned = assignedTeam;
        marker.bindPopup('<strong>' + m.name + '</strong><br>' + (problem.barangay || 'Location not set') + '<br><span style="color:#dc2626;">' + (problem.issue || 'Reported issue') + '</span>' + statusLine + (isRestored ? '' : teamSel + '<a href="#" class="pending-assign" style="text-decoration:none; display:block; margin-top:4px;">Set Pending</a>') + (assigned ? '<br><small>Assigned: ' + assigned + '</small>' : '') + '<br><a href="#" class="view-records" style="text-decoration:none; display:block; margin-top:4px;">View in Records</a><a href="#" class="restore-toggle" style="text-decoration:none; display:block; margin-top:4px;">' + (isRestored ? 'Mark as Cancelled' : 'Mark as Restored') + '</a>');
      marker.on('popupopen', function(e) {
        var container = e.popup.getElement();
        var toggleBtn = container.querySelector('.restore-toggle');
        var viewBtn = container.querySelector('.view-records');
        var teamSelectEl = container.querySelector('.team-select');
        var assignBtn = container.querySelector('.pending-assign');
        var list = document.getElementById('municipalities-sidebar-list');
        if (list) {
          var it = list.querySelector('.sidebar-municipality-item[data-name="' + m.name + '"]');
          if (it) {
            var bEl = it.querySelector('.sidebar-barangays');
            if (bEl) bEl.style.display = 'block';
            it.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
        if (teamSelectEl) {
          var assignedTeam = getAssignedTeam(m.name);
          if (assignedTeam) teamSelectEl.value = assignedTeam;
        }
        if (assignBtn && teamSelectEl) {
          assignBtn.addEventListener('click', function(ev) {
            ev.preventDefault();
            var t = teamSelectEl.value || '';
            setAssignedTeam(m.name, t);
            if (window._dashboardLocations) {
              renderMunicipalityMarkers(window._dashboardLocations);
              renderReportMarkers(window._dashboardLocations);
            }
          });
        }
        if (viewBtn) {
          viewBtn.addEventListener('click', function(ev) {
            ev.preventDefault();
            if (/paranas/i.test(m.name)) return;
            var params = new URLSearchParams();
            params.set('location', m.name + (problem.barangay ? ' ' + problem.barangay : ''));
            params.set('issue', problem.issue || '');
            window.location.href = 'records.html?' + params.toString();
          });
        }
        if (toggleBtn) {
          toggleBtn.addEventListener('click', function(evt) {
            evt.preventDefault();
            // toggle in restoredLocations
            var idx = restoredLocations.findIndex(function(r) { return r.name === m.name; });
            if (idx === -1) {
              restoredLocations.push({ name: m.name });
            } else {
              restoredLocations.splice(idx, 1);
            }
            localStorage.setItem('restoredLocations', JSON.stringify(restoredLocations));
            // refresh markers using saved data
            if (window._dashboardLocations) {
              renderMunicipalityMarkers(window._dashboardLocations);
              renderReportMarkers(window._dashboardLocations);
              updateSidebarBadges(window._dashboardLocations);
              updateBarangayHighlights(window._dashboardLocations);
              applyIssuesFilter();
            }
          });
        }
      });
      }
    });
  }

  function findMunicipalityByLocationText(locationText) {
    if (!locationText) return null;
    var lower = String(locationText).toLowerCase();
    var found = municipalities.find(function(m) {
      return lower.indexOf(m.name.toLowerCase()) !== -1;
    });
    return found || null;
  }
  function getMunicipalityByName(name) {
    if (!name) return null;
    var lower = String(name).toLowerCase();
    return municipalities.find(function(m){ return (m.name||'').toLowerCase() === lower; }) || null;
  }
  function distanceKm(aLat, aLng, bLat, bLng) {
    function toRad(x){ return x * Math.PI / 180; }
    var R = 6371;
    var dLat = toRad(bLat - aLat);
    var dLon = toRad(bLng - aLng);
    var lat1 = toRad(aLat);
    var lat2 = toRad(bLat);
    var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.sin(dLon/2)*Math.sin(dLon/2)*Math.cos(lat1)*Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function parseBarangayFromLocationText(txt) {
    if (!txt) return '';
    var s = String(txt);
    var direct = s.match(/(?:Brgy\.?|Barangay)\s*[^,]+/i);
    if (direct && direct[0]) return direct[0].trim();
    var parts = s.split(',').map(function(p){ return p.trim(); });
    var hit = parts.find(function(p){ return /^(?:Brgy\.?|Barangay)\b/i.test(p); });
    if (hit) return hit;
    // fallback: look for token ending with 'Poblacion' or similar
    hit = parts.find(function(p){ return /\bPoblacion\b/i.test(p); });
    return hit || '';
  }

  function normalizeReportRow(row) {
    var locationText = row.location_text || row.location || row.address || '';
    var matchedMunicipality = row.municipality || (findMunicipalityByLocationText(locationText) || {}).name || 'Unknown';
    var barangayField = row.barangay || parseBarangayFromLocationText(locationText) || '';
    return {
      name: matchedMunicipality,
      issue: row.issue_type || row.issue || row.problem_type || 'Reported issue',
      barangay: barangayField || 'Not specified',
      fullName: row.full_name || row.name || 'Unknown reporter',
      contact: row.contact || row.phone || '',
      description: row.description || '',
      latitude: Number(row.latitude || row.lat || NaN),
      longitude: Number(row.longitude || row.lng || row.long || NaN),
      createdAt: row.created_at || row.createdAt || row.created || ''
    };
  }

  function renderReportMarkers(rows) {
    reportMarkersLayer.clearLayers();
    reportMarkersIndex = {};
    rows.forEach(function(r) {
      var isParanasRow = /paranas/i.test(r.name || '');
      var muniExact = municipalities.find(function(mm){ return (mm.name||'').toLowerCase() === (r.name||'').toLowerCase(); });
      if (!isParanasRow && muniExact && /paranas/i.test(muniExact.name)) isParanasRow = true;
      // Skip markers for barangays marked as restored
      var rb = resolveBarangayForReport(r) || r.barangay || '';
      if (isBarangayRestored(r.name || '', rb)) return;
      var lat = Number(r.latitude);
      var lng = Number(r.longitude);
      // Fallback: if no precise GPS, place near municipality center with deterministic offset per barangay
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        var muni = municipalities.find(function(mm){ return (mm.name||'').toLowerCase() === (r.name||'').toLowerCase(); });
        if (!muni) return; // cannot place without a municipality center
        var baseLat = Number(muni.lat), baseLng = Number(muni.lng);
        if (!Number.isFinite(baseLat) || !Number.isFinite(baseLng)) return;
        var key = (r.barangay || r.name || 'x') + '|' + (r.createdAt || '');
        var h = 0;
        for (var i=0;i<key.length;i++){ h = (h*31 + key.charCodeAt(i)) >>> 0; }
        var angle = (h % 360) * (Math.PI/180);
        var ring = (h % 3) + 1; // 1..3 rings
        var radiusDeg = 0.005 * ring; // ~0.5km, 1km, 1.5km (approx)
        // simple equirectangular offset
        lat = baseLat + radiusDeg * Math.cos(angle);
        lng = baseLng + (radiusDeg * Math.sin(angle)) / Math.cos(baseLat * Math.PI/180);
      }
      var isRestored = restoredLocations.some(function(rr) { return rr.name === r.name; });
      var assignedTeam = getAssignedTeam(r.name);
      var isAssigned = !!assignedTeam;
      var iconForRow = isRestored ? restoredIcon : (isAssigned ? pendingIcon : (isNew(r.createdAt) ? newIcon : pendingIcon));
      if (isParanasRow) iconForRow = restoredIcon;
      var marker = L.marker([lat, lng], { icon: iconForRow }).addTo(reportMarkersLayer);
      var rb = resolveBarangayForReport(r) || r.barangay || '';
      var idxKey = (r.name || '').toLowerCase() + '|' + normalizeBarangayName(rb);
      reportMarkersIndex[idxKey] = marker;
      // determine restored status for this municipality name
      var statusText = isRestored ? 'Restored' : (isAssigned ? 'Pending' : (isNew(r.createdAt) ? 'New Compliance' : 'Pending'));
      var statusColor = isRestored ? 'green' : (isAssigned ? '#f97316' : (isNew(r.createdAt) ? '#dc2626' : '#f97316'));
      var statusLine = '<br><span style="color:' + statusColor + ';">Status: ' + statusText + '</span>';
      var teamSelRow = isRestored ? '' : '<br><label style="display:block; margin-top:4px;">Team: <select class="team-select" style="min-width:140px;"><option value=\"\">Select team</option><option>Line Crew A</option><option>Line Crew B</option><option>Maintenance</option><option>Inspection</option></select></label><a href=\"#\" class=\"pending-assign\" style=\"text-decoration:none; display:block; margin-top:4px;\">Set Pending</a>';
      var assignedRow = assignedTeam;
      marker.bindPopup(
        '<strong>' + r.name + '</strong><br>' +
          (rb || r.barangay || '') + '<br>' +
        '<span style="color:#dc2626;">' + r.issue + '</span>' + statusLine +
        (assignedRow ? '<br><small>Assigned: ' + assignedRow + '</small>' : '') + teamSelRow + '<br><a href="#" class="view-records" style="text-decoration:none; display:block; margin-top:4px;">View in Records</a>' +
        '<small>Reporter: ' + r.fullName + (r.contact ? ' (' + r.contact + ')' : '') + '</small>'
      );
      // clicking the red (hazard) marker should take user to the report page
      marker.on('click', function() {
        if (isParanasRow) return;
        var paranas = getMunicipalityByName('Paranas (Wright)') || getMunicipalityByName('Paranas');
        if (paranas) {
          var d = distanceKm(lat, lng, Number(paranas.lat), Number(paranas.lng));
          if (d < 50) return; // suppress navigation near Paranas center
        }
        // navigate to records page and pass location/issue so the table can auto‑filter
        var params = new URLSearchParams();
        if (r.name) {
          params.set('municipality', r.name);
          params.set('location', r.name + (r.barangay ? ' ' + r.barangay : ''));
        }
        if (rb) params.set('barangay', rb);
        if (r.issue) params.set('issue', r.issue);
        window.location.href = 'records.html?' + params.toString();
      });
      marker.on('popupopen', function(e) {
        var container = e.popup.getElement();
        var teamSelectEl = container.querySelector('.team-select');
        var assignBtn = container.querySelector('.pending-assign');
        var viewBtn = container.querySelector('.view-records');
        if (teamSelectEl) {
          var assignedTeam = getAssignedTeam(r.name);
          if (assignedTeam) teamSelectEl.value = assignedTeam;
        }
        if (assignBtn && teamSelectEl) {
          assignBtn.addEventListener('click', function(ev) {
            ev.preventDefault();
            var t = teamSelectEl.value || '';
            setAssignedTeam(r.name, t);
            if (window._dashboardLocations) {
              renderMunicipalityMarkers(window._dashboardLocations);
              renderReportMarkers(window._dashboardLocations);
            }
          });
        }
        if (viewBtn) {
          viewBtn.addEventListener('click', function(ev) {
            ev.preventDefault();
            if (isParanasRow) return;
            var paranas = getMunicipalityByName('Paranas (Wright)') || getMunicipalityByName('Paranas');
            if (paranas) {
              var d = distanceKm(lat, lng, Number(paranas.lat), Number(paranas.lng));
              if (d < 50) return;
            }
            var params = new URLSearchParams();
            if (r.name) params.set('location', r.name + (r.barangay ? ' ' + r.barangay : ''));
            if (r.issue) params.set('issue', r.issue);
            window.location.href = 'records.html?' + params.toString();
          });
        }
      });
    });
    // If a deep-link target exists, try to open it now
    if (_pendingOpenTarget && _pendingOpenTarget.key) {
      var mk = reportMarkersIndex[_pendingOpenTarget.key];
      if (window.map) {
        if (mk) {
          var ll = mk.getLatLng();
          window.map.setView(ll, 13);
          mk.openPopup();
        } else {
          // fallback: use municipality center with small offset
          var parts = _pendingOpenTarget.key.split('|');
          var mName = parts[0] || '';
          var bName = parts[1] || '';
          var muni = municipalities.find(function(mm){ return (mm.name||'').toLowerCase() === mName; });
          if (muni && Number.isFinite(Number(muni.lat)) && Number.isFinite(Number(muni.lng))) {
            var baseLat = Number(muni.lat), baseLng = Number(muni.lng);
            var k = String(bName||'') + '|' + String(mName||'');
            var h = 0; for (var i=0;i<k.length;i++){ h = (h*31 + k.charCodeAt(i)) >>> 0; }
            var ang = (h % 360) * (Math.PI/180);
            var rad = 0.01;
            var lat = baseLat + rad * Math.cos(ang);
            var lng = baseLng + (rad * Math.sin(ang)) / Math.cos(baseLat * Math.PI/180);
            window.map.setView([lat, lng], 13);
            L.popup()
              .setLatLng([lat, lng])
              .setContent('<strong>' + (muni.name || mName) + '</strong><br>' + bName)
              .openOn(window.map);
          }
        }
      }
      _pendingOpenTarget = null;
    }
  }

  async function loadReportsFromSupabase() {
    var cfg = window.SAMELCO_SUPABASE || {};
    if (!cfg.url || !cfg.anonKey || !cfg.reportsTable) return;
    try {
      var res = await fetch(cfg.url + '/rest/v1/' + cfg.reportsTable + '?select=*&limit=500', {
        headers: {
          apikey: cfg.anonKey,
          Authorization: 'Bearer ' + cfg.anonKey
        }
      });
      if (!res.ok) throw new Error('Supabase fetch failed: ' + res.status);
      var rows = await res.json();

      // Update the count of total reports (red pins)
      var totalReports = Array.isArray(rows) ? rows.length : 0;
      var countEl = document.getElementById('total-reports-count');
      if (countEl) {
        countEl.textContent = totalReports;
      }

      if (!Array.isArray(rows) || !rows.length) {
        return [];
      }

      var normalized = rows.map(normalizeReportRow);
      localStorage.setItem('problemLocations', JSON.stringify(normalized.map(function(n) {
        return { name: n.name, issue: n.issue, barangay: n.barangay };
      })));

      // cache for use when user toggles restored status
      window._dashboardLocations = normalized;
      renderMunicipalityMarkers(normalized);
      renderReportMarkers(normalized);
      updateSidebarBadges(normalized);
      updateBarangayHighlights(normalized);
      applyIssuesFilter();
      triggerAlarmIfActive(normalized);
      return normalized;
    } catch (err) {
      console.warn('Unable to load reports from Supabase:', err.message || err);
      return [];
    }
  }

  localStorage.setItem('problemLocations', JSON.stringify([]));
  renderMunicipalityMarkers([]);
  window.map = map;
  loadReportsFromSupabase();
  setInterval(function(){ loadReportsFromSupabase(); }, 30000);

  function updateSidebarBadges(rows) {
    var list = document.getElementById('municipalities-sidebar-list');
    if (!list) return;
    var byNameNew = {};
    var byNamePending = {};
    rows.forEach(function(r) {
      var n = r.name || 'Unknown';
      if (restoredLocations.some(function(rr) { return rr.name === n; })) return;
      var bCand = resolveBarangayForReport(r) || r.barangay || '';
      if (isBarangayRestored(n, bCand)) return;
      if (!byNameNew[n]) byNameNew[n] = 0;
      if (!byNamePending[n]) byNamePending[n] = 0;
      var assignedTeam = getAssignedTeam(n);
      if (assignedTeam) byNamePending[n] += 1;
      else if (isNew(r.createdAt)) byNameNew[n] += 1;
      else byNamePending[n] += 1;
    });
    var totalNew = 0, totalPending = 0;
    list.querySelectorAll('.sidebar-municipality-item').forEach(function(it) {
      var name = it.getAttribute('data-name');
      var newBadge = it.querySelector('.issue-badge.new');
      var pendingBadge = it.querySelector('.issue-badge.pending');
      var nCount = byNameNew[name] || 0;
      var pCount = byNamePending[name] || 0;
      it.classList.toggle('has-issue', (nCount + pCount) > 0);
      if (newBadge) {
        if (nCount > 0) {
          newBadge.style.display = 'inline-block';
          newBadge.textContent = 'New Compliance ' + nCount;
          totalNew += nCount;
        } else {
          newBadge.style.display = 'none';
          newBadge.textContent = '';
        }
      }
      if (pendingBadge) {
        if (pCount > 0) {
          pendingBadge.style.display = 'inline-block';
          pendingBadge.textContent = 'Pending ' + pCount;
          totalPending += pCount;
        } else {
          pendingBadge.style.display = 'none';
          pendingBadge.textContent = '';
        }
      }
    });
    var sumEl = document.getElementById('issues-summary');
    if (sumEl) {
      var parts = [];
      if (totalNew) parts.push('New Compliance ' + totalNew);
      if (totalPending) parts.push('Pending ' + totalPending);
      sumEl.textContent = parts.join(' · ');
    }
  }

  function normalizeBarangayName(s) {
    if (!s) return '';
    var x = String(s).toLowerCase();
    x = x.replace(/brgy\.?\s*/g, 'barangay ');
    x = x.replace(/barangay\s+/g, '');
    x = x.replace(/\./g, '');
    x = x.replace(/\s+/g, ' ').trim();
    return x;
  }

  function resolveBarangayForReport(r) {
    var mName = r.name || '';
    var m = municipalities.find(function(mm){ return (mm.name||'').toLowerCase() === mName.toLowerCase(); });
    if (!m || !Array.isArray(m.barangays)) return '';
    // Build normalized set for municipality barangays
    var normSet = {};
    m.barangays.forEach(function(b){ normSet[normalizeBarangayName(b)] = b; });
    // Collect candidates from report
    var candidates = [];
    if (r.barangay) candidates.push(r.barangay);
    if (r.location_text) candidates.push(r.location_text);
    if (r.address) candidates.push(r.address);
    // Add direct parse from location text
    if (r.location_text) {
      var parsed = parseBarangayFromLocationText(r.location_text);
      if (parsed) candidates.unshift(parsed);
      // also try comma-separated tokens
      r.location_text.split(',').forEach(function(tok){ candidates.push(tok.trim()); });
    }
    // Try to match any candidate to municipality barangays
    for (var i=0;i<candidates.length;i++){
      var norm = normalizeBarangayName(candidates[i]);
      if (norm && normSet[norm]) return normSet[norm];
    }
    return '';
  }

  function updateBarangayHighlights(rows) {
    var list = document.getElementById('municipalities-sidebar-list');
    if (!list) return;
    var newByMunicipality = {};
    var pendingByMunicipality = {};
    rows.forEach(function(r) {
      var m = r.name || 'Unknown';
      if (restoredLocations.some(function(rr) { return rr.name === m; })) return;
      var b = resolveBarangayForReport(r) || r.barangay || '';
      if (isBarangayRestored(m, b)) return;
      var assignedTeam = getAssignedTeam(m);
      var statusIsNew = !assignedTeam && isNew(r.createdAt);
      if (statusIsNew) {
        if (!newByMunicipality[m]) newByMunicipality[m] = new Set();
        newByMunicipality[m].add(normalizeBarangayName(b));
      } else {
        if (!pendingByMunicipality[m]) pendingByMunicipality[m] = new Set();
        pendingByMunicipality[m].add(normalizeBarangayName(b));
      }
    });
    list.querySelectorAll('.sidebar-municipality-item').forEach(function(it) {
      var mName = it.getAttribute('data-name');
      var setNew = newByMunicipality[mName] || new Set();
      var setPending = pendingByMunicipality[mName] || new Set();
      var anyMarked = false;
      var firstMarked = null;
      it.querySelectorAll('.barangay-item-sidebar').forEach(function(bItem) {
        var currentText = bItem.childNodes.length ? bItem.childNodes[0].textContent : bItem.textContent || '';
        var rawName = currentText;
        var label = normalizeBarangayName(currentText);
        var isNewMark = setNew.has(label);
        var isPendingMark = !isNewMark && setPending.has(label);
        bItem.classList.toggle('barangay-new', isNewMark);
        bItem.classList.toggle('barangay-pending', isPendingMark);
        var statusBadge = bItem.querySelector('.status-badge');
        if (statusBadge) statusBadge.remove();
        var existingBtn = bItem.querySelector('.restore-one-btn');
        if (isNewMark) {
          var badge = document.createElement('span');
          badge.className = 'issue-badge new status-badge';
          badge.textContent = 'New';
          bItem.appendChild(badge);
          if (!existingBtn) {
            var a = document.createElement('a');
            a.className = 'restore-one-btn';
            a.href = '#';
            a.textContent = 'Mark as Restored';
            a.style.cssText = 'margin-left:auto; font-size:0.75rem; color:#065f46; text-decoration:none;';
            a.addEventListener('click', function(ev) {
              ev.preventDefault();
              ev.stopPropagation();
              markBarangayRestored(mName, rawName);
              bItem.classList.remove('barangay-new');
              a.remove();
              if (window._dashboardLocations) {
                renderMunicipalityMarkers(window._dashboardLocations);
                renderReportMarkers(window._dashboardLocations);
                updateBarangayHighlights(window._dashboardLocations);
                updateSidebarBadges(window._dashboardLocations);
                applyIssuesFilter();
                triggerAlarmIfActive(window._dashboardLocations);
              } else {
                updateSidebarBadges(rows);
                applyIssuesFilter();
              }
            });
            bItem.appendChild(a);
          }
        } else if (isPendingMark) {
          var badgeP = document.createElement('span');
          badgeP.className = 'issue-badge pending status-badge';
          badgeP.textContent = 'Pending';
          bItem.appendChild(badgeP);
          if (!existingBtn) {
            var ap = document.createElement('a');
            ap.className = 'restore-one-btn';
            ap.href = '#';
            ap.textContent = 'Mark as Restored';
            ap.style.cssText = 'margin-left:auto; font-size:0.75rem; color:#065f46; text-decoration:none;';
            ap.addEventListener('click', function(ev) {
              ev.preventDefault();
              ev.stopPropagation();
              markBarangayRestored(mName, rawName);
              bItem.classList.remove('barangay-pending');
              ap.remove();
              if (window._dashboardLocations) {
                renderMunicipalityMarkers(window._dashboardLocations);
                renderReportMarkers(window._dashboardLocations);
                updateBarangayHighlights(window._dashboardLocations);
                updateSidebarBadges(window._dashboardLocations);
                applyIssuesFilter();
                triggerAlarmIfActive(window._dashboardLocations);
              } else {
                updateSidebarBadges(rows);
                applyIssuesFilter();
              }
            });
            bItem.appendChild(ap);
          }
        } else {
          if (existingBtn) existingBtn.remove();
        }
        if ((isNewMark || isPendingMark) && !bItem.getAttribute('data-click-bound')) {
          bItem.setAttribute('data-click-bound', '1');
          bItem.style.cursor = 'pointer';
          bItem.addEventListener('click', function(ev) {
            ev.stopPropagation();
            var key = (mName || '').toLowerCase() + '|' + label;
            var mk = reportMarkersIndex[key];
              if (window.map) {
                if (mk) {
                  var ll = mk.getLatLng();
                  window.map.setView(ll, 13);
                  mk.openPopup();
                } else {
                  // Fallback: position near municipality center using deterministic offset from barangay label
                  var muni = municipalities.find(function(mm){ return (mm.name||'').toLowerCase() === (mName||'').toLowerCase(); });
                  if (muni && Number.isFinite(Number(muni.lat)) && Number.isFinite(Number(muni.lng))) {
                    var baseLat = Number(muni.lat), baseLng = Number(muni.lng);
                    var k = String(label||'') + '|' + String(mName||'');
                    var h = 0; for (var i=0;i<k.length;i++){ h = (h*31 + k.charCodeAt(i)) >>> 0; }
                    var ang = (h % 360) * (Math.PI/180);
                    var rad = 0.01; // ~1km
                    var lat = baseLat + rad * Math.cos(ang);
                    var lng = baseLng + (rad * Math.sin(ang)) / Math.cos(baseLat * Math.PI/180);
                    window.map.setView([lat, lng], 13);
                    L.popup()
                      .setLatLng([lat, lng])
                      .setContent('<strong>' + mName + '</strong><br>' + rawName + '<br><small>No precise marker found</small>')
                      .openOn(window.map);
                  }
                }
              }
              try {
                var sp = new URLSearchParams(window.location.search);
                sp.set('municipality', mName);
                sp.set('barangay', rawName);
                history.replaceState(null, '', window.location.pathname + '?' + sp.toString());
              } catch (e) {}
          });
        }
        if (!firstMarked && (isNewMark || isPendingMark)) firstMarked = bItem;
        if (isNewMark || isPendingMark) anyMarked = true;
      });
      if (anyMarked) {
        var container = it.querySelector('.sidebar-barangays');
        if (container && container.style.display === 'none') container.style.display = 'block';
        if (firstMarked) firstMarked.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  function applyIssuesFilter() {
    var cb = document.getElementById('issues-only-toggle');
    var list = document.getElementById('municipalities-sidebar-list');
    if (!list || !cb) return;
    var rows = window._dashboardLocations || [];
    var byNameCounts = {};
    rows.forEach(function(r) {
      var n = r.name || 'Unknown';
      if (restoredLocations.some(function(rr) { return rr.name === n; })) return;
      var bCand = resolveBarangayForReport(r) || r.barangay || '';
      if (isBarangayRestored(n, bCand)) return;
      if (!byNameCounts[n]) byNameCounts[n] = 0;
      byNameCounts[n] += 1;
    });
    list.querySelectorAll('.sidebar-municipality-item').forEach(function(it) {
      var name = it.getAttribute('data-name');
      var count = byNameCounts[name] || 0;
      var show = !cb.checked || count > 0;
      it.style.display = show ? '' : 'none';
    });
  }

  var issuesToggle = document.getElementById('issues-only-toggle');
  if (issuesToggle) {
    issuesToggle.addEventListener('change', function() {
      applyIssuesFilter();
    });
  }

  // Populate municipalities grid
  var municipalitiesList = document.getElementById('municipalities-list');
  if (municipalitiesList) {
    municipalities.forEach(function(m) {
      var card = document.createElement('div');
      card.className = 'municipality-card';
      var barangayCount = Array.isArray(m.barangays) ? m.barangays.length : m.barangays;
      card.innerHTML = '<h3>' + m.name + '</h3><p>' + barangayCount + ' Barangays</p><div class="barangay-list" style="display:none;"></div>';
      
      card.addEventListener('click', function() {
        var barangayList = this.querySelector('.barangay-list');
        var isOpen = barangayList.style.display === 'block';
        
        // Close all other cards
        document.querySelectorAll('.barangay-list').forEach(function(list) {
          list.style.display = 'none';
        });
        
        if (!isOpen && Array.isArray(m.barangays)) {
          barangayList.innerHTML = '<ul>' + m.barangays.map(function(b) { return '<li>' + b + '</li>'; }).join('') + '</ul>';
          barangayList.style.display = 'block';
        }
      });
      
      municipalitiesList.appendChild(card);
    });
  }
});
