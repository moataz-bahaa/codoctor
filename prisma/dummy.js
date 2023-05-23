import prisma from './client.js';
import { faker } from '@faker-js/faker';

(async () => {
  try {
    // generate 10 doctors
    const medicalSpecialilzations = [];
    for (let i = 0; i < 10; i++) {
      const sp = await prisma.medicalSpecialization.create({
        data: {
          title: faker.string.alpha(),
          description: faker.lorem.lines(1)
        },
      });

      medicalSpecialilzations.push(sp);
    }

    // generate 10 doctors
    const doctors = [];
    for (let i = 0; i < 10; i++) {
      const doctor = await prisma.doctor.create({
        data: {
          firstName: faker.person.firstName('male'),
          lastName: faker.person.lastName('male'),
          email: faker.internet.exampleEmail(),
          password: faker.internet.password(),
          gender: 'male',
          medicalSpecializationId: faker.helpers.arrayElement(
            medicalSpecialilzations
          ).id,
        },
      });

      doctors.push(doctor);
    }

    // generate 20 doctors
    const clincs = [];
    for (let i = 0; i < 10; i++) {
      const clinc = await prisma.clinc.create({
        data: {
          name: faker.string.alpha(6),
          address: faker.location.streetAddress(),
          phone: faker.phone.number(),
          reservationPrice: faker.number.int({ max: 1000 }),
          doctorId: faker.helpers.arrayElement(doctors).id,
        },
      });
    }

    console.log('Dummy data inserted successfully');
  } catch (err) {
    console.error(err);
  }
})();
