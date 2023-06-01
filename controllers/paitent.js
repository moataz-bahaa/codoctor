import prisma from '../prisma/client.js';
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from '../utils/errors.js';
import { StatusCodes } from 'http-status-codes';
import { ITEMS_PER_PAGE } from '../utils/constants.js';
import jwt from 'jsonwebtoken';
import { hash } from '../utils/bcrypt.js';
import { clearFile } from '../utils/upload.js';
import axios from 'axios';

export const postSignup = async (req, res, next) => {
  // #swagger.tags = ['Patient']
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
            }
          }
        }
      }
    }
  */

  const { email, password, firstName, midName, lastName, gender } = req.body;

  if (!email || !password || !firstName || !lastName) {
    throw new BadRequestError();
  }

  const hashedPassword = await hash(password);

  const patient = await prisma.patient.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashedPassword,
      midName,
      gender,
    },
  });

  const token = jwt.sign(
    {
      id: patient.id,
      email: patient.email,
    },
    process.env.JWT_SECRET
  );

  res.status(StatusCodes.OK).json({
    patient,
    token,
  });
};

export const getPatientProfile = async (req, res, next) => {
  // #swagger.tags = ['Patient']

  const { patientId } = req.params;

  const patient = await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
    include: {
      offlineConsultations: {
        include: {
          prescription: true,
          clinc: true,
        },
      },
      onlineConsultations: true,
      previousDiseases: true,
      previousMedicines: true,
    },
  });

  if (!patient) {
    throw new NotFoundError('no patient with this id');
  }

  res.status(StatusCodes.OK).json({
    patient,
  });
};

export const postDoctorReview = async (req, res, next) => {
  // #swagger.tags = ['Patient']
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
              title: { type: 'string'},
              description: { type: 'string'},
              rate: { type: 'number'},
            }
          }
        }
      }
    }
  */

  const { doctorId, title, description, rate } = req.body;

  if (!doctorId || !title || !rate) {
    throw new BadRequestError();
  }

  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!doctor) {
    throw new NotFoundError('no doctor with this id');
  }

  const review = await prisma.doctorReview.create({
    data: {
      rate,
      title,
      description,
      doctorId: doctor.id,
      patientId: req.patient.id,
    },
  });

  res.status(StatusCodes.OK).json({
    review,
  });
};

export const postBookOnlineConsultation = async (req, res, next) => {
  // #swagger.tags = ['Patient']
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
              appointment: { type: 'string'},
            }
          }
        }
      }
    }
  */

  const { doctorId, appointment } = req.body;
  if (!doctorId) {
    throw new BadRequestError();
  }

  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!doctor) {
    throw new NotFoundError('no doctor with this id');
  }

  const previousConsultation = await prisma.onlineConsultation.findFirst({
    where: {
      doctorId: doctor.id,
      patientId: req.patient.id,
    },
  });

  const onlineConsultation = await prisma.onlineConsultation.create({
    data: {
      appointment: new Date(),
      doctor: {
        connect: {
          id: doctor.id
        }
      },
      patient: {
        connect: {
          id: req.patient.id
        }
      },
      chat: previousConsultation
        ? {
            connect: {
              id: previousConsultation.chatId,
            },
          }
        : {
            create: {
              name: `${doctor.firstName} - ${req.patient.firstName}`,
            },
          },
    },

    include: {
      chat: true,
    },
  });

  if (!previousConsultation) {
    await prisma.chatUser.createMany({
      data: [
        {
          chatId: onlineConsultation.chat.id,
          userId: doctor.id,
        },
        {
          chatId: onlineConsultation.chat.id,
          userId: req.patient.id,
        },
      ],
    });
  }

  const consulation = await prisma.onlineConsultation.findUnique({
    where: {
      id: onlineConsultation.id,
    },
    include: {
      chat: true,
      doctor: true,
      patient: true,
    },
  });

  res.status(StatusCodes.OK).json({
    consulation,
  });
};

export const postDiseasePrediction = async (req, res, next) => {
  // #swagger.tags = ['Patient']
  /*#swagger.requestBody = {
      required: true,
      '@content': {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              diseases: { type: 'object'},
            }
          }
        }
      }
    }
  */

  const { diseases } = req.body;
  const inputArray = Object.keys(diseases).map((key) => diseases[key]);

  try {
    const { data: result } = await axios.post(
      `https://flask-maching-learning-models.onrender.com/codoctor/predict`,
      {
        inputArray,
      }
    );

    res.status(StatusCodes.OK).json({
      result,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: 'Error',
      message: 'Error in the machine learning model',
      length: inputArray.length,
    });
  }
};
