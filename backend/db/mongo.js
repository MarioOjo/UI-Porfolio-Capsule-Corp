const mongoose = require('mongoose');

async function connectMongo(uri) {
  if (!uri) {
    console.log('ℹ️  MONGO_URI not set; skipping MongoDB connection');
    return null;
  }

  // Use modern connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    await mongoose.connect(uri, opts);
    console.log('✅ MongoDB (Mongoose) connected');
    mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
    mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
    return mongoose;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err && err.message ? err.message : err);
    throw err;
  }
}

module.exports = { connectMongo, mongoose };
