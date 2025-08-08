const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the connection string provided in the MONGODB_URI
 * environment variable. When the connection is established the returned
 * promise resolves; otherwise it rejects and logs the error to the console.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  console.log('DEBUG: MONGODB_URI from env:', process.env.MONGODB_URI);
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
