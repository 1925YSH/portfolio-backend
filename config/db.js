const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined.');
  }

  // If already connected, return existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection promise is not already in flight, create one
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    }).then((mongooseInstance) => {
      console.log('✅ MongoDB Connected successfully');
      return mongooseInstance;
    }).catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
