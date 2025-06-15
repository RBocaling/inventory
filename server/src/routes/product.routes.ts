import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct } from '../controllers/product.controllers';
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// Routes
router.post("/", authenticateToken, createProduct as any);
router.put("/:id", authenticateToken, updateProduct as any);
router.get("/", getAllProducts as any);
router.get("/:id", getProductById as any);

export default router;
