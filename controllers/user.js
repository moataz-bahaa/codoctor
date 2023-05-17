import prisma from '../prisma/client.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { comparePassword } from '../utils/bcrypt.js';
import { getUser } from '../utils/user.js';

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
