import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { createCustomer, getAllCustomers, getCustomerById, updateCustomer } from '../controllers/customer.controllers';

const router = Router();

// Routes
router.post("/", createCustomer as any);
router.put('/:id' ,updateCustomer as any);
router.get("/", getAllCustomers as any);
router.get("/:id", getCustomerById as any);

export default router;
