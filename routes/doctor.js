import { Router } from 'express';
import { postSignup } from '../controllers/doctor.js';

const router = Router();


router.post('/auth/signup', postSignup)


export default router