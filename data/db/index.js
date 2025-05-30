// config/db.js
const mongoose = require('mongoose');

async function connectDB() {
  try {
    let mongo_string = process.env.MONGO_CRED
    await mongoose.connect(mongo_string);
    console.log("✅ MongoDB connected using Mongoose");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
