import { Router } from 'express';
import { login } from '../controllers/user.js';

const router = Router();

router.post('/auth/login', login);

export default router