const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGO_URL;
    if (!uri) {
      console.error('ERROR: MONGO_URI or MONGO_URL is not defined in environment variables');
      return;
    }
    const conn = await mongoose.connect(uri);
    const host = conn.connection.host;
    console.log(`MongoDB Connected: ${host}`);
  } catch (err) {
    console.error('Database connection error:', err.message);
    // Remove process.exit(1) to allow the server to at least respond to health checks
  }
};

module.exports = connectDB;
