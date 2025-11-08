import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || 'pisangijo';

// Validate environment variables (only at runtime, not build time)
function validateUri() {
  if (!uri) {
    throw new Error('Please add your Mongo URI to environment variables');
  }
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // Validate URI at runtime
  validateUri();
  
  // If cached connection exists, return it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Connect to MongoDB with modern options
  const client = await MongoClient.connect(uri, {
    // Modern MongoDB driver doesn't need these deprecated options
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  const db = client.db(dbName);

  // Cache the connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Helper function to disconnect (useful for cleanup)
export async function disconnectFromDatabase() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}