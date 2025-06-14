import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct } from '../controllers/product.controllers';

const router = Router();

// Routes
router.post("/", createProduct as any);
router.put("/:id", updateProduct as any);
router.get("/", getAllProducts as any);
router.get("/:id", getProductById as any);

export default router;
