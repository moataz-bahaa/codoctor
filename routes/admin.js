import { Router } from 'express';
import { postVerifyDoctor } from '../controllers/admin.js';
import { isAdmin } from '../middlewares/auth.js';

const router = Router();

router.post('/doctor/veryfiy', isAdmin, postVerifyDoctor)

export default router;
