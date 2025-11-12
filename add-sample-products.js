// Script untuk menambahkan produk sample ke database
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'pisangijo';

const sampleProducts = [
  {
    name: "Pisang Ijo Original",
    category: "Minuman",
    price: 15000,
    description: "Pisang ijo original dengan santan kelapa segar, es serut, dan sirup manis. Rasa asli yang menyegarkan.",
    imageUrl: "/images/pisang-ijo-original.jpg",
    stock: 50,
    lowStockThreshold: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Pisang Ijo Spesial",
    category: "Minuman",
    price: 20000,
    description: "Pisang ijo dengan tambahan tape, kolang-kaling, dan kacang hijau. Varian premium yang kaya rasa.",
    imageUrl: "/images/pisang-ijo-spesial.jpg",
    stock: 30,
    lowStockThreshold: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Es Cendol",
    category: "Minuman",
    price: 12000,
    description: "Cendol segar dengan santan kelapa dan gula merah. Minuman tradisional yang menyegarkan.",
    imageUrl: "/images/es-cendol.jpg",
    stock: 40,
    lowStockThreshold: 8,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Es Campur",
    category: "Minuman",
    price: 18000,
    description: "Campuran es serut dengan berbagai topping: kolang-kaling, cincau, tape, dan buah-buahan.",
    imageUrl: "/images/es-campur.jpg",
    stock: 25,
    lowStockThreshold: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Bubur Sum-sum",
    category: "Makanan",
    price: 10000,
    description: "Bubur sum-sum tradisional dengan santan kelapa dan gula merah cair. Hangat dan manis.",
    imageUrl: "/images/bubur-sumsum.jpg",
    stock: 20,
    lowStockThreshold: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Kolak Pisang",
    category: "Makanan",
    price: 15000,
    description: "Kolak pisang dengan santan kelapa, gula merah, dan pandan. Dessert tradisional yang lezat.",
    imageUrl: "/images/kolak-pisang.jpg",
    stock: 15,
    lowStockThreshold: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Klepon",
    category: "Snack",
    price: 8000,
    description: "Klepon tradisional dengan isi gula merah dan taburan kelapa parut. Per porsi 5 buah.",
    imageUrl: "/images/klepon.jpg",
    stock: 35,
    lowStockThreshold: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Onde-onde",
    category: "Snack",
    price: 10000,
    description: "Onde-onde dengan isi kacang hijau dan taburan wijen. Renyah di luar, lembut di dalam.",
    imageUrl: "/images/onde-onde.jpg",
    stock: 25,
    lowStockThreshold: 8,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function addSampleProducts() {
  let client;
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    client = new MongoClient(MONGO_URL);
    await client.connect();
    const db = client.db(DB_NAME);
    
    console.log('📦 Checking existing products...');
    const existingCount = await db.collection('products').countDocuments();
    console.log(`📊 Found ${existingCount} existing products`);
    
    if (existingCount > 0) {
      console.log('🤔 Products already exist. Do you want to add more? (y/n)');
      // For automation, we'll add them anyway with different names
      console.log('📝 Adding sample products with unique names...');
      
      const uniqueProducts = sampleProducts.map(product => ({
        ...product,
        name: `${product.name} - Sample ${Date.now().toString().slice(-4)}`
      }));
      
      const result = await db.collection('products').insertMany(uniqueProducts);
      console.log(`✅ Added ${result.insertedCount} new sample products!`);
    } else {
      console.log('📝 Adding sample products to empty collection...');
      const result = await db.collection('products').insertMany(sampleProducts);
      console.log(`✅ Added ${result.insertedCount} sample products!`);
    }
    
    // Show current products
    const allProducts = await db.collection('products').find({}).toArray();
    console.log('\n📋 Current products in database:');
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - Rp ${product.price.toLocaleString('id-ID')} (Stock: ${product.stock})`);
    });
    
    console.log('\n🎉 Database setup complete!');
    console.log('🌐 You can now visit the order page to see all products.');
    
  } catch (error) {
    console.error('❌ Error adding sample products:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the script
addSampleProducts();