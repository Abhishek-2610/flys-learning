const mongoose = require('mongoose');
require('dotenv').config();

const connectMongo = async () => {
  try {
    // Mongoose connection options (modern defaults are usually sufficient)
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ Connected to Mongo Database');
  } catch (err) {
    console.error('❌ Mongo Connection Failed:', err.message);
    process.exit(1);
  }
};

module.exports = { connectMongo };