import { StatusCodes } from 'http-status-codes/build/cjs/status-codes.js';
import prisma from '../prisma/client.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import jwt from 'jsonwebtoken';

export const postVerifyDoctor = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */
  /*#swagger.requestBody = {
      required: true,
      '@content': {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              doctorId: { type: 'string'},
            }
          }
        }
      }
    }
  */

  const { doctorId } = req.body;
  if (!doctorId) {
    throw new BadRequestError('Please provide doctor id');
  }

  let doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) {
    throw new NotFoundError('doctor not found');
  }

  const newDoctor = await prisma.doctor.update({
    where: { id: doctor.id },
    data: {
      isVeriyfied: true,
    },
  });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    message: 'doctor veryfied successfully',
    doctor: newDoctor,
  });
};

export const postBlockDoctor = async (req, res, next) => {};

export const deleteDoctor = async (req, res, next) => {};

export const postBlockPatient = async (req, res, next) => {};

export const deletePatient = async (req, res, next) => {};
