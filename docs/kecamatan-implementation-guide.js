// FUTURE: Efficient Kecamatan Database Schema Design
// Only implement if absolutely required by business needs

// 1. MongoDB Schema (if using MongoDB)
const kecamatanSchema = {
  _id: ObjectId,
  kecamatan_id: String, // "K001001001" 
  kecamatan_name: String, // "Menteng"
  city_id: String, // "152" (reference to cities)
  province_id: String, // "6" (reference to provinces)
  postal_codes: [String], // ["10110", "10120", "10130"] 
  is_remote: Boolean, // true for islands/mountains
  shipping_multiplier: Number, // 1.0 normal, 1.5 remote areas
  coordinates: {
    lat: Number,
    lng: Number
  },
  created_at: Date,
  updated_at: Date
};

// Index for optimal performance
db.kecamatan.createIndex({ city_id: 1, kecamatan_name: 1 });
db.kecamatan.createIndex({ province_id: 1, city_id: 1 });
db.kecamatan.createIndex({ postal_codes: 1 });

// 2. Firestore Schema (if using Firebase)
// Collection: kecamatan
// Document structure:
const firestoreKecamatanDoc = {
  kecamatanId: "K001001001",
  kecamatanName: "Menteng", 
  cityId: "152",
  provinceId: "6",
  postalCodes: ["10110", "10120"],
  isRemote: false,
  shippingMultiplier: 1.0,
  coordinates: new firebase.firestore.GeoPoint(-6.200000, 106.816666),
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
};

// Firestore composite indexes needed:
// - provinceId, cityId
// - cityId, kecamatanName  
// - postalCodes (array-contains)

// 3. API Endpoints Design
// GET /api/shipping/kecamatan?city={cityId}
export default async function handler(req, res) {
  const { city } = req.query;
  
  if (!city) {
    return res.status(400).json({ error: 'City ID required' });
  }

  try {
    // MongoDB version
    const kecamatan = await db.collection('kecamatan')
      .find({ city_id: city })
      .sort({ kecamatan_name: 1 })
      .limit(100)
      .toArray();

    // Firestore version  
    // const kecamatan = await db.collection('kecamatan')
    //   .where('cityId', '==', city)
    //   .orderBy('kecamatanName')
    //   .limit(100)
    //   .get();

    return res.json({
      success: true,
      kecamatan: kecamatan.map(k => ({
        kecamatan_id: k.kecamatan_id,
        kecamatan_name: k.kecamatan_name,
        is_remote: k.is_remote,
        shipping_multiplier: k.shipping_multiplier
      }))
    });
  } catch (error) {
    console.error('Error fetching kecamatan:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// 4. Efficient Data Loading Strategy
const KecamatanService = {
  // Lazy loading - only fetch when city selected
  async getKecamatanByCity(cityId) {
    // Check cache first
    const cached = this.cache.get(`kecamatan_${cityId}`);
    if (cached) return cached;

    // Fetch from database
    const kecamatan = await this.fetchFromDB(cityId);
    
    // Cache for 1 hour
    this.cache.set(`kecamatan_${cityId}`, kecamatan, 3600);
    
    return kecamatan;
  },

  // Preload popular cities
  async preloadPopularKecamatan() {
    const popularCities = ['152', '153', '154', '268', '444']; // Jakarta, Makassar, Surabaya
    
    const promises = popularCities.map(cityId => 
      this.getKecamatanByCity(cityId)
    );
    
    await Promise.all(promises);
  }
};

// 5. Component Integration (React)
const KecamatanSelector = ({ cityId, onKecamatanChange }) => {
  const [kecamatan, setKecamatan] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cityId) {
      loadKecamatan(cityId);
    } else {
      setKecamatan([]);
    }
  }, [cityId]);

  const loadKecamatan = async (cityId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/shipping/kecamatan?city=${cityId}`);
      const data = await response.json();
      
      if (data.success) {
        setKecamatan(data.kecamatan);
      }
    } catch (error) {
      console.error('Error loading kecamatan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select 
      disabled={!cityId || loading}
      onChange={(e) => onKecamatanChange(e.target.value)}
    >
      <option value="">
        {loading ? 'Loading kecamatan...' : '-- Pilih Kecamatan --'}
      </option>
      {kecamatan.map(k => (
        <option key={k.kecamatan_id} value={k.kecamatan_id}>
          {k.kecamatan_name}
          {k.is_remote && ' (Remote Area +50%)'}
        </option>
      ))}
    </select>
  );
};

// 6. Data Migration Script
async function migrateKecamatanData() {
  // Sample data structure - would need full Indonesian kecamatan dataset
  const sampleData = [
    {
      kecamatan_id: "K006152001",
      kecamatan_name: "Menteng", 
      city_id: "152",
      province_id: "6",
      postal_codes: ["10110", "10120", "10130"],
      is_remote: false,
      shipping_multiplier: 1.0,
      coordinates: { lat: -6.200000, lng: 106.816666 }
    },
    {
      kecamatan_id: "K006152002", 
      kecamatan_name: "Tanah Abang",
      city_id: "152",
      province_id: "6", 
      postal_codes: ["10160", "10170", "10180"],
      is_remote: false,
      shipping_multiplier: 1.0,
      coordinates: { lat: -6.186388, lng: 106.813889 }
    }
    // ... thousands more entries needed
  ];

  // Batch insert for performance
  const batchSize = 1000;
  for (let i = 0; i < sampleData.length; i += batchSize) {
    const batch = sampleData.slice(i, i + batchSize);
    await db.collection('kecamatan').insertMany(batch);
    console.log(`Inserted batch ${i / batchSize + 1}`);
  }
}

// 7. Performance Monitoring
const performanceMetrics = {
  trackKecamatanLoadTime: (cityId, loadTime) => {
    // Send to analytics
    analytics.track('kecamatan_load_time', {
      city_id: cityId,
      load_time_ms: loadTime,
      timestamp: new Date()
    });
  },

  trackUserDropoffRate: () => {
    // Monitor if users abandon after kecamatan step
    // If high dropoff, reconsider kecamatan requirement
  }
};

// 8. Fallback Strategy
const fallbackToCity = {
  // If kecamatan fails to load, fall back to city-level
  handleKecamatanError: (cityId) => {
    console.warn(`Kecamatan failed for city ${cityId}, using city-level rate`);
    return {
      useCity: true,
      multiplier: 1.0
    };
  }
};

export {
  kecamatanSchema,
  KecamatanService, 
  KecamatanSelector,
  migrateKecamatanData,
  performanceMetrics,
  fallbackToCity
};