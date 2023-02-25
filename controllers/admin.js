import { StatusCodes } from 'http-status-codes/build/cjs/status-codes.js';
import prisma from '../prisma/client.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import jwt from 'jsonwebtoken';

export const signin = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  /*#swagger.requestBody = {
      required: true,
      '@content': {
        'application/json': {
          schema: {
            type: 'object',
              properties: {
                email: { type: 'string'},
                password: { type: 'string'}
              }
            }
          }
        }
      }
    }
  */

  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('please provide email, password');
  }

  const admin = await prisma.admin.findFirst({
    where: {
      email,
      password,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!admin) {
    throw new NotFoundError('no admin with this email and password');
  }

  const token = jwt.sign(admin, process.env.JWT_SECRET);

  res.status(StatusCodes.OK).json({ admin, token });
};
