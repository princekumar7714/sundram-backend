import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import sequelize from './config/sequelize.js';

import productRouter from './routes/productRoutes.js';
import authRouter from './routes/authRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import dashboardRoutes from "./routes/dashboardRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SQL connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected');

    // Auto-create tables based on Sequelize models.
    await sequelize.sync();
    console.log('MySQL tables are ready');
  } catch (err) {
    // On Render (and other platforms), MySQL may not be reachable at boot
    // (missing env vars / DB not provisioned). Don't crash the app.
    const env = {
      DB_HOST: process.env.DB_HOST,
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      DB_PORT: process.env.DB_PORT,
    };
    console.error('MySQL connection error (continuing without DB sync):', err?.message || err);
    console.error('DB env snapshot:', env);
  }
})();


app.get('/', (req, res) => {
  res.send('Sundram Agri API Running');
});

app.use('/products', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
