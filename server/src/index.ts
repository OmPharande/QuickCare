import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || '';

// Connect to MongoDB, then start the server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
