import prisma from './client.js';

const addDummyMedicalSpecializations = async () => {
  const specializations = [
    'Allergy and immunology',
    'Anesthesiology',
    'Dermatology',
    'Diagnostic radiology',
    'Emergency medicine',
    'Family medicine',
    'Internal medicine',
    'Medical genetics',
    'Neurology',
    'Nuclear medicine',
    'Obstetrics and gynecology',
    'Ophthalmology',
    'Pathology',
    'Pediatrics',
    'Physical medicine and rehabilitation',
    'Preventive medicine',
    'Psychiatry',
    'Radiation oncology',
    'Surgery',
    'Urology',
  ];
  const result = await prisma.medicalSpecialization.createMany({
    data: specializations.map((sp) => ({
      title: sp,
    })),
  });
  console.log('medical specializations:', result);
};

(async () => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: '5f8c15b9-4793-44f3-a372-1420112cd4e9',
      },
      include: {
        chats: {
          include: {
            chat: true,
          }
        },
      }
    });

    console.log(user.chats);
  } catch (err) {
    console.log(err);
  }
})();
