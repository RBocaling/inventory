import { Router } from 'express';
import { createSale, getAllSales, getSaleById, updateSale } from '../controllers/sale.controllers';

const router = Router();

// Routes
router.post("/", createSale as any);
router.put("/:id", updateSale as any);
router.get("/", getAllSales as any);
router.get("/:id", getSaleById as any);

export default router;
