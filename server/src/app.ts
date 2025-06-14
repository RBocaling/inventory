import express from 'express';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import productRoutes from './routes/product.routes';
import salesRoutes from './routes/sale.routes';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(json());
app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
);
  
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/sale", salesRoutes);
export default app;
