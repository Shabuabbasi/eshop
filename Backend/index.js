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
import wishlistRoutes from './Routes/wishlistRoutes.js'
import adminRoutes from './Routes/adminRoutes.js'
import searchRoute from './Routes/searchRoute.js'
import courierRoutes from './Routes/courierRoutes.js'
import reviewRoutes from './Routes/reviewRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';


import http from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './socket.js'; // Import the socket setup function
import chatRoutes from './Routes/chatRoutes.js';

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
app.use("/api/products", searchRoute);
app.use('/categories', categoryRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes)
app.use("/api/wishlist", wishlistRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/chat', chatRoutes);
app.use('/api/message', chatRoutes);
app.use('/api/chat', chatRoutes);


app.use('/api/courier',courierRoutes);
app.use('/api/reviews', reviewRoutes);


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

setupSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running at http://localhost:${PORT}`);
});