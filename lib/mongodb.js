/**
 * @fileoverview Enhanced MongoDB connection management with retry logic, health checks, and connection pooling
 * Provides reliable database connectivity for the Pisang Ijo Evi application
 * @author Pisang Ijo Evi
 * @version 2.0.0
 * 
 * @example
 * // Using withDatabase wrapper
 * export async function GET() {
 *   return withDatabase(async (db) => {
 *     const products = await db.collection('products').find({}).toArray();
 *     return ApiResponse.success(products);
 *   });
 * }
 * 
 * // Direct connection (legacy)
 * const { db } = await connectToDatabase();
 * const users = await db.collection('users').find({}).toArray();
 */

import { MongoClient } from 'mongodb';

/**
 * MongoDB connection configuration with optimized settings
 * @type {Object}
 * @property {string} uri - MongoDB connection URI
 * @property {string} dbName - Database name
 * @property {Object} options - Connection options for performance and reliability
 */
const CONFIG = {
  uri: process.env.MONGO_URL,
  dbName: process.env.DB_NAME || 'pisangijo',
  options: {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
    retryReads: true
  }
};

/**
 * Connection cache to avoid multiple connections
 */
let cachedClient = null;
let cachedDb = null;
let isConnecting = false;

/**
 * Validates MongoDB URI
 * @throws {Error} If URI is not provided
 */
function validateConfig() {
  if (!CONFIG.uri) {
    throw new Error('MONGO_URL environment variable is required');
  }
  
  if (!CONFIG.uri.startsWith('mongodb')) {
    throw new Error('Invalid MongoDB URI format');
  }
}

/**
 * Enhanced MongoDB connection with retry logic and better error handling
 * @param {Object} options - Connection options
 * @returns {Promise<{client: MongoClient, db: Db}>} MongoDB client and database
 */
export async function connectToDatabase(options = {}) {
  try {
    // Validate configuration
    validateConfig();
    
    // Return cached connection if available and healthy
    if (cachedClient && cachedDb && !isConnecting) {
      try {
        // Test connection health
        await cachedClient.db('admin').command({ ping: 1 });
        return { client: cachedClient, db: cachedDb };
      } catch (error) {
        console.warn('Cached connection unhealthy, reconnecting...', error.message);
        await disconnectFromDatabase();
      }
    }

    // Prevent multiple simultaneous connection attempts
    if (isConnecting) {
      // Wait for ongoing connection attempt
      while (isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
      }
    }

    isConnecting = true;

    // Merge options
    const connectionOptions = { ...CONFIG.options, ...options };
    
    console.info(`Connecting to MongoDB: ${CONFIG.uri.includes('srv') ? 'SRV' : 'Standard'} format`);
    
    // Create new connection with retry logic
    const client = new MongoClient(CONFIG.uri, connectionOptions);
    await client.connect();
    
    const db = client.db(CONFIG.dbName);
    
    // Verify connection
    await db.command({ ping: 1 });
    
    // Cache successful connection
    cachedClient = client;
    cachedDb = db;
    
    console.info(`Successfully connected to MongoDB database: ${CONFIG.dbName}`);
    
    return { client, db };
    
  } catch (error) {
    console.error('MongoDB connection failed:', {
      message: error.message,
      code: error.code,
      uri: CONFIG.uri?.replace(/\/\/.*:.*@/, '//***:***@') // Hide credentials in logs
    });
    
    // Reset cache on connection failure
    cachedClient = null;
    cachedDb = null;
    
    throw new Error(`Database connection failed: ${error.message}`);
  } finally {
    isConnecting = false;
  }
}

/**
 * Safely disconnect from MongoDB
 * @returns {Promise<void>}
 */
export async function disconnectFromDatabase() {
  try {
    if (cachedClient) {
      await cachedClient.close();
      console.info('MongoDB connection closed');
    }
  } catch (error) {
    console.warn('Error closing MongoDB connection:', error.message);
  } finally {
    cachedClient = null;
    cachedDb = null;
    isConnecting = false;
  }
}

/**
 * Get database instance with automatic connection
 * @returns {Promise<Db>} MongoDB database instance
 */
export async function getDatabase() {
  const { db } = await connectToDatabase();
  return db;
}

/**
 * Execute database operation with automatic connection and error handling
 * @param {Function} operation - Database operation function
 * @returns {Promise<any>} Operation result
 */
export async function withDatabase(operation) {
  try {
    const { db } = await connectToDatabase();
    return await operation(db);
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
}