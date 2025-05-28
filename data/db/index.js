// config/db.js
const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://admin:525678@cluster0.d0luzlj.mongodb.net/airtribe');
    console.log("✅ MongoDB connected using Mongoose");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
