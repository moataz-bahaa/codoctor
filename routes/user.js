import { Router } from 'express';
import {
  getChats,
  getChatWithMessages,
  login,
  postMessage,
} from '../controllers/user.js';
import { isAuth } from '../middlewares/auth.js';
import upload from '../utils/upload.js';

const router = Router();

router.post('/auth/login', login);

router.get('/chats', isAuth, getChats);

router.get('/chats/:chatId', isAuth, getChatWithMessages);

router.post(
  '/chats/:chatId',
  isAuth,
  upload.single('attachedFile'),
  postMessage
);

export default router;
