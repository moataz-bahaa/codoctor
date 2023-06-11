import prisma from './client.js';

(async () => {
  try {
    const medicines = await prisma.medicine.createMany({
      data: [
        {
          name: 'medicine - 1',
          patients: {
            connnect: {
              id: '866d6155-cfa2-4b72-9553-3359e10a0b57',
            },
          },
        },
      ],
    });

    console.log(medicines);
  } catch (err) {
    console.log(err);
  }
})();
