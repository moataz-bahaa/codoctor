import prisma from './client.js';

(async () => {
  try {
    const consultation = await prisma.onlineConsultation.findFirst();
    console.log(consultation);
  } catch (err) {
    console.log(err);
  }
})();
