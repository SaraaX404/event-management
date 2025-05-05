import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Import routes
import userRoutes from './Routes/User';
import eventRoutes from './Routes/Event';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware   
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});



// Use routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err: Error) => {
    console.error('Failed to connect to MongoDB', err);
  });




// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
