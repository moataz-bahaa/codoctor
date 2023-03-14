import prisma from './client.js';

(async () => {
  try {
    const users = await prisma.user.findFirst({
      where: {
        email: 'moataz@test.com',
        password: '328221'
      }
    });
    console.log(users);
  } catch (err) {
    console.log(err);
  }
})();
