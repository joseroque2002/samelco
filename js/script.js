document.addEventListener('DOMContentLoaded', function () {
  // Municipalities (SAMELCO II – Samar) with barangays

  var municipalities = [
    { name: 'Almagro', lat: 11.9167, lng: 124.2833, barangays: ['Bacjao', 'Biasong I', 'Biasong II', 'Costa Rica', 'Costa Rica II', 'Guin-ansan', 'Imelda', 'Kerikite', 'Lunang I', 'Lunang II', 'Mabuhay', 'Magsaysay', 'Malobago', 'Marasbaras', 'Panjobjoban I', 'Panjobjoban II', 'Poblacion', 'Roño', 'San Isidro', 'San Jose', 'Talahid', 'Tonga-tonga', 'Veloso'] },
    { name: 'Basey', lat: 11.2833, lng: 125.0667, barangays: ['Amandayehan', 'Anglit', 'Bacubac', 'Balante', 'Baloog', 'Basiao', 'Baybay', 'Binongtu-an', 'Buenavista', 'Bulao', 'Burgos', 'Buscada', 'Cambayan', 'Can-abay', 'Cancaiyas', 'Canmanila', 'Catadman', 'Cogon', 'Del Pilar', 'Dolongan', 'Guintigui-an', 'Guirang', 'Iba', 'Inuntan', 'Lawa-an', 'Loog', 'Loyo', 'Mabini', 'Magallanes', 'Manlilinab', 'May-it', 'Mercado', 'Mongabong', 'New San Agustin', 'Nouvelas Occidental', 'Old San Agustin', 'Palaypay', 'Panugmonon', 'Pelit', 'Roxas', 'Salvacion', 'San Antonio', 'San Fernando', 'Sawa', 'Serum', 'Sugca', 'Sugponon', 'Sulod', 'Tinaogan', 'Tingib', 'Villa Aurora'] },
    { name: 'Calbayog City', lat: 12.0672, lng: 124.5972, barangays: ['Acedillo', 'Aguit-itan', 'Alibaba', 'Amampacang', 'Anislag', 'Awang East', 'Awang West', 'Ba-ay', 'Bagacay', 'Bagong Lipunan', 'Bantayan', 'Bantayan (Pob.)', 'Barcelona', 'Bariao', 'Binaliw', 'Burgos', 'Cabalogan', 'Cabunga-an', 'Cag-anahaw', 'Cagbanay', 'Cagbobong', 'Caglanipa', 'Calero', 'Capacuhan', 'Carayman', 'Carmen', 'Casaan', 'Cogon', 'Dawel', 'Dawes', 'Diotay', 'Dolores', 'Erenas', 'Espinosa', 'Gadgaran', 'Gasdo', 'Geraga-an', 'Guadalupe', 'Guyam', 'Hibatang', 'Hobong', 'Himamawi', 'Japay', 'Jose A. Roño', 'Kalilihan', 'La Paz', 'Laguna', 'Lalong', 'Lapaan', 'Libertad', 'Lobrigo', 'Longsob', 'Loyo', 'Lugo', 'Mabini', 'Macatingog', 'Mag-ubay', 'Magbay', 'Malaga', 'Malajog', 'Malopalo', 'Mantaong', 'Mantang', 'Matobato', 'Maybog', 'Maypangdan', 'Mendoza', 'Mongol Buntay', 'Naga', 'Naguma', 'Nalibunan', 'Nipa', 'Obrero', 'Olera', 'Omaganhan', 'Osmeña', 'Palanas', 'Palanyogan', 'Palta', 'Pangdan', 'Panlayahan', 'Panonongan', 'Panoypoy', 'Patong', 'Payahan', 'Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Poblacion 4', 'Poblacion 5', 'Poblacion 6', 'Poblacion 7', 'Poblacion 8', 'Poblacion 9', 'Poblacion 10', 'Poblacion 11', 'Poblacion 12', 'Poblacion 13', 'Poblacion 14', 'Poblacion 15', 'Poblacion 16', 'Poblacion 17', 'Poblacion 18', 'Poblacion 19', 'Poblacion 20', 'Poblacion 21', 'Poblacion 22', 'Poblacion 23', 'Ragay', 'Rizal', 'Sabang', 'Saljagon', 'San Policarpo', 'San Rufino', 'Sansanan', 'Santo Niño', 'Sugod', 'Suluan', 'Tabawan', 'Talalora', 'Talisayan', 'Tarangnan', 'Tinambacan Norte', 'Tinambacan Sur', 'Trinidad', 'Villahermosa', 'Wright'] },
    { name: 'Calbiga', lat: 11.6167, lng: 125.0167, barangays: ['Antol', 'Bacyaran', 'Barayong', 'Barobo', 'Binongtu-an', 'Boruya', 'Bulao', 'Burabod', 'Caamlongan', 'Calbiga (Pob.)', 'Canbagtic', 'Canticum', 'Daligan', 'Guimbanga', 'Hilabangan', 'Hubasan', 'Literon', 'Lungib', 'Macaalan', 'Malabal', 'Mantang', 'Maybocog', 'Minata', 'Obeño', 'Panalaron', 'Panaytay', 'Patag', 'Polangi', 'Rawis', 'Rizal', 'San Miguel', 'Sinalaban', 'Tabo', 'Tarangnan', 'Timbangan', 'Ubo', 'Villa Aurora', 'Waray', 'Zumarraga'] },
    { name: 'Catbalogan City', lat: 11.7792, lng: 124.8842, barangays: ['Albalate', 'Bagumbayan', 'Bangon', 'Basiao', 'Buran', 'Cabugawan', 'Cagudalo', 'Cagulanao', 'Cahumpan', 'Calbiga', 'Canlapwas', 'Cogon', 'Daram', 'Dawel', 'Dolores', 'Guindapunan', 'Ibol', 'Iguid', 'Lagundi', 'Libas', 'Lobo', 'Mabini', 'Macatoon', 'Magasbis', 'Malajog', 'Mantang', 'Mombon', 'Muñoz', 'Palanyogon', 'Payao', 'Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Poblacion 4', 'Poblacion 5', 'Poblacion 6', 'Poblacion 7', 'Poblacion 8', 'Poblacion 9', 'Poblacion 10', 'Rizal', 'Salud', 'San Andres', 'San Pablo', 'San Roque', 'Santo Niño', 'Silanga', 'Sohoton', 'Talisay', 'Tigbawon', 'Vigan', 'Villa Perfecta', 'New Mahayag', 'Old Mahayag', 'Rama', 'San Vicente'] },
    { name: 'Daram', lat: 11.6333, lng: 124.7833, barangays: ['Poblacion 1 (Hilaba)', 'Poblacion 2 (Malingon)', 'Poblacion 3 (Canti-il)', 'Arawane', 'Astorga', 'Bachao', 'Baclayan', 'Bagacay', 'Bayog', 'Betaug', 'Birawan', 'Bono-anon', 'Buenavista', 'Burgos', 'Cabac', 'Cabil-isan', 'Cabiton-an', 'Cabugao', 'Cagboboto', 'Calawan-an', 'Cambuhay', 'Candugue', 'Campelipa', 'Canloloy', 'Cansaganay', 'Casab-ahan', 'Guindapunan', 'Guintampilan', 'Iquiran', 'Jacopon', 'Losa', 'Lucob-lucob', 'Mabini', 'Macalpe', 'Mandoyucan', 'Marupangdan', 'Mayabay', 'Mongolbongol', 'Nipa', 'Parasan', 'Pondang', 'Poso', 'Real', 'Rizal', 'San Antonio', 'San Jose', 'San Miguel', 'San Roque', 'San Vicente', 'Saugan', 'So-ong', 'Sua', 'Sugod', 'Talisay', 'Tugas', 'Ubo', 'Valles-Bello', 'Yangta'] },
    { name: 'Gandara', lat: 12.0167, lng: 124.8167, barangays: ['Adela', 'Bacao', 'Balocawe', 'Bangon', 'Bantayan', 'Burabod', 'Cabatuan', 'Cagutsan', 'Cahumpan', 'Calayan', 'Canhumawid', 'Caparangasan', 'Casab-ahan', 'Daram', 'Felipe', 'Gandara (Pob.)', 'Geraca', 'Gutusan', 'Hernani', 'Hinayagan', 'Hinirangan', 'Jabong', 'Jalacutan', 'Lungib', 'Macugo', 'Malino', 'Marupangdan', 'Mataluto', 'Matobato', 'Maybocog', 'Minata', 'Nabong', 'Nalibunan', 'Obeño', 'Panalaron', 'Panaytay', 'Patag', 'Polangi', 'Rawis', 'Rizal', 'San Miguel', 'Sinalaban', 'Tabo', 'Tarangnan', 'Timbangan', 'Ubo', 'Villa Aurora', 'Waray', 'Zumarraga', 'Adlawon', 'Balud', 'Bantigue', 'Bunga', 'Cagmanaba', 'Calbayog', 'Canlisay', 'Dapdap', 'Ginablan', 'Hinabangan', 'Lungsod', 'Mabuhay', 'Magtaon', 'Malobago', 'Napalisan', 'Palale', 'San Isidro', 'San Jose', 'Santo Niño', 'Talisay'] },
    { name: 'Hinabangan', lat: 11.6833, lng: 125.0833, barangays: ['Bagacay', 'Canacap', 'Carmen', 'Catubig', 'Daram', 'Hinabangan (Pob.)', 'Laygayon', 'Magtangale', 'Malatugawi', 'Pagbabangnan', 'Panitian', 'Rizal', 'San Jose', 'San Juan', 'San Pablo', 'San Vicente', 'Sitio Daku', 'Talahid', 'Ubo', 'Villa Aurora', 'Bagong Silang'] },
    { name: 'Jiabong', lat: 11.7667, lng: 124.9500, barangays: ['Bactong', 'Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Barangay 9 (Pob.)', 'Barangay 10 (Pob.)', 'Bugho', 'Camantang', 'Candayona', 'Dapdap', 'Dumara', 'Dungca', 'Garcia', 'Guindapunan', 'Hilabangan', 'Jiabong', 'Lungib', 'Malino', 'Mantang', 'Marupangdan', 'Maybocog', 'Minata', 'Nalibunan', 'Obeño', 'Panalaron', 'Patag', 'Polangi', 'Rawis', 'Rizal', 'San Miguel', 'Sinalaban', 'Tabo', 'Tarangnan'] },
    { name: 'Marabut', lat: 11.1167, lng: 125.2167, barangays: ['Binukyahan', 'Calumpang', 'Canyoyo', 'Catagbacan', 'Dapdap', 'Daro', 'Lalagsan', 'Lipata', 'Marabut (Pob.)', 'Mati', 'Napalisan', 'Osmeña', 'Pili', 'Pinamitinan', 'Rizal', 'San Roque', 'Santo Niño', 'Sawang', 'Sogod', 'Tagalag', 'Talisay', 'Tinabanan', 'Villa Aurora', 'Calapi'] },
    { name: 'Matuguinao', lat: 12.1333, lng: 124.8833, barangays: ['Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5', 'Barangay 6', 'Barangay 7', 'Barangay 8', 'Barangay 9', 'Barangay 10', 'Barangay 11', 'Barangay 12', 'Barangay 13', 'Barangay 14', 'Barangay 15', 'Barangay 16', 'Barangay 17', 'Barangay 18', 'Barangay 19', 'Barangay 20'] },
    { name: 'Motiong', lat: 11.7833, lng: 125.0000, barangays: ['Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Barangay 9 (Pob.)', 'Barangay 10 (Pob.)', 'Barangay 11 (Pob.)', 'Barangay 12 (Pob.)', 'Barangay 13 (Pob.)', 'Barangay 14 (Pob.)', 'Barangay 15 (Pob.)', 'Barangay 16 (Pob.)', 'Barangay 17 (Pob.)', 'Barangay 18 (Pob.)', 'Barangay 19 (Pob.)', 'Barangay 20 (Pob.)', 'Barangay 21 (Pob.)', 'Barangay 22 (Pob.)', 'Barangay 23 (Pob.)', 'Barangay 24 (Pob.)', 'Barangay 25 (Pob.)', 'Barangay 26 (Pob.)', 'Barangay 27 (Pob.)', 'Barangay 28 (Pob.)', 'Barangay 29 (Pob.)', 'Barangay 30 (Pob.)'] },
    { name: 'Pagsanghan', lat: 11.9667, lng: 124.7167, barangays: ['Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Barangay 9 (Pob.)', 'Barangay 10 (Pob.)', 'Barangay 11 (Pob.)', 'Barangay 12 (Pob.)', 'Barangay 13 (Pob.)'] },
    { name: 'Paranas (Wright)', lat: 11.8500, lng: 125.1167, barangays: ['Anagasi', 'Bagsa', 'Balagtas', 'Balud', 'Bantigue', 'Bunga', 'Cagmanaba', 'Calbayog', 'Canlisay', 'Dapdap', 'Ginablan', 'Hinabangan', 'Lungsod', 'Mabuhay', 'Magtaon', 'Malobago', 'Napalisan', 'Palale', 'Paranas (Pob.)', 'San Isidro', 'San Jose', 'Santo Niño', 'Talisay', 'Tenani', 'Tula', 'Villa Aurora', 'Bagacay', 'Burabod', 'Cabatuan', 'Cagutsan', 'Calayan', 'Canhumawid', 'Caparangasan', 'Casab-ahan', 'Felipe', 'Geraca', 'Gutusan', 'Hernani', 'Hinayagan', 'Hinirangan', 'Jabong', 'Jalacutan', 'Macugo', 'Malino', 'Marupangdan', 'Mataluto', 'Matobato'] },
    { name: 'Pinabacdao', lat: 11.6167, lng: 124.9833, barangays: ['Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Barangay 9 (Pob.)', 'Barangay 10 (Pob.)', 'Barangay 11 (Pob.)', 'Barangay 12 (Pob.)', 'Barangay 13 (Pob.)', 'Barangay 14 (Pob.)', 'Barangay 15 (Pob.)', 'Barangay 16 (Pob.)', 'Barangay 17 (Pob.)', 'Barangay 18 (Pob.)', 'Barangay 19 (Pob.)', 'Barangay 20 (Pob.)', 'Barangay 21 (Pob.)', 'Barangay 22 (Pob.)', 'Barangay 23 (Pob.)', 'Barangay 24 (Pob.)'] },
    { name: 'San Jorge', lat: 11.3000, lng: 125.0833, barangays: ['Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Barangay 9 (Pob.)', 'Barangay 10 (Pob.)', 'Barangay 11 (Pob.)', 'Barangay 12 (Pob.)', 'Barangay 13 (Pob.)', 'Barangay 14 (Pob.)', 'Barangay 15 (Pob.)', 'Barangay 16 (Pob.)', 'Barangay 17 (Pob.)', 'Barangay 18 (Pob.)', 'Barangay 19 (Pob.)', 'Barangay 20 (Pob.)', 'Barangay 21 (Pob.)', 'Barangay 22 (Pob.)', 'Barangay 23 (Pob.)', 'Barangay 24 (Pob.)', 'Barangay 25 (Pob.)', 'Barangay 26 (Pob.)', 'Barangay 27 (Pob.)', 'Barangay 28 (Pob.)', 'Barangay 29 (Pob.)', 'Barangay 30 (Pob.)', 'Barangay 31 (Pob.)', 'Barangay 32 (Pob.)', 'Barangay 33 (Pob.)', 'Barangay 34 (Pob.)', 'Barangay 35 (Pob.)', 'Barangay 36 (Pob.)', 'Barangay 37 (Pob.)', 'Barangay 38 (Pob.)', 'Barangay 39 (Pob.)', 'Barangay 40 (Pob.)', 'Barangay 41 (Pob.)'] },
    { name: 'San Jose de Buan', lat: 12.0500, lng: 125.0333, barangays: ['Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Barangay 9 (Pob.)', 'Barangay 10 (Pob.)', 'Barangay 11 (Pob.)', 'Barangay 12 (Pob.)', 'Barangay 13 (Pob.)', 'Barangay 14 (Pob.)'] },
    { name: 'San Sebastian', lat: 11.7000, lng: 125.0167, barangays: ['Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Barangay 9 (Pob.)', 'Barangay 10 (Pob.)', 'Barangay 11 (Pob.)', 'Barangay 12 (Pob.)', 'Barangay 13 (Pob.)', 'Barangay 14 (Pob.)', 'Barangay 15 (Pob.)', 'Barangay 16 (Pob.)', 'Barangay 17 (Pob.)', 'Barangay 18 (Pob.)', 'Barangay 19 (Pob.)', 'Barangay 20 (Pob.)'] },
    { name: 'Santa Rita', lat: 11.4500, lng: 124.9333, barangays: ['Anibong', 'Aslum', 'Bagolibas', 'Balud', 'Bantigue', 'Bunga', 'Cagmanaba', 'Calbayog', 'Canlisay', 'Dapdap', 'Ginablan', 'Hinabangan', 'Lungsod', 'Mabuhay', 'Magtaon', 'Malobago', 'Napalisan', 'Palale', 'Santa Rita (Pob.)', 'San Isidro', 'San Jose', 'Santo Niño', 'Talisay', 'Villa Aurora', 'Bagacay', 'Burabod', 'Cabatuan', 'Cagutsan', 'Calayan', 'Canhumawid', 'Caparangasan', 'Casab-ahan', 'Felipe', 'Geraca', 'Gutusan', 'Hernani', 'Hinayagan', 'Hinirangan', 'Jabong', 'Jalacutan', 'Macugo', 'Malino', 'Marupangdan', 'Mataluto', 'Matobato'] },
    { name: 'Santo Niño', lat: 11.9833, lng: 124.4667, barangays: ['Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Barangay 9 (Pob.)', 'Barangay 10 (Pob.)', 'Barangay 11 (Pob.)', 'Barangay 12 (Pob.)', 'Barangay 13 (Pob.)', 'Barangay 14 (Pob.)', 'Barangay 15 (Pob.)', 'Barangay 16 (Pob.)', 'Barangay 17 (Pob.)', 'Barangay 18 (Pob.)', 'Barangay 19 (Pob.)', 'Barangay 20 (Pob.)'] },
    { name: 'Tagapul-an', lat: 11.9500, lng: 124.8333, barangays: ['Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Barangay 9 (Pob.)', 'Barangay 10 (Pob.)', 'Barangay 11 (Pob.)', 'Barangay 12 (Pob.)', 'Barangay 13 (Pob.)', 'Barangay 14 (Pob.)', 'Barangay 15 (Pob.)'] },
    { name: 'Talalora', lat: 11.5333, lng: 124.8333, barangays: ['Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Barangay 9 (Pob.)', 'Barangay 10 (Pob.)', 'Barangay 11 (Pob.)', 'Barangay 12 (Pob.)', 'Barangay 13 (Pob.)', 'Barangay 14 (Pob.)', 'Barangay 15 (Pob.)'] },
    { name: 'Tarangnan', lat: 11.9000, lng: 124.7500, barangays: ['Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Barangay 9 (Pob.)', 'Barangay 10 (Pob.)', 'Barangay 11 (Pob.)', 'Barangay 12 (Pob.)', 'Barangay 13 (Pob.)', 'Barangay 14 (Pob.)', 'Barangay 15 (Pob.)', 'Barangay 16 (Pob.)', 'Barangay 17 (Pob.)', 'Barangay 18 (Pob.)', 'Barangay 19 (Pob.)', 'Barangay 20 (Pob.)', 'Barangay 21 (Pob.)', 'Barangay 22 (Pob.)', 'Barangay 23 (Pob.)', 'Barangay 24 (Pob.)'] },
    { name: 'Villareal', lat: 11.5667, lng: 124.9333, barangays: ['Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Barangay 9 (Pob.)', 'Barangay 10 (Pob.)', 'Barangay 11 (Pob.)', 'Barangay 12 (Pob.)', 'Barangay 13 (Pob.)', 'Barangay 14 (Pob.)', 'Barangay 15 (Pob.)', 'Barangay 16 (Pob.)', 'Barangay 17 (Pob.)', 'Barangay 18 (Pob.)', 'Barangay 19 (Pob.)', 'Barangay 20 (Pob.)'] },
    { name: 'Zumarraga', lat: 11.6333, lng: 124.8500, barangays: ['Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Barangay 9 (Pob.)', 'Barangay 10 (Pob.)', 'Barangay 11 (Pob.)', 'Barangay 12 (Pob.)', 'Barangay 13 (Pob.)', 'Barangay 14 (Pob.)', 'Barangay 15 (Pob.)', 'Barangay 16 (Pob.)', 'Barangay 17 (Pob.)', 'Barangay 18 (Pob.)', 'Barangay 19 (Pob.)', 'Barangay 20 (Pob.)'] }
  ];

  // Nav: Municipalities dropdown – simple list
  var municipalitiesTrigger = document.getElementById('nav-municipalities-trigger');
  var municipalitiesDropdown = document.getElementById('nav-municipalities-dropdown');
  var municipalitiesListEl = document.getElementById('nav-municipalities-list');
  if (municipalitiesTrigger && municipalitiesDropdown && municipalitiesListEl) {
    municipalities.forEach(function (m) {
      var item = document.createElement('div');
      item.className = 'nav-municipal-item';
      item.textContent = m.name;
      municipalitiesListEl.appendChild(item);
    });
    municipalitiesTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = municipalitiesDropdown.classList.toggle('is-open');
      municipalitiesTrigger.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', function (e) {
      if (!municipalitiesTrigger.contains(e.target) && !municipalitiesDropdown.contains(e.target)) {
        municipalitiesDropdown.classList.remove('is-open');
        municipalitiesTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Nav: three-dot menu toggle
  const navTrigger = document.querySelector('.nav-menu-trigger');
  const navButtons = document.getElementById('nav-dropdown');
  if (navTrigger && navButtons) {
    navTrigger.addEventListener('click', function () {
      const isOpen = navButtons.classList.toggle('is-open');
      navTrigger.setAttribute('aria-expanded', isOpen);
      navTrigger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    document.addEventListener('click', function (e) {
      if (!navTrigger.contains(e.target) && !navButtons.contains(e.target)) {
        navButtons.classList.remove('is-open');
        navTrigger.setAttribute('aria-expanded', 'false');
        navTrigger.setAttribute('aria-label', 'Open menu');
      }
    });
    navButtons.querySelectorAll('.nav-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        navButtons.classList.remove('is-open');
        navTrigger.setAttribute('aria-expanded', 'false');
        navTrigger.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // Carousel dots: sync with 15s animation (3 slides, 5s each)
  const dots = document.querySelectorAll('.carousel-dot');
  if (dots.length) {
    let idx = 0;
    setInterval(function () {
      dots.forEach(function (d) { d.classList.remove('active'); });
      dots[idx].classList.add('active');
      idx = (idx + 1) % dots.length;
    }, 5000);
  }

  const tabs = document.querySelectorAll('.tab');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  // Switch between Login and Sign up
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = this.getAttribute('data-tab');

      tabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      if (target === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
      } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
      }
    });
  });

  // Login form submit
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (email !== 'admin' || password !== 'admin123') {
      alert('Invalid email or password.');
      return;
    }
    localStorage.setItem('userName', 'Admin');
    window.location.href = 'dashboard.html';
  });

  // Signup form submit
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const ageVal = document.getElementById('signup-age') ? document.getElementById('signup-age').value : '';
    const barangay = document.getElementById('signup-barangay') ? document.getElementById('signup-barangay').value : '';
    if (password.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    const age = parseInt(ageVal, 10);
    if (isNaN(age) || age < 1 || age > 120) {
      alert('Please enter a valid age.');
      return;
    }
    // Save user data
    localStorage.setItem('signupName', name);
    localStorage.setItem('signupEmail', email);
    localStorage.setItem('signupPassword', password);
    
    // Clear signup form
    signupForm.reset();
    
    // Switch to login tab
    tabs.forEach(function (t) { t.classList.remove('active'); });
    tabs[0].classList.add('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    
    // Show success message
    alert('Account created successfully! Please log in.');
  });
});
