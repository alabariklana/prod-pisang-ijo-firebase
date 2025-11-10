// Fallback shipping data for when RajaOngkir API is unavailable
// This contains static data for major Indonesian provinces and cities

export const FALLBACK_PROVINCES = [
  { province_id: "1", province: "Bali" },
  { province_id: "2", province: "Bangka Belitung" },
  { province_id: "3", province: "Banten" },
  { province_id: "4", province: "Bengkulu" },
  { province_id: "5", province: "DI Yogyakarta" },
  { province_id: "6", province: "DKI Jakarta" },
  { province_id: "7", province: "Gorontalo" },
  { province_id: "8", province: "Jambi" },
  { province_id: "9", province: "Jawa Barat" },
  { province_id: "10", province: "Jawa Tengah" },
  { province_id: "11", province: "Jawa Timur" },
  { province_id: "12", province: "Kalimantan Barat" },
  { province_id: "13", province: "Kalimantan Selatan" },
  { province_id: "14", province: "Kalimantan Tengah" },
  { province_id: "15", province: "Kalimantan Timur" },
  { province_id: "16", province: "Kalimantan Utara" },
  { province_id: "17", province: "Kepulauan Riau" },
  { province_id: "18", province: "Lampung" },
  { province_id: "19", province: "Maluku" },
  { province_id: "20", province: "Maluku Utara" },
  { province_id: "21", province: "Nanggroe Aceh Darussalam (NAD)" },
  { province_id: "22", province: "Nusa Tenggara Barat (NTB)" },
  { province_id: "23", province: "Nusa Tenggara Timur (NTT)" },
  { province_id: "24", province: "Papua" },
  { province_id: "25", province: "Papua Barat" },
  { province_id: "26", province: "Riau" },
  { province_id: "27", province: "Sulawesi Barat" },
  { province_id: "28", province: "Sulawesi Selatan" },
  { province_id: "29", province: "Sulawesi Tengah" },
  { province_id: "30", province: "Sulawesi Tenggara" },
  { province_id: "31", province: "Sulawesi Utara" },
  { province_id: "32", province: "Sumatera Barat" },
  { province_id: "33", province: "Sumatera Selatan" },
  { province_id: "34", province: "Sumatera Utara" }
];

export const FALLBACK_CITIES = {
  "1": [ // Bali
    { city_id: "17", type: "Kabupaten", city_name: "Badung", postal_code: "80351" },
    { city_id: "18", type: "Kabupaten", city_name: "Bangli", postal_code: "80619" },
    { city_id: "19", type: "Kabupaten", city_name: "Buleleng", postal_code: "81111" },
    { city_id: "20", type: "Kota", city_name: "Denpasar", postal_code: "80227" },
    { city_id: "21", type: "Kabupaten", city_name: "Gianyar", postal_code: "80519" }
  ],
  "2": [ // Bangka Belitung
    { city_id: "47", type: "Kabupaten", city_name: "Bangka", postal_code: "33212" },
    { city_id: "48", type: "Kabupaten", city_name: "Bangka Barat", postal_code: "33315" },
    { city_id: "49", type: "Kabupaten", city_name: "Bangka Selatan", postal_code: "33719" },
    { city_id: "50", type: "Kabupaten", city_name: "Bangka Tengah", postal_code: "33613" },
    { city_id: "51", type: "Kota", city_name: "Pangkal Pinang", postal_code: "33115" }
  ],
  "3": [ // Banten
    { city_id: "52", type: "Kabupaten", city_name: "Lebak", postal_code: "42319" },
    { city_id: "53", type: "Kabupaten", city_name: "Pandeglang", postal_code: "42212" },
    { city_id: "54", type: "Kabupaten", city_name: "Serang", postal_code: "42182" },
    { city_id: "55", type: "Kota", city_name: "Serang", postal_code: "42111" },
    { city_id: "56", type: "Kabupaten", city_name: "Tangerang", postal_code: "15914" },
    { city_id: "57", type: "Kota", city_name: "Tangerang", postal_code: "15111" },
    { city_id: "58", type: "Kota", city_name: "Tangerang Selatan", postal_code: "15332" }
  ],
  "4": [ // Bengkulu
    { city_id: "59", type: "Kabupaten", city_name: "Bengkulu Selatan", postal_code: "38519" },
    { city_id: "60", type: "Kabupaten", city_name: "Bengkulu Tengah", postal_code: "38319" },
    { city_id: "61", type: "Kabupaten", city_name: "Bengkulu Utara", postal_code: "38619" },
    { city_id: "62", type: "Kota", city_name: "Bengkulu", postal_code: "38229" },
    { city_id: "63", type: "Kabupaten", city_name: "Kaur", postal_code: "38911" }
  ],
  "5": [ // DI Yogyakarta
    { city_id: "64", type: "Kabupaten", city_name: "Bantul", postal_code: "55715" },
    { city_id: "65", type: "Kabupaten", city_name: "Gunungkidul", postal_code: "55812" },
    { city_id: "66", type: "Kabupaten", city_name: "Kulon Progo", postal_code: "55611" },
    { city_id: "67", type: "Kabupaten", city_name: "Sleman", postal_code: "55513" },
    { city_id: "68", type: "Kota", city_name: "Yogyakarta", postal_code: "55113" }
  ],
  "6": [ // DKI Jakarta
    { city_id: "151", type: "Kota", city_name: "Jakarta Barat", postal_code: "11220" },
    { city_id: "152", type: "Kota", city_name: "Jakarta Pusat", postal_code: "10540" },
    { city_id: "153", type: "Kota", city_name: "Jakarta Selatan", postal_code: "12230" },
    { city_id: "154", type: "Kota", city_name: "Jakarta Timur", postal_code: "13330" },
    { city_id: "155", type: "Kota", city_name: "Jakarta Utara", postal_code: "10540" }
  ],
  "7": [ // Gorontalo
    { city_id: "69", type: "Kabupaten", city_name: "Boalemo", postal_code: "96319" },
    { city_id: "70", type: "Kabupaten", city_name: "Bone Bolango", postal_code: "96511" },
    { city_id: "71", type: "Kabupaten", city_name: "Gorontalo", postal_code: "96218" },
    { city_id: "72", type: "Kota", city_name: "Gorontalo", postal_code: "96115" },
    { city_id: "73", type: "Kabupaten", city_name: "Gorontalo Utara", postal_code: "96611" }
  ],
  "8": [ // Jambi
    { city_id: "74", type: "Kabupaten", city_name: "Batanghari", postal_code: "36613" },
    { city_id: "75", type: "Kabupaten", city_name: "Bungo", postal_code: "37216" },
    { city_id: "76", type: "Kota", city_name: "Jambi", postal_code: "36111" },
    { city_id: "77", type: "Kabupaten", city_name: "Kerinci", postal_code: "37167" },
    { city_id: "78", type: "Kabupaten", city_name: "Merangin", postal_code: "37319" }
  ],
  "9": [ // Jawa Barat
    { city_id: "22", type: "Kabupaten", city_name: "Bandung", postal_code: "40311" },
    { city_id: "23", type: "Kota", city_name: "Bandung", postal_code: "40111" },
    { city_id: "24", type: "Kabupaten", city_name: "Bandung Barat", postal_code: "40721" },
    { city_id: "25", type: "Kota", city_name: "Banjar", postal_code: "46311" },
    { city_id: "26", type: "Kota", city_name: "Bekasi", postal_code: "17121" },
    { city_id: "27", type: "Kabupaten", city_name: "Bekasi", postal_code: "17837" },
    { city_id: "28", type: "Kota", city_name: "Bogor", postal_code: "16119" },
    { city_id: "29", type: "Kabupaten", city_name: "Bogor", postal_code: "16911" },
    { city_id: "30", type: "Kota", city_name: "Cimahi", postal_code: "40512" },
    { city_id: "31", type: "Kota", city_name: "Cirebon", postal_code: "45116" },
    { city_id: "32", type: "Kabupaten", city_name: "Cirebon", postal_code: "45611" },
    { city_id: "33", type: "Kota", city_name: "Depok", postal_code: "16416" },
    { city_id: "34", type: "Kabupaten", city_name: "Garut", postal_code: "44126" },
    { city_id: "35", type: "Kabupaten", city_name: "Indramayu", postal_code: "45214" },
    { city_id: "36", type: "Kabupaten", city_name: "Karawang", postal_code: "41311" },
    { city_id: "37", type: "Kabupaten", city_name: "Kuningan", postal_code: "45511" },
    { city_id: "38", type: "Kabupaten", city_name: "Majalengka", postal_code: "45411" },
    { city_id: "39", type: "Kabupaten", city_name: "Pangandaran", postal_code: "46511" },
    { city_id: "40", type: "Kabupaten", city_name: "Purwakarta", postal_code: "41115" },
    { city_id: "41", type: "Kabupaten", city_name: "Subang", postal_code: "41215" },
    { city_id: "42", type: "Kabupaten", city_name: "Sukabumi", postal_code: "43311" },
    { city_id: "43", type: "Kota", city_name: "Sukabumi", postal_code: "43114" },
    { city_id: "44", type: "Kabupaten", city_name: "Sumedang", postal_code: "45326" },
    { city_id: "45", type: "Kota", city_name: "Tasikmalaya", postal_code: "46116" },
    { city_id: "46", type: "Kabupaten", city_name: "Tasikmalaya", postal_code: "46411" }
  ],
  "10": [ // Jawa Tengah
    { city_id: "170", type: "Kabupaten", city_name: "Banjarnegara", postal_code: "53419" },
    { city_id: "171", type: "Kabupaten", city_name: "Banyumas", postal_code: "53114" },
    { city_id: "172", type: "Kabupaten", city_name: "Batang", postal_code: "51211" },
    { city_id: "173", type: "Kabupaten", city_name: "Blora", postal_code: "58219" },
    { city_id: "174", type: "Kabupaten", city_name: "Boyolali", postal_code: "57312" },
    { city_id: "175", type: "Kabupaten", city_name: "Brebes", postal_code: "52212" },
    { city_id: "176", type: "Kabupaten", city_name: "Cilacap", postal_code: "53211" },
    { city_id: "177", type: "Kabupaten", city_name: "Demak", postal_code: "59519" },
    { city_id: "178", type: "Kabupaten", city_name: "Grobogan", postal_code: "58111" },
    { city_id: "179", type: "Kabupaten", city_name: "Jepara", postal_code: "59419" },
    { city_id: "180", type: "Kabupaten", city_name: "Karanganyar", postal_code: "57719" },
    { city_id: "181", type: "Kabupaten", city_name: "Kebumen", postal_code: "54319" },
    { city_id: "182", type: "Kabupaten", city_name: "Kendal", postal_code: "51314" },
    { city_id: "183", type: "Kabupaten", city_name: "Klaten", postal_code: "57419" },
    { city_id: "184", type: "Kabupaten", city_name: "Kudus", postal_code: "59311" },
    { city_id: "185", type: "Kabupaten", city_name: "Magelang", postal_code: "56519" },
    { city_id: "186", type: "Kota", city_name: "Magelang", postal_code: "56133" },
    { city_id: "187", type: "Kabupaten", city_name: "Pati", postal_code: "59114" },
    { city_id: "188", type: "Kabupaten", city_name: "Pekalongan", postal_code: "51161" },
    { city_id: "189", type: "Kota", city_name: "Pekalongan", postal_code: "51111" },
    { city_id: "190", type: "Kabupaten", city_name: "Pemalang", postal_code: "52319" },
    { city_id: "191", type: "Kabupaten", city_name: "Purbalingga", postal_code: "53357" },
    { city_id: "192", type: "Kabupaten", city_name: "Purworejo", postal_code: "54111" },
    { city_id: "193", type: "Kabupaten", city_name: "Rembang", postal_code: "59219" },
    { city_id: "194", type: "Kota", city_name: "Salatiga", postal_code: "50711" },
    { city_id: "195", type: "Kabupaten", city_name: "Semarang", postal_code: "50511" },
    { city_id: "196", type: "Kota", city_name: "Semarang", postal_code: "50135" },
    { city_id: "197", type: "Kabupaten", city_name: "Sragen", postal_code: "57211" },
    { city_id: "198", type: "Kota", city_name: "Surakarta (Solo)", postal_code: "57113" },
    { city_id: "199", type: "Kabupaten", city_name: "Temanggung", postal_code: "56212" },
    { city_id: "200", type: "Kota", city_name: "Tegal", postal_code: "52114" },
    { city_id: "201", type: "Kabupaten", city_name: "Tegal", postal_code: "52419" },
    { city_id: "202", type: "Kabupaten", city_name: "Wonogiri", postal_code: "57619" },
    { city_id: "203", type: "Kabupaten", city_name: "Wonosobo", postal_code: "56311" }
  ],
  "11": [ // Jawa Timur
    { city_id: "444", type: "Kota", city_name: "Surabaya", postal_code: "60119" },
    { city_id: "445", type: "Kota", city_name: "Malang", postal_code: "65115" },
    { city_id: "446", type: "Kabupaten", city_name: "Malang", postal_code: "65719" },
    { city_id: "447", type: "Kota", city_name: "Kediri", postal_code: "64117" },
    { city_id: "448", type: "Kabupaten", city_name: "Kediri", postal_code: "64184" },
    { city_id: "449", type: "Kota", city_name: "Blitar", postal_code: "66124" },
    { city_id: "450", type: "Kabupaten", city_name: "Blitar", postal_code: "66171" },
    { city_id: "451", type: "Kota", city_name: "Mojokerto", postal_code: "61316" },
    { city_id: "452", type: "Kabupaten", city_name: "Mojokerto", postal_code: "61382" },
    { city_id: "453", type: "Kota", city_name: "Madiun", postal_code: "63122" },
    { city_id: "454", type: "Kabupaten", city_name: "Madiun", postal_code: "63153" },
    { city_id: "455", type: "Kota", city_name: "Pasuruan", postal_code: "67117" },
    { city_id: "456", type: "Kabupaten", city_name: "Pasuruan", postal_code: "67153" },
    { city_id: "457", type: "Kota", city_name: "Probolinggo", postal_code: "67215" },
    { city_id: "458", type: "Kabupaten", city_name: "Probolinggo", postal_code: "67282" }
  ],
  "12": [ // Kalimantan Barat
    { city_id: "79", type: "Kabupaten", city_name: "Bengkayang", postal_code: "79213" },
    { city_id: "80", type: "Kabupaten", city_name: "Kapuas Hulu", postal_code: "78719" },
    { city_id: "81", type: "Kabupaten", city_name: "Kayong Utara", postal_code: "78852" },
    { city_id: "82", type: "Kabupaten", city_name: "Ketapang", postal_code: "78874" },
    { city_id: "83", type: "Kabupaten", city_name: "Kubu Raya", postal_code: "78311" },
    { city_id: "84", type: "Kota", city_name: "Pontianak", postal_code: "78112" },
    { city_id: "85", type: "Kabupaten", city_name: "Pontianak", postal_code: "78971" }
  ],
  "13": [ // Kalimantan Selatan
    { city_id: "86", type: "Kabupaten", city_name: "Balangan", postal_code: "71611" },
    { city_id: "87", type: "Kota", city_name: "Banjarmasin", postal_code: "70112" },
    { city_id: "88", type: "Kabupaten", city_name: "Banjar", postal_code: "70619" },
    { city_id: "89", type: "Kabupaten", city_name: "Barito Kuala", postal_code: "70511" },
    { city_id: "90", type: "Kota", city_name: "Banjarbaru", postal_code: "70712" }
  ],
  "14": [ // Kalimantan Tengah  
    { city_id: "91", type: "Kabupaten", city_name: "Barito Selatan", postal_code: "73711" },
    { city_id: "92", type: "Kabupaten", city_name: "Barito Timur", postal_code: "73671" },
    { city_id: "93", type: "Kabupaten", city_name: "Barito Utara", postal_code: "73881" },
    { city_id: "94", type: "Kabupaten", city_name: "Gunung Mas", postal_code: "74511" },
    { city_id: "95", type: "Kabupaten", city_name: "Kapuas", postal_code: "73583" },
    { city_id: "96", type: "Kabupaten", city_name: "Katingan", postal_code: "74411" },
    { city_id: "97", type: "Kabupaten", city_name: "Kotawaringin Barat", postal_code: "74119" },
    { city_id: "98", type: "Kabupaten", city_name: "Kotawaringin Timur", postal_code: "74364" },
    { city_id: "99", type: "Kabupaten", city_name: "Lamandau", postal_code: "74111" },
    { city_id: "100", type: "Kabupaten", city_name: "Murung Raya", postal_code: "73911" },
    { city_id: "101", type: "Kota", city_name: "Palangkaraya", postal_code: "73112" },
    { city_id: "102", type: "Kabupaten", city_name: "Pulang Pisau", postal_code: "74811" },
    { city_id: "103", type: "Kabupaten", city_name: "Seruyan", postal_code: "74211" },
    { city_id: "104", type: "Kabupaten", city_name: "Sukamara", postal_code: "74712" }
  ],
  "15": [ // Kalimantan Timur
    { city_id: "105", type: "Kota", city_name: "Balikpapan", postal_code: "76113" },
    { city_id: "106", type: "Kabupaten", city_name: "Berau", postal_code: "77311" },
    { city_id: "107", type: "Kota", city_name: "Bontang", postal_code: "75313" },
    { city_id: "108", type: "Kabupaten", city_name: "Kutai Barat", postal_code: "75711" },
    { city_id: "109", type: "Kabupaten", city_name: "Kutai Kartanegara", postal_code: "75511" },
    { city_id: "110", type: "Kabupaten", city_name: "Kutai Timur", postal_code: "75611" },
    { city_id: "111", type: "Kabupaten", city_name: "Mahakam Ulu", postal_code: "75753" },
    { city_id: "112", type: "Kabupaten", city_name: "Paser", postal_code: "76219" },
    { city_id: "113", type: "Kabupaten", city_name: "Penajam Paser Utara", postal_code: "76311" },
    { city_id: "114", type: "Kota", city_name: "Samarinda", postal_code: "75133" }
  ],
  "16": [ // Kalimantan Utara
    { city_id: "115", type: "Kabupaten", city_name: "Bulungan", postal_code: "77211" },
    { city_id: "116", type: "Kabupaten", city_name: "Malinau", postal_code: "77511" },
    { city_id: "117", type: "Kabupaten", city_name: "Nunukan", postal_code: "77681" },
    { city_id: "118", type: "Kota", city_name: "Tarakan", postal_code: "77114" },
    { city_id: "119", type: "Kabupaten", city_name: "Tana Tidung", postal_code: "77611" }
  ],
  "17": [ // Kepulauan Riau
    { city_id: "120", type: "Kabupaten", city_name: "Bintan", postal_code: "29135" },
    { city_id: "121", type: "Kota", city_name: "Batam", postal_code: "29431" },
    { city_id: "122", type: "Kabupaten", city_name: "Karimun", postal_code: "29611" },
    { city_id: "123", type: "Kabupaten", city_name: "Kepulauan Anambas", postal_code: "29991" },
    { city_id: "124", type: "Kabupaten", city_name: "Lingga", postal_code: "29811" },
    { city_id: "125", type: "Kabupaten", city_name: "Natuna", postal_code: "29711" },
    { city_id: "126", type: "Kota", city_name: "Tanjung Pinang", postal_code: "29111" }
  ],
  "18": [ // Lampung
    { city_id: "127", type: "Kota", city_name: "Bandar Lampung", postal_code: "35139" },
    { city_id: "128", type: "Kabupaten", city_name: "Lampung Barat", postal_code: "34814" },
    { city_id: "129", type: "Kabupaten", city_name: "Lampung Selatan", postal_code: "35511" },
    { city_id: "130", type: "Kabupaten", city_name: "Lampung Tengah", postal_code: "34212" },
    { city_id: "131", type: "Kabupaten", city_name: "Lampung Timur", postal_code: "34319" },
    { city_id: "132", type: "Kabupaten", city_name: "Lampung Utara", postal_code: "34516" },
    { city_id: "133", type: "Kota", city_name: "Metro", postal_code: "34111" }
  ],
  "19": [ // Maluku
    { city_id: "134", type: "Kota", city_name: "Ambon", postal_code: "97128" },
    { city_id: "135", type: "Kabupaten", city_name: "Buru", postal_code: "97371" },
    { city_id: "136", type: "Kabupaten", city_name: "Buru Selatan", postal_code: "97511" },
    { city_id: "137", type: "Kabupaten", city_name: "Kepulauan Aru", postal_code: "97681" },
    { city_id: "138", type: "Kabupaten", city_name: "Maluku Barat Daya", postal_code: "97465" },
    { city_id: "139", type: "Kabupaten", city_name: "Maluku Tengah", postal_code: "97581" },
    { city_id: "140", type: "Kabupaten", city_name: "Maluku Tenggara", postal_code: "97651" },
    { city_id: "141", type: "Kabupaten", city_name: "Maluku Tenggara Barat", postal_code: "97355" },
    { city_id: "142", type: "Kabupaten", city_name: "Seram Bagian Barat", postal_code: "97561" },
    { city_id: "143", type: "Kabupaten", city_name: "Seram Bagian Timur", postal_code: "97781" },
    { city_id: "144", type: "Kota", city_name: "Tual", postal_code: "97612" }
  ],
  "20": [ // Maluku Utara
    { city_id: "145", type: "Kabupaten", city_name: "Halmahera Barat", postal_code: "97757" },
    { city_id: "146", type: "Kabupaten", city_name: "Halmahera Selatan", postal_code: "97911" },
    { city_id: "147", type: "Kabupaten", city_name: "Halmahera Tengah", postal_code: "97853" },
    { city_id: "148", type: "Kabupaten", city_name: "Halmahera Timur", postal_code: "97862" },
    { city_id: "149", type: "Kabupaten", city_name: "Halmahera Utara", postal_code: "97762" },
    { city_id: "150", type: "Kabupaten", city_name: "Kepulauan Sula", postal_code: "97995" },
    { city_id: "151", type: "Kabupaten", city_name: "Pulau Morotai", postal_code: "97771" },
    { city_id: "152", type: "Kota", city_name: "Ternate", postal_code: "97711" },
    { city_id: "153", type: "Kota", city_name: "Tidore Kepulauan", postal_code: "97815" }
  ],
  "21": [ // Nanggroe Aceh Darussalam (NAD)
    { city_id: "154", type: "Kabupaten", city_name: "Aceh Barat", postal_code: "23681" },
    { city_id: "155", type: "Kabupaten", city_name: "Aceh Barat Daya", postal_code: "23764" },
    { city_id: "156", type: "Kabupaten", city_name: "Aceh Besar", postal_code: "23519" },
    { city_id: "157", type: "Kabupaten", city_name: "Aceh Jaya", postal_code: "23654" },
    { city_id: "158", type: "Kabupaten", city_name: "Aceh Selatan", postal_code: "23719" },
    { city_id: "159", type: "Kabupaten", city_name: "Aceh Singkil", postal_code: "24785" },
    { city_id: "160", type: "Kabupaten", city_name: "Aceh Tamiang", postal_code: "24477" },
    { city_id: "161", type: "Kabupaten", city_name: "Aceh Tengah", postal_code: "24519" },
    { city_id: "162", type: "Kabupaten", city_name: "Aceh Tenggara", postal_code: "24611" },
    { city_id: "163", type: "Kabupaten", city_name: "Aceh Timur", postal_code: "24411" },
    { city_id: "164", type: "Kabupaten", city_name: "Aceh Utara", postal_code: "24382" },
    { city_id: "165", type: "Kota", city_name: "Banda Aceh", postal_code: "23238" },
    { city_id: "166", type: "Kabupaten", city_name: "Bener Meriah", postal_code: "24581" },
    { city_id: "167", type: "Kabupaten", city_name: "Bireuen", postal_code: "24251" },
    { city_id: "168", type: "Kabupaten", city_name: "Gayo Lues", postal_code: "24653" },
    { city_id: "169", type: "Kota", city_name: "Langsa", postal_code: "24412" },
    { city_id: "170", type: "Kota", city_name: "Lhokseumawe", postal_code: "24352" },
    { city_id: "171", type: "Kabupaten", city_name: "Nagan Raya", postal_code: "23674" },
    { city_id: "172", type: "Kabupaten", city_name: "Pidie", postal_code: "24116" },
    { city_id: "173", type: "Kabupaten", city_name: "Pidie Jaya", postal_code: "24186" },
    { city_id: "174", type: "Kota", city_name: "Sabang", postal_code: "23512" },
    { city_id: "175", type: "Kabupaten", city_name: "Simeulue", postal_code: "23891" },
    { city_id: "176", type: "Kota", city_name: "Subulussalam", postal_code: "24882" }
  ],
  "22": [ // Nusa Tenggara Barat (NTB)
    { city_id: "177", type: "Kabupaten", city_name: "Bima", postal_code: "84171" },
    { city_id: "178", type: "Kota", city_name: "Bima", postal_code: "84139" },
    { city_id: "179", type: "Kabupaten", city_name: "Dompu", postal_code: "84217" },
    { city_id: "180", type: "Kabupaten", city_name: "Lombok Barat", postal_code: "83311" },
    { city_id: "181", type: "Kabupaten", city_name: "Lombok Tengah", postal_code: "83511" },
    { city_id: "182", type: "Kabupaten", city_name: "Lombok Timur", postal_code: "83612" },
    { city_id: "183", type: "Kabupaten", city_name: "Lombok Utara", postal_code: "83711" },
    { city_id: "184", type: "Kota", city_name: "Mataram", postal_code: "83131" },
    { city_id: "185", type: "Kabupaten", city_name: "Sumbawa", postal_code: "84315" },
    { city_id: "186", type: "Kabupaten", city_name: "Sumbawa Barat", postal_code: "84419" }
  ],
  "23": [ // Nusa Tenggara Timur (NTT)
    { city_id: "187", type: "Kabupaten", city_name: "Alor", postal_code: "85811" },
    { city_id: "188", type: "Kabupaten", city_name: "Belu", postal_code: "85711" },
    { city_id: "189", type: "Kabupaten", city_name: "Ende", postal_code: "86318" },
    { city_id: "190", type: "Kabupaten", city_name: "Flores Timur", postal_code: "86213" },
    { city_id: "191", type: "Kabupaten", city_name: "Kupang", postal_code: "85362" },
    { city_id: "192", type: "Kota", city_name: "Kupang", postal_code: "85228" },
    { city_id: "193", type: "Kabupaten", city_name: "Lembata", postal_code: "86611" },
    { city_id: "194", type: "Kabupaten", city_name: "Malaka", postal_code: "85783" },
    { city_id: "195", type: "Kabupaten", city_name: "Manggarai", postal_code: "86551" },
    { city_id: "196", type: "Kabupaten", city_name: "Manggarai Barat", postal_code: "86711" },
    { city_id: "197", type: "Kabupaten", city_name: "Manggarai Timur", postal_code: "86811" },
    { city_id: "198", type: "Kabupaten", city_name: "Ngada", postal_code: "86413" },
    { city_id: "199", type: "Kabupaten", city_name: "Nagekeo", postal_code: "86911" },
    { city_id: "200", type: "Kabupaten", city_name: "Rote Ndao", postal_code: "85982" },
    { city_id: "201", type: "Kabupaten", city_name: "Sabu Raijua", postal_code: "85391" },
    { city_id: "202", type: "Kabupaten", city_name: "Sikka", postal_code: "86121" },
    { city_id: "203", type: "Kabupaten", city_name: "Sumba Barat", postal_code: "87219" },
    { city_id: "204", type: "Kabupaten", city_name: "Sumba Barat Daya", postal_code: "87453" },
    { city_id: "205", type: "Kabupaten", city_name: "Sumba Tengah", postal_code: "87Azerbaijan" },
    { city_id: "206", type: "Kabupaten", city_name: "Sumba Timur", postal_code: "87112" },
    { city_id: "207", type: "Kabupaten", city_name: "Timor Tengah Selatan", postal_code: "85562" },
    { city_id: "208", type: "Kabupaten", city_name: "Timor Tengah Utara", postal_code: "85613" }
  ],
  "24": [ // Papua
    { city_id: "209", type: "Kabupaten", city_name: "Asmat", postal_code: "99777" },
    { city_id: "210", type: "Kabupaten", city_name: "Biak Numfor", postal_code: "98119" },
    { city_id: "211", type: "Kabupaten", city_name: "Boven Digoel", postal_code: "99662" },
    { city_id: "212", type: "Kabupaten", city_name: "Deiyai", postal_code: "98784" },
    { city_id: "213", type: "Kabupaten", city_name: "Dogiyai", postal_code: "98866" },
    { city_id: "214", type: "Kabupaten", city_name: "Intan Jaya", postal_code: "98785" },
    { city_id: "215", type: "Kota", city_name: "Jayapura", postal_code: "99113" },
    { city_id: "216", type: "Kabupaten", city_name: "Jayapura", postal_code: "99352" },
    { city_id: "217", type: "Kabupaten", city_name: "Jayawijaya", postal_code: "99511" },
    { city_id: "218", type: "Kabupaten", city_name: "Keerom", postal_code: "99461" },
    { city_id: "219", type: "Kabupaten", city_name: "Kepulauan Yapen", postal_code: "98211" },
    { city_id: "220", type: "Kabupaten", city_name: "Lanny Jaya", postal_code: "99531" },
    { city_id: "221", type: "Kabupaten", city_name: "Mamberamo Raya", postal_code: "99381" },
    { city_id: "222", type: "Kabupaten", city_name: "Mamberamo Tengah", postal_code: "99553" },
    { city_id: "223", type: "Kabupaten", city_name: "Mappi", postal_code: "99853" },
    { city_id: "224", type: "Kabupaten", city_name: "Merauke", postal_code: "99615" },
    { city_id: "225", type: "Kabupaten", city_name: "Mimika", postal_code: "99962" },
    { city_id: "226", type: "Kabupaten", city_name: "Nabire", postal_code: "98816" },
    { city_id: "227", type: "Kabupaten", city_name: "Nduga", postal_code: "99541" },
    { city_id: "228", type: "Kabupaten", city_name: "Paniai", postal_code: "98765" },
    { city_id: "229", type: "Kabupaten", city_name: "Pegunungan Bintang", postal_code: "99573" },
    { city_id: "230", type: "Kabupaten", city_name: "Puncak", postal_code: "98981" },
    { city_id: "231", type: "Kabupaten", city_name: "Puncak Jaya", postal_code: "98979" },
    { city_id: "232", type: "Kabupaten", city_name: "Sarmi", postal_code: "99373" },
    { city_id: "233", type: "Kabupaten", city_name: "Supiori", postal_code: "98164" },
    { city_id: "234", type: "Kabupaten", city_name: "Tolikara", postal_code: "99411" },
    { city_id: "235", type: "Kabupaten", city_name: "Waropen", postal_code: "98269" },
    { city_id: "236", type: "Kabupaten", city_name: "Yahukimo", postal_code: "99041" },
    { city_id: "237", type: "Kabupaten", city_name: "Yalimo", postal_code: "99481" }
  ],
  "25": [ // Papua Barat
    { city_id: "238", type: "Kabupaten", city_name: "Fakfak", postal_code: "98651" },
    { city_id: "239", type: "Kabupaten", city_name: "Kaimana", postal_code: "98671" },
    { city_id: "240", type: "Kabupaten", city_name: "Manokwari", postal_code: "98315" },
    { city_id: "241", type: "Kabupaten", city_name: "Manokwari Selatan", postal_code: "98355" },
    { city_id: "242", type: "Kabupaten", city_name: "Maybrat", postal_code: "98051" },
    { city_id: "243", type: "Kabupaten", city_name: "Pegunungan Arfak", postal_code: "98354" },
    { city_id: "244", type: "Kabupaten", city_name: "Raja Ampat", postal_code: "98489" },
    { city_id: "245", type: "Kota", city_name: "Sorong", postal_code: "98411" },
    { city_id: "246", type: "Kabupaten", city_name: "Sorong", postal_code: "98431" },
    { city_id: "247", type: "Kabupaten", city_name: "Sorong Selatan", postal_code: "98454" },
    { city_id: "248", type: "Kabupaten", city_name: "Tambrauw", postal_code: "98253" },
    { city_id: "249", type: "Kabupaten", city_name: "Teluk Bintuni", postal_code: "98551" },
    { city_id: "250", type: "Kabupaten", city_name: "Teluk Wondama", postal_code: "98591" }
  ],
  "26": [ // Riau  
    { city_id: "400", type: "Kabupaten", city_name: "Bengkalis", postal_code: "28719" },
    { city_id: "401", type: "Kota", city_name: "Dumai", postal_code: "28811" },
    { city_id: "402", type: "Kabupaten", city_name: "Indragiri Hilir", postal_code: "29212" },
    { city_id: "403", type: "Kabupaten", city_name: "Indragiri Hulu", postal_code: "29319" },
    { city_id: "404", type: "Kabupaten", city_name: "Kampar", postal_code: "28411" },
    { city_id: "405", type: "Kabupaten", city_name: "Kepulauan Meranti", postal_code: "28789" },
    { city_id: "406", type: "Kabupaten", city_name: "Kuantan Singingi", postal_code: "29519" },
    { city_id: "407", type: "Kota", city_name: "Pekanbaru", postal_code: "28112" },
    { city_id: "408", type: "Kabupaten", city_name: "Pelalawan", postal_code: "28311" },
    { city_id: "409", type: "Kabupaten", city_name: "Rokan Hilir", postal_code: "28992" },
    { city_id: "410", type: "Kabupaten", city_name: "Rokan Hulu", postal_code: "28511" },
    { city_id: "411", type: "Kabupaten", city_name: "Siak", postal_code: "28623" }
  ],
  "27": [ // Sulawesi Barat
    { city_id: "251", type: "Kabupaten", city_name: "Majene", postal_code: "91411" },
    { city_id: "252", type: "Kabupaten", city_name: "Mamasa", postal_code: "91362" },
    { city_id: "253", type: "Kabupaten", city_name: "Mamuju", postal_code: "91519" },
    { city_id: "254", type: "Kabupaten", city_name: "Mamuju Tengah", postal_code: "91583" },
    { city_id: "255", type: "Kabupaten", city_name: "Mamuju Utara", postal_code: "91571" },
    { city_id: "256", type: "Kabupaten", city_name: "Polewali Mandar", postal_code: "91311" }
  ],
  "28": [ // Sulawesi Selatan
    { city_id: "257", type: "Kabupaten", city_name: "Bantaeng", postal_code: "92411" },
    { city_id: "258", type: "Kabupaten", city_name: "Barru", postal_code: "90719" },
    { city_id: "259", type: "Kabupaten", city_name: "Bone", postal_code: "92713" },
    { city_id: "260", type: "Kabupaten", city_name: "Bulukumba", postal_code: "92511" },
    { city_id: "261", type: "Kabupaten", city_name: "Enrekang", postal_code: "91719" },
    { city_id: "262", type: "Kabupaten", city_name: "Gowa", postal_code: "92111" },
    { city_id: "263", type: "Kabupaten", city_name: "Jeneponto", postal_code: "92319" },
    { city_id: "264", type: "Kabupaten", city_name: "Kepulauan Selayar", postal_code: "92812" },
    { city_id: "265", type: "Kabupaten", city_name: "Luwu", postal_code: "91994" },
    { city_id: "266", type: "Kabupaten", city_name: "Luwu Timur", postal_code: "92981" },
    { city_id: "267", type: "Kabupaten", city_name: "Luwu Utara", postal_code: "92911" },
    { city_id: "268", type: "Kota", city_name: "Makassar", postal_code: "90111" },
    { city_id: "269", type: "Kabupaten", city_name: "Maros", postal_code: "90511" },
    { city_id: "270", type: "Kota", city_name: "Palopo", postal_code: "91911" },
    { city_id: "271", type: "Kota", city_name: "Parepare", postal_code: "91123" },
    { city_id: "272", type: "Kabupaten", city_name: "Pinrang", postal_code: "91251" },
    { city_id: "273", type: "Kabupaten", city_name: "Sidenreng Rappang", postal_code: "91613" },
    { city_id: "274", type: "Kabupaten", city_name: "Sinjai", postal_code: "92615" },
    { city_id: "275", type: "Kabupaten", city_name: "Soppeng", postal_code: "90812" },
    { city_id: "276", type: "Kabupaten", city_name: "Takalar", postal_code: "92212" },
    { city_id: "277", type: "Kabupaten", city_name: "Tana Toraja", postal_code: "91819" },
    { city_id: "278", type: "Kabupaten", city_name: "Toraja Utara", postal_code: "91831" },
    { city_id: "279", type: "Kabupaten", city_name: "Wajo", postal_code: "90911" }
  ],
  "29": [ // Sulawesi Tengah
    { city_id: "280", type: "Kabupaten", city_name: "Banggai", postal_code: "94711" },
    { city_id: "281", type: "Kabupaten", city_name: "Banggai Kepulauan", postal_code: "94881" },
    { city_id: "282", type: "Kabupaten", city_name: "Banggai Laut", postal_code: "94976" },
    { city_id: "283", type: "Kabupaten", city_name: "Buol", postal_code: "94564" },
    { city_id: "284", type: "Kabupaten", city_name: "Donggala", postal_code: "94341" },
    { city_id: "285", type: "Kabupaten", city_name: "Morowali", postal_code: "94911" },
    { city_id: "286", type: "Kabupaten", city_name: "Morowali Utara", postal_code: "94973" },
    { city_id: "287", type: "Kota", city_name: "Palu", postal_code: "94111" },
    { city_id: "288", type: "Kabupaten", city_name: "Parigi Moutong", postal_code: "94411" },
    { city_id: "289", type: "Kabupaten", city_name: "Poso", postal_code: "94615" },
    { city_id: "290", type: "Kabupaten", city_name: "Sigi", postal_code: "94364" },
    { city_id: "291", type: "Kabupaten", city_name: "Tojo Una-Una", postal_code: "94683" },
    { city_id: "292", type: "Kabupaten", city_name: "Tolitoli", postal_code: "94542" }
  ],
  "30": [ // Sulawesi Tenggara
    { city_id: "293", type: "Kota", city_name: "Bau-Bau", postal_code: "93719" },
    { city_id: "294", type: "Kabupaten", city_name: "Bombana", postal_code: "93771" },
    { city_id: "295", type: "Kabupaten", city_name: "Buton", postal_code: "93754" },
    { city_id: "296", type: "Kabupaten", city_name: "Buton Selatan", postal_code: "93776" },
    { city_id: "297", type: "Kabupaten", city_name: "Buton Tengah", postal_code: "93772" },
    { city_id: "298", type: "Kabupaten", city_name: "Buton Utara", postal_code: "93745" },
    { city_id: "299", type: "Kota", city_name: "Kendari", postal_code: "93117" },
    { city_id: "300", type: "Kabupaten", city_name: "Kolaka", postal_code: "93511" },
    { city_id: "301", type: "Kabupaten", city_name: "Kolaka Timur", postal_code: "93671" },
    { city_id: "302", type: "Kabupaten", city_name: "Kolaka Utara", postal_code: "93582" },
    { city_id: "303", type: "Kabupaten", city_name: "Konawe", postal_code: "93411" },
    { city_id: "304", type: "Kabupaten", city_name: "Konawe Kepulauan", postal_code: "93827" },
    { city_id: "305", type: "Kabupaten", city_name: "Konawe Selatan", postal_code: "93811" },
    { city_id: "306", type: "Kabupaten", city_name: "Konawe Utara", postal_code: "93911" },
    { city_id: "307", type: "Kabupaten", city_name: "Muna", postal_code: "93611" },
    { city_id: "308", type: "Kabupaten", city_name: "Muna Barat", postal_code: "93619" },
    { city_id: "309", type: "Kabupaten", city_name: "Wakatobi", postal_code: "93791" }
  ],
  "31": [ // Sulawesi Utara
    { city_id: "310", type: "Kota", city_name: "Bitung", postal_code: "95512" },
    { city_id: "311", type: "Kabupaten", city_name: "Bolaang Mongondow", postal_code: "95755" },
    { city_id: "312", type: "Kabupaten", city_name: "Bolaang Mongondow Selatan", postal_code: "95774" },
    { city_id: "313", type: "Kabupaten", city_name: "Bolaang Mongondow Timur", postal_code: "95783" },
    { city_id: "314", type: "Kabupaten", city_name: "Bolaang Mongondow Utara", postal_code: "95765" },
    { city_id: "315", type: "Kabupaten", city_name: "Kepulauan Sangihe", postal_code: "95819" },
    { city_id: "316", type: "Kabupaten", city_name: "Kepulauan Siau Tagulandang Biaro", postal_code: "95862" },
    { city_id: "317", type: "Kabupaten", city_name: "Kepulauan Talaud", postal_code: "95885" },
    { city_id: "318", type: "Kota", city_name: "Kotamobagu", postal_code: "95711" },
    { city_id: "319", type: "Kabupaten", city_name: "Minahasa", postal_code: "95614" },
    { city_id: "320", type: "Kabupaten", city_name: "Minahasa Selatan", postal_code: "95914" },
    { city_id: "321", type: "Kabupaten", city_name: "Minahasa Tenggara", postal_code: "95995" },
    { city_id: "322", type: "Kabupaten", city_name: "Minahasa Utara", postal_code: "95511" },
    { city_id: "323", type: "Kota", city_name: "Manado", postal_code: "95115" },
    { city_id: "324", type: "Kota", city_name: "Tomohon", postal_code: "95416" }
  ],
  "33": [ // Sumatera Selatan
    { city_id: "412", type: "Kabupaten", city_name: "Banyuasin", postal_code: "30911" },
    { city_id: "413", type: "Kabupaten", city_name: "Empat Lawang", postal_code: "31811" },
    { city_id: "414", type: "Kabupaten", city_name: "Lahat", postal_code: "31419" },
    { city_id: "415", type: "Kota", city_name: "Lubuklinggau", postal_code: "31626" },
    { city_id: "416", type: "Kabupaten", city_name: "Muara Enim", postal_code: "31315" },
    { city_id: "417", type: "Kabupaten", city_name: "Musi Banyuasin", postal_code: "30719" },
    { city_id: "418", type: "Kabupaten", city_name: "Musi Rawas", postal_code: "31661" },
    { city_id: "419", type: "Kabupaten", city_name: "Musi Rawas Utara", postal_code: "31681" },
    { city_id: "420", type: "Kabupaten", city_name: "Ogan Ilir", postal_code: "30811" },
    { city_id: "421", type: "Kabupaten", city_name: "Ogan Komering Ilir", postal_code: "30618" },
    { city_id: "422", type: "Kabupaten", city_name: "Ogan Komering Ulu", postal_code: "32112" },
    { city_id: "423", type: "Kabupaten", city_name: "Ogan Komering Ulu Selatan", postal_code: "32511" },
    { city_id: "424", type: "Kabupaten", city_name: "Ogan Komering Ulu Timur", postal_code: "32312" },
    { city_id: "425", type: "Kota", city_name: "Pagar Alam", postal_code: "31512" },
    { city_id: "426", type: "Kota", city_name: "Palembang", postal_code: "30111" },
    { city_id: "427", type: "Kota", city_name: "Prabumulih", postal_code: "31121" }
  ],
  "32": [ // Sumatera Barat
    { city_id: "501", type: "Kabupaten", city_name: "Agam", postal_code: "26411" },
    { city_id: "502", type: "Kota", city_name: "Bukittinggi", postal_code: "26115" },
    { city_id: "503", type: "Kabupaten", city_name: "Dharmasraya", postal_code: "27612" },
    { city_id: "504", type: "Kabupaten", city_name: "Kepulauan Mentawai", postal_code: "25771" },
    { city_id: "505", type: "Kabupaten", city_name: "Lima Puluh Koto", postal_code: "26671" },
    { city_id: "506", type: "Kota", city_name: "Padang", postal_code: "25112" },
    { city_id: "507", type: "Kabupaten", city_name: "Padang Pariaman", postal_code: "25583" },
    { city_id: "508", type: "Kota", city_name: "Padang Panjang", postal_code: "27122" },
    { city_id: "509", type: "Kota", city_name: "Pariaman", postal_code: "25511" },
    { city_id: "510", type: "Kabupaten", city_name: "Pasaman", postal_code: "26318" },
    { city_id: "511", type: "Kabupaten", city_name: "Pasaman Barat", postal_code: "26511" },
    { city_id: "512", type: "Kota", city_name: "Payakumbuh", postal_code: "26213" },
    { city_id: "513", type: "Kabupaten", city_name: "Pesisir Selatan", postal_code: "25611" },
    { city_id: "514", type: "Kota", city_name: "Sawahlunto", postal_code: "27416" },
    { city_id: "515", type: "Kabupaten", city_name: "Sijunjung", postal_code: "27511" },
    { city_id: "516", type: "Kota", city_name: "Solok", postal_code: "27315" },
    { city_id: "517", type: "Kabupaten", city_name: "Solok", postal_code: "27365" },
    { city_id: "518", type: "Kabupaten", city_name: "Solok Selatan", postal_code: "27779" },
    { city_id: "519", type: "Kabupaten", city_name: "Tanah Datar", postal_code: "27211" }
  ],
  "34": [ // Sumatera Utara
    { city_id: "56", type: "Kabupaten", city_name: "Asahan", postal_code: "21214" },
    { city_id: "57", type: "Kabupaten", city_name: "Batu Bara", postal_code: "21655" },
    { city_id: "58", type: "Kota", city_name: "Binjai", postal_code: "20712" },
    { city_id: "59", type: "Kabupaten", city_name: "Dairi", postal_code: "22211" },
    { city_id: "60", type: "Kabupaten", city_name: "Deli Serdang", postal_code: "20511" },
    { city_id: "61", type: "Kota", city_name: "Gunungsitoli", postal_code: "22813" },
    { city_id: "62", type: "Kabupaten", city_name: "Humbang Hasundutan", postal_code: "22457" },
    { city_id: "63", type: "Kabupaten", city_name: "Karo", postal_code: "22119" },
    { city_id: "64", type: "Kabupaten", city_name: "Labuhan Batu", postal_code: "21418" },
    { city_id: "65", type: "Kabupaten", city_name: "Labuhan Batu Selatan", postal_code: "21511" },
    { city_id: "66", type: "Kabupaten", city_name: "Labuhan Batu Utara", postal_code: "21711" },
    { city_id: "67", type: "Kabupaten", city_name: "Langkat", postal_code: "20811" },
    { city_id: "68", type: "Kabupaten", city_name: "Mandailing Natal", postal_code: "22916" },
    { city_id: "69", type: "Kota", city_name: "Medan", postal_code: "20111" },
    { city_id: "70", type: "Kabupaten", city_name: "Nias", postal_code: "22876" },
    { city_id: "71", type: "Kabupaten", city_name: "Nias Barat", postal_code: "22895" },
    { city_id: "72", type: "Kabupaten", city_name: "Nias Selatan", postal_code: "22865" },
    { city_id: "73", type: "Kabupaten", city_name: "Nias Utara", postal_code: "22856" },
    { city_id: "74", type: "Kabupaten", city_name: "Padang Lawas", postal_code: "22763" },
    { city_id: "75", type: "Kabupaten", city_name: "Padang Lawas Utara", postal_code: "22753" },
    { city_id: "76", type: "Kota", city_name: "Padangsidimpuan", postal_code: "22727" },
    { city_id: "77", type: "Kabupaten", city_name: "Pakpak Bharat", postal_code: "22272" },
    { city_id: "78", type: "Kota", city_name: "Pematangsiantar", postal_code: "21126" },
    { city_id: "79", type: "Kabupaten", city_name: "Samosir", postal_code: "22392" },
    { city_id: "80", type: "Kabupaten", city_name: "Serdang Bedagai", postal_code: "20915" },
    { city_id: "81", type: "Kota", city_name: "Sibolga", postal_code: "22522" },
    { city_id: "82", type: "Kabupaten", city_name: "Simalungun", postal_code: "21162" },
    { city_id: "83", type: "Kota", city_name: "Tanjungbalai", postal_code: "21331" },
    { city_id: "84", type: "Kabupaten", city_name: "Tapanuli Selatan", postal_code: "22742" },
    { city_id: "85", type: "Kabupaten", city_name: "Tapanuli Tengah", postal_code: "22611" },
    { city_id: "86", type: "Kabupaten", city_name: "Tapanuli Utara", postal_code: "22414" },
    { city_id: "87", type: "Kota", city_name: "Tebing Tinggi", postal_code: "20632" },
    { city_id: "88", type: "Kabupaten", city_name: "Toba Samosir", postal_code: "22316" }
  ]
};

// Fallback shipping costs (estimated rates per kg for different services)
export const FALLBACK_SHIPPING_RATES = {
  jne: {
    name: "JNE",
    services: [
      { 
        service: "REG", 
        description: "Layanan Reguler", 
        baseRate: 8000, // per kg
        etd: "2-3" 
      },
      { 
        service: "OKE", 
        description: "Ongkos Kirim Ekonomis", 
        baseRate: 6000, // per kg
        etd: "3-5" 
      },
      { 
        service: "YES", 
        description: "Yakin Esok Sampai", 
        baseRate: 15000, // per kg
        etd: "1-1" 
      }
    ]
  },
  pos: {
    name: "POS Indonesia",
    services: [
      { 
        service: "Paket Kilat Khusus", 
        description: "Paket Kilat Khusus", 
        baseRate: 7000, // per kg
        etd: "2-4" 
      },
      { 
        service: "Express Next Day", 
        description: "Express Next Day", 
        baseRate: 12000, // per kg
        etd: "1-1" 
      }
    ]
  },
  tiki: {
    name: "TIKI",
    services: [
      { 
        service: "REG", 
        description: "Regular Service", 
        baseRate: 7500, // per kg
        etd: "3-5" 
      },
      { 
        service: "ONS", 
        description: "Over Night Service", 
        baseRate: 13000, // per kg
        etd: "1-2" 
      }
    ]
  }
};

// Calculate distance-based multiplier (simplified version)
export function calculateDistanceMultiplier(originCityId, destinationCityId) {
  // Simplified distance calculation based on city zones
  const jakartaCities = ["151", "152", "153", "154", "155"]; // Jakarta
  const jawaBarat = ["22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];
  const jawaTengah = ["170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203"];
  const jawaTimur = ["444", "445", "446", "447", "448", "449", "450", "451", "452", "453", "454", "455", "456", "457", "458"];
  
  const getZone = (cityId) => {
    if (jakartaCities.includes(cityId)) return 1;
    if (jawaBarat.includes(cityId)) return 2;
    if (jawaTengah.includes(cityId)) return 3;
    if (jawaTimur.includes(cityId)) return 4;
    return 5; // Other provinces
  };
  
  const originZone = getZone(originCityId);
  const destZone = getZone(destinationCityId);
  const zoneDiff = Math.abs(originZone - destZone);
  
  // Base multipliers based on zone difference
  switch (zoneDiff) {
    case 0: return 1.0; // Same zone
    case 1: return 1.2; // Adjacent zone
    case 2: return 1.5; // 2 zones away
    case 3: return 2.0; // 3 zones away  
    default: return 2.5; // Far zones
  }
}