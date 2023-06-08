import prisma from '../prisma/client.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { comparePassword } from '../utils/bcrypt.js';
import { sendMessageToSocket } from '../app.js';

export const login = async (req, res, next) => {
  // #swagger.tags = ['User']
  /*#swagger.requestBody = {
      required: true,
      '@content': {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              password: { type: 'string' }
            }
          }
        }
      }
    }
  */
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('please provide email and password');
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // const user = (await getUser(email, password))[0];

  if (!user) {
    throw new NotFoundError('no user with this email and password');
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new NotFoundError(`password doesn't match`);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET
  );

  delete user.password;

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    user,
    token,
  });
};

export const getChats = async (req, res, next) => {
  // #swagger.tags = ['User']
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */

  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: {
          userId: req.user.id,
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    chats,
  });
};

export const getChatWithMessages = async (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'get all chat data (consultation, users, messages)'
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */

  const { chatId } = req.params;

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
    include: {
      consultations: true,
      users: {
        include: {
          user: true,
        },
      },
      messages: true,
    },
  });

  if (!chat) {
    throw new NotFoundError();
  }

  const users = chat.users.map((u) => ({
    ...u.user,
  }));

  res.status(StatusCodes.OK).json({
    chat: {
      ...chat,
      users,
    },
  });
};

export const postMessage = async (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'post new message'
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */
  /*#swagger.requestBody = {
      required: true,
      '@content': {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              content: { type: 'string'},
              attachedFile: { type: 'file'},
            }
          }
        }
      }
    }
  */

  const { content } = req.body;
  const { chatId } = req.params;

  const attachedFile = req.file;

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
    include: {
      users: true,
    },
  });

  if (!chat) {
    throw new NotFoundError('no chat with this id');
  }

  const message = await prisma.message.create({
    data: {
      senderId: req.user.id,
      chatId: chat.id,
      attachedFileUrl: attachedFile?.path,
      content,
    },
  });

  res.status(StatusCodes.OK).json({
    message,
  });

  sendMessageToSocket({
    chat,
    ...message,
  });
};
