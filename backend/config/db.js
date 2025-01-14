const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
      await mongoose.connect('mongodb+srv://dianaal791:<dianush11220>@dianab.dd568.mongodb.net/?retryWrites=true&w=majority&appName=dianaB', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected...');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err.message);
      process.exit(1);
    }
  };

module.exports = connectDB;
