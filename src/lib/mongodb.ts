import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  // IMPORTANT: The MONGODB_URI is hardcoded here to bypass environment variable loading issues.
  // In a real-world production application, this should be loaded from a secure environment variable.
  const MONGODB_URI = "mongodb+srv://kumarplayground12345:DyyN8ActKuuvqj5f@cluster0.g3lsyha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  if (!MONGODB_URI) {
    // This check is kept for future-proofing, in case the hardcoded value is removed.
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env'
    );
  }
  
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
