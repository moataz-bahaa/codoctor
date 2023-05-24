import prisma from '../prisma/client.js';
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from '../utils/errors.js';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { ITEMS_PER_PAGE } from '../utils/constants.js';
import { hash } from '../utils/bcrypt.js';
import { clearFile } from '../utils/upload.js';

export const postSignup = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  // #swagger.description = 'signup for doctor'
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

  const isUserExist = await prisma.user.findFirst({ where: { email } });
  if (isUserExist) {
    throw new BadRequestError('this email already exists');
  }

  const specialization = await prisma.medicalSpecialization.findFirst({
    where: { id: specializationId },
  });

  if (!specialization) {
    throw new NotFoundError('specialization not fount');
  }

  const hashedPassword = await hash(password);

  const doctor = await prisma.doctor.create({
    data: {
      email,
      password: hashedPassword,
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
  // #swagger.description = 'Get clincs of a specific doctor'

  const { id } = req.params;

  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) {
    throw new NotFoundError('doctor not found');
  }

  const clincs = await prisma.clinc.findMany({
    where: {
      doctor: {
        id: doctor.id,
      },
    },
    select: {
      id: true,
      address: true,
      name: true,
      phone: true,
      reservationPrice: true,
      workAppointments: true,
    },
  });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    clincs,
  });
};

export const postClinc = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  // #swagger.description = 'post new clinc'
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
  // #swagger.description = 'get clinc by id'

  const { id } = req.params;
  const clinc = await prisma.clinc.findUnique({
    where: {
      id,
    },
    include: {
      workAppointments: true,
      consultations: true,
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
  // #swagger.description = 'delete clinc'
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */

  const { id } = req.params;
  const clinc = await prisma.clinc.findFirst({
    where: {
      id: id,
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
      id: id,
    },
  });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    message: 'clinc deleted successfully',
  });
};

export const getOfflineConsulations = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  // #swagger.description = 'get all offline consultations'
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */

  let page = +req.query.page;

  if (isNaN(page)) page = 1;

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
  // #swagger.description = 'get all online consultations'
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */

  let page = +req.query.page;

  if (isNaN(page)) page = 1;

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

export const getDoctors = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  // #swagger.description = 'search for doctors by name or by specializtion'

  let { search, page } = req.query;
  if (!page) page = 1;
  page = +page;

  if (!search) search = '';

  const numberOfDoctors = await prisma.doctorDetails.count({
    where: {
      OR: [
        { firstName: { contains: search } },
        { midName: { contains: search } },
        { lastName: { contains: search } },
        { medicalSpecialization: { contains: search } },
      ],
    },
  });

  const doctors = await prisma.doctorDetails.findMany({
    where: {
      OR: [
        { firstName: { contains: search } },
        { midName: { contains: search } },
        { lastName: { contains: search } },
        { medicalSpecialization: { contains: search } },
      ],
    },
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    numberOfItems: numberOfDoctors,
    numberOfPages: Math.ceil(numberOfDoctors / ITEMS_PER_PAGE),
    doctors,
  });
};

export const getDoctorProfile = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  // #swagger.description = 'Get doctor profile'

  const { id } = req.params;
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      midName: true,
      lastName: true,
      onlineExaminationPrice: true,
      specialization: true,
      onlineWorkAppointments: true,
      clincs: {
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
        },
      },
      reviews: {
        select: { id: true, title: true, rate: true, description: true },
      },
      _count: {
        select: {
          onlineConsultations: true,
          certificates: true,
        },
      },
    },
  });

  if (!doctor) {
    throw new NotFoundError('doctor not found');
  }

  delete doctor.password;
  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    doctor,
  });
};

export const getReviews = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  // #swagger.description = 'Get doctor reviews'

  const { id } = req.params;

  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) {
    throw new NotFoundError('no doctor with the attched id');
  }

  const reviews = await prisma.doctorReview.findMany({
    where: {
      doctorId: doctor.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      rate: true,
      patient: {
        select: {
          id: true,
          firstName: true,
          midName: true,
          lastName: true,
          gender: true,
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    reviews,
  });
};

export const getCertificates = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  // #swagger.description = 'get docotr certificates'

  const { id } = req.params;

  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) {
    throw new NotFoundError('doctor not found');
  }

  const certificates = await prisma.certificate.findMany({
    where: { doctorId: doctor.id },
  });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    certificates,
  });
};

export const postCertificate = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  // #swagger.description = 'post new doctor certificate'
  /*#swagger.requestBody = {
      required: true,
      '@content': {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              destination: { type: 'string'},
              image: { type: 'file'},
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
  const { destination } = req.body;
  const image = req.file;
  if (!destination) {
    throw new BadRequestError('please provide all data');
  }

  const imageUrl = image?.path?.replace('\\', '/') ?? null;

  const certificate = await prisma.certificate.create({
    data: {
      destination,
      imageUrl,
      doctor: {
        connect: {
          id: req.doctor.id,
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    message: 'Certificate created successfully',
    certificate,
  });
};

export const patchCertificate = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  // #swagger.description = 'update doctor certificate'
  /*#swagger.requestBody = {
      required: true,
      '@content': {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              destination: { type: 'string'},
              image: { type: 'file' }
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
  const { destination } = req.body;
  const { id } = req.params;
  const image = req.file;
  let imageUrl = '';
  if (image) {
    imageUrl = image.path.replace('\\', '/');
  }

  const certificate = await prisma.certificate.findUnique({ where: { id } });
  if (!certificate) {
    throw new NotFoundError('certificate not found');
  }

  if (imageUrl) {
    clearFile(certificate.imageUrl);
  }

  const newCertificate = await prisma.certificate.update({
    where: { id },
    data: {
      destination: destination ?? certificate.destination,
      imageUrl: imageUrl || certificate.imageUrl,
    },
  });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    message: 'certificate updated successfully',
    certificate: newCertificate,
  });
};

export const deleteCertificate = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  // #swagger.description = 'delete doctor certificate'
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError('Please Provide an id');
  }
  const certificate = await prisma.certificate.findUnique({ where: { id } });
  if (!certificate) {
    throw new NotFoundError('certificate not found');
  }
  if (certificate.doctorId !== req.doctor.id) {
    throw new UnAuthenticatedError(
      `you don't have permissions to delete this certificate`
    );
  }

  try {
    clearFile(certificate.imageUrl);
  } catch (err) {
    console.log('no file exists');
  }
  await prisma.certificate.delete({ where: { id } });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    message: 'Certificate deleted successfully',
  });
};

export const getSpecializations = async (req, res, next) => {
  // #swagger.tags = ['Specialization']
  // #swagger.description = 'get all medical specializations'

  const specializations = await prisma.medicalSpecialization.findMany({
    select: {
      id: true,
      title: true,
      description: true,
    },
  });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    specializations,
  });
};

export const getDoctorSchedule = async (req, res, next) => {
  // #swagger.tags = ['Doctor']
  // #swagger.description = 'Get doctor schedule'
  /*#swagger.security = [{
      "bearerAuth": []
    }]
  */

  const clincs = await prisma.clinc.findMany({
    where: {
      doctorId: req.doctor?.id,
    },
    include: {
      consultations: {
        include: {
          patient: true,
          prescription: true,
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    clincs,
  });
};
