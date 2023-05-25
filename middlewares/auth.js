import jwt from 'jsonwebtoken';
import { UnAuthenticatedError } from '../utils/errors.js';
import prisma from '../prisma/client.js';

const getUser = async (authorization) => {
  try {
    if (!authorization) {
      throw new UnAuthenticatedError('There is no token attached to header');
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnAuthenticatedError('There is no token attached to header');
    }
    const userData = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: userData.id,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await getUser(req.headers?.authorization);
    if (!user || user.role !== 'admin') {
      throw new UnAuthenticatedError('access denied');
    }
    delete user.password;
    req.admin = user;
    next();
  } catch (err) {
    throw new UnAuthenticatedError(`you don't have perimissions`);
  }
};

export const isAdminOrDoctor = async (req, res, next) => {
  try {
    const user = await getUser(req.headers?.authorization);
    if (!user || user.role === 'patient') {
      throw new UnAuthenticatedError('access denied');
    }
    delete user.password;
    req.doctor = user;
    req.admin = user;
    next();
  } catch (err) {
    throw new UnAuthenticatedError(`you don't have perimissions`);
  }
};

export const isDoctor = async (req, res, next) => {
  try {
    const user = await getUser(req.headers?.authorization);
    if (user.role !== 'doctor') {
      throw new UnAuthenticatedError('access denied');
    }
    delete user.password;
    req.doctor = user;
    next();
  } catch (err) {
    throw new UnAuthenticatedError(`you don't have perimissions`);
  }
};

export const isPatient = async (req, res, next) => {
  try {
    const user = await getUser(req.headers?.authorization);
    if (!user || user.role !== 'patient') {
      throw new UnAuthenticatedError('access denied');
    }
    delete user.password;
    req.patient = user;
    next();
  } catch (err) {
    throw new UnAuthenticatedError(`you don't have perimissions`);
  }
};

export const isAuth = async (req, res, next) => {
  try {
    const user = await getUser(req.headers?.authorization);
    if (!user) {
      throw new UnAuthenticatedError('access denied');
    }
    delete user.password;
    req.user = user;
    next();
  } catch (err) {
    throw new UnAuthenticatedError(`you don't have perimissions`);
  }
};
