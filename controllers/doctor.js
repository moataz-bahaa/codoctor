import prisma from '../prisma/client.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { ITEMS_PER_PAGE } from '../utils/constants.js';

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
    throw new BadRequestError('please provide all data');
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

  const token = jwt.sign(
    {
      id: doctor.id,
      email: doctor.email,
    },
    process.env.JWT_SECRET
  );

  delete doctor.password;

  res.status(StatusCodes.CREATED).json({
    statusCode: StatusCodes.OK,
    doctor,
    token,
  });
};

export const getClincs = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */

  const clincs = await prisma.clinc.findMany({
    where: {
      doctor: {
        id: req.doctor.id,
      },
    },
    select: {
      id: true,
      address: true,
      name: true,
      phone: true,
      reservationPrice: true,
    },
  });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    clincs,
  });
};

export const postClinc = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  /*#swagger.requestBody = {
      required: true,
      '@content': {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string'},
              phone: { type: 'string'},
              address: { type: 'string'},
              reservationPrice: { type: 'integer'},
              workAppointments: { 
                type: 'array',
                example: [
                  {
                    day: 'saturday',
                    from: '10:10 AM',
                    to: '03:00 BM'
                  }
                ] 
              },
            }
          }
        }
      }
    }
  */
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */

  const { name, phone, address, reservationPrice, workAppointments } = req.body;
  if (
    !name ||
    !phone ||
    !address ||
    reservationPrice === undefined ||
    !workAppointments
  ) {
    throw new BadRequestError('please provide all data');
  }
  const clinc = await prisma.clinc.create({
    data: {
      name,
      address,
      phone,
      reservationPrice,
      workAppointments: {
        createMany: {
          data: workAppointments,
        },
      },
      doctor: {
        connect: {
          id: req.doctor.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      reservationPrice: true,
      workAppointments: {
        select: {
          id: true,
          day: true,
          from: true,
          to: true,
        },
      },
    },
  });

  res.status(StatusCodes.CREATED).json({
    statusCode: StatusCodes.CREATED,
    message: 'clinc added successfully',
    clinc,
  });
};

export const getClinc = async (req, res, next) => {
  // #swagger.tags = ['Doctor']

  const { id } = req.params;
  const clinc = await prisma.clinc.findUnique({
    where: {
      id,
    },
  });

  if (!clinc) {
    throw new NotFoundError('clinc not found');
  }

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    clinc,
  });
};

export const deleteClinc = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  /*#swagger.requestBody = {
      required: true,
      '@content': {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              clincId: { type: 'string'},
            }
          }
        }
      }
    }
  */
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */

  const { clincId } = req.body;
  const clinc = await prisma.clinc.findFirst({
    where: {
      id: clincId,
    },
  });

  if (!clinc) {
    throw new NotFoundError('clinc not found');
  }

  if (clinc.doctorId !== req.doctor.id) {
    throw new UnAuthenticatedError(
      `the current doctor doesn't have permisson to delete this clinc`
    );
  }

  await prisma.clinc.delete({
    where: {
      id: clincId,
    },
  });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    message: 'clinc deleted successfully',
  });
};

export const getOfflineConsulations = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */

  const page = +req.query.page ?? 1;
  const numberOfItems = await prisma.offlineConsultation.count({
    where: {
      clinc: {
        doctorId: req.doctor.id,
      },
    },
  });

  const clincs = await prisma.clinc.findMany({
    where: {
      doctorId: req.doctor.id,
    },
    include: {
      consultations: true,
    },
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  let consultations = clincs.map((c) => c.consultations);

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    numberOfItems,
    numberOfPages: Math.ceil(numberOfItems / ITEMS_PER_PAGE),
    consultations,
  });
};

export const getOnlineConsultation = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */

  const page = req.query.page ?? 1;

  const numberOfItems = await prisma.onlineConsultations.count({
    where: {
      doctorId: req.doctor.id,
    },
  });
  const consultations = await prisma.onlineConsultations.findMany({
    where: {
      doctorId: req.doctor.id,
    },
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    numberOfItems,
    numberOfPages: Math.ceil(numberOfItems / ITEMS_PER_PAGE),
    consultations,
  });
};
