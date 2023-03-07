import prisma from './client.js';

(async () => {
  try {
    const users = await prisma.user.findMany();
    console.log(users);
  } catch (err) {
    console.log(err);
  }
})();
