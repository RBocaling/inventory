import { authenticateToken } from './../middlewares/auth.middleware';
import { Router } from 'express';
import { getUserAuth, getUserById, getUserList, login, register, updateUser } from '../controllers/auth.controllers';

const router = Router();

router.post('/register', register as any );
router.post("/login", login as any);
router.get("/get-info", authenticateToken, getUserAuth as any);
router.get("/get-user-list", getUserList as any);
router.get("/get-user-by-id/:id", getUserById as any);
router.put("/update-user/:id", updateUser as any);

export default router;
