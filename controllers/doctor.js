import prisma from '../prisma/client.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

export const postSignup = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  /*#swagger.requestBody = {
      required: true,
      '@content': {
        'application/json': {
          schema: {
            type: 'object',
              properties: {
                email: { type: 'string'},
                password: { type: 'string'},
                firstName: { type: 'string'},
                midName: { type: 'string'},
                lastName: { type: 'string'},
                gender: { type: 'string'},
                nationalId: { type: 'string'},
                specializationId: { type: 'string'},
              }
            }
          }
        }
      }
    }
  */

  const {
    email,
    password,
    firstName,
    midName,
    lastName,
    gender,
    nationalId,
    specializationId,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !gender ||
    !gender ||
    !email ||
    !password ||
    !specializationId
  ) {
    throw BadRequestError('please provide all data');
  }

  const isEmailExsists = await prisma.doctor.findFirst({ where: { email } });
  if (isEmailExsists) {
    throw new BadRequestError('this email already exists');
  }

  const specialization = await prisma.medicalSpecialization.findFirst({
    where: { id: specializationId },
  });
  if (!specialization) {
    throw new NotFoundError('specialization not fount');
  }

  const doctor = await prisma.doctor.create({
    data: {
      email,
      password,
      firstName,
      midName,
      lastName,
      gender,
      nationalId,
      specialization: {
        connect: {
          id: specializationId,
        },
      },
    },
  });

  delete doctor.password;

  res.status(StatusCodes.CREATED).json({ doctor });
};
