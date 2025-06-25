const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    // Nur im echten Server-Prozess exit:
    if (require.main === module) process.exit(1);
    else throw err; // für Tests
  }
};


module.exports = connectDB;
