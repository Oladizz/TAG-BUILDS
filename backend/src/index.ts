console.log('Starting backend server...');
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import tagRoutes from './routes/tags';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const port = parseInt(process.env.PORT || '3001', 10);

app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  console.log('Request Headers:', req.headers);
  next();
});

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));

app.use('/api', tagRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../../dist')));

// Catch-all to serve index.html for client-side routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
});

console.log('Connecting to MongoDB...');
try {
  mongoose.connect(process.env.MONGO_URI || '')
    .then(() => {
      console.log('MongoDB connected successfully.');
      app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
} catch (error) {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
}
