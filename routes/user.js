import { Router } from 'express';
import { getChats, getChatWithMessages, login } from '../controllers/user.js';
import { isAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/auth/login', login);

router.post('/chats', isAuth, getChats);

router.post('/chats/:chatId', isAuth, getChatWithMessages);

export default router;
