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
          description: faker.lorem.lines(1),
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

    // generate 20 patient
    const patients = [];
    for (let i = 0; i < 20; i++) {
      const patient = await prisma.patient.create({
        data: {
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          password: faker.internet.password(),
        },
      });

      patients.push(patient);
    }

    // generate 20 consulations
    const onlineConsultations = [];
    for (let i = 0; i < 20; i++) {
      const doctor = faker.helpers.arrayElement(doctors),
        patient = faker.helpers.arrayElement(patients);

      const onlineConsultation = await prisma.onlineConsultation.create({
        data: {
          appointment: faker.date.anytime(),
          doctorId: doctor.id,
          patientId: patient.id,
          chat: {
            create: {
              name: `${doctor.firstName} - ${patient.firstName}`,
            },
          },
        },
        include: {
          chat: true,
          doctor: true,
          patient: true,
        },
      });

      await prisma.chatUser.createMany({
        data: [
          {
            chatId: onlineConsultation.chat.id,
            userId: doctor.id,
          },
          {
            chatId: onlineConsultation.chat.id,
            userId: patient.id,
          },
        ],
      });

      onlineConsultations.push(onlineConsultation);
    }

    // generate 100 message
    for (let i = 0; i < 100; i++) {
      const consulation = faker.helpers.arrayElement(onlineConsultations);
      const msg = await prisma.message.create({
        data: {
          chatId: consulation.chat.id,
          senderId: i % 2 == 0 ? consulation.doctorId : consulation.patientId,
          content: faker.color.human(),
        },
      });
    }

    console.log('Dummy data inserted successfully');
  } catch (err) {
    console.error(err);
  }
})();
