import mongoose from 'mongoose';

// Ensure MONGODB_URI environment variable is defined
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global type augmentation for caching the mongoose connection
 * This prevents TypeScript errors when accessing global.mongoose
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

/**
 * Cached mongoose connection to prevent multiple connections
 * in development due to Next.js hot-reloading
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes a connection to MongoDB using Mongoose
 * Implements connection caching to reuse existing connections
 * 
 * @returns Promise<mongoose.Connection> - The active mongoose connection
 */
async function connectToDatabase(): Promise<mongoose.Connection> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing connection promise if one is in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering for better error handling
    };

    // Create new connection promise
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    // Await the connection and cache it
    cached.conn = await cached.promise;
  } catch (e) {
    // Clear the promise on error to allow retry
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
