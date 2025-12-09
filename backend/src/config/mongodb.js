const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || '';
const MONGO_RETRY_INTERVAL_MS = Number(process.env.MONGO_RETRY_INTERVAL_MS || 5000);

let isMongoConnected = false;

async function connectMongoWithRetry() {
  if (!MONGO_URI) {
    console.warn('⚠️ MONGO_URI is not set. Skipping MongoDB connection.');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log('✅ MongoDB connected successfully.');
  } catch (err) {
    isMongoConnected = false;
    console.error('❌ MongoDB connection failed:', err.message);
    console.log(`⏱ Retrying MongoDB connection in ${MONGO_RETRY_INTERVAL_MS / 1000}s...`);
    setTimeout(connectMongoWithRetry, MONGO_RETRY_INTERVAL_MS);
  }
}

// Listen for disconnections and automatically retry
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
  isMongoConnected = false;
  setTimeout(connectMongoWithRetry, MONGO_RETRY_INTERVAL_MS);
});

module.exports = {
  connectMongoWithRetry,
  isMongoConnected: () => isMongoConnected,
  mongoose
};
