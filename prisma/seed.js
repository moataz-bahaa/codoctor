import prisma from './client.js';

(async () => {
  try {
    const users = await prisma.$queryRawUnsafe(`SELECT * FROM User`)
    console.log(users);
  } catch (err) {
    console.log(err);
  }
})();
