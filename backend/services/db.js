const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempts to connect using the string in your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Connected Successfully: ${conn.connection.host} 🚀`);
  } catch (error) {
    // If the password is wrong or IP isn't whitelisted, this will run
    console.error(`Error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;