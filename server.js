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
    // For strict SQL migrations, remove this and use explicit migration/DDL.
    await sequelize.sync();
    console.log('MySQL tables are ready');
  } catch (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
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
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
