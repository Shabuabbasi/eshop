import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './Routes/userRoutes.js';
import connectDB from './config/db.js'; 
import productRoutes from './Routes/productRoutes.js';
import categoryRoutes from './Routes/categoryRoutes.js'
import orderRoutes from './Routes/orderRoutes.js'
import sellerRoutes from './Routes/sellerRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB Connection
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes)

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
