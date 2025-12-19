import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let MONGODB_URI = process.env.MONGODB_URI;

// Add authSource if not already present
if (!MONGODB_URI.includes('authSource')) {
  MONGODB_URI = MONGODB_URI.includes('?') 
    ? `${MONGODB_URI}&authSource=admin`
    : `${MONGODB_URI}?authSource=admin`;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
