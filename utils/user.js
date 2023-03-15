import prisma from '../prisma/client.js';

export const getUser = async (email, password) => {
  return await prisma.$queryRawUnsafe(
    `SELECT * FROM User WHERE email = '${email}'`
  );
};
