-- CreateTable
CREATE TABLE `Disease` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medicine` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prescription` (
    `id` VARCHAR(191) NOT NULL,
    `dignose` VARCHAR(191) NOT NULL,
    `requriedRays` VARCHAR(191) NULL,
    `requiredTests` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `midName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NULL,
    `nationalId` VARCHAR(191) NULL,
    `bloodGroup` VARCHAR(191) NULL,
    `weight` VARCHAR(191) NULL,
    `height` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `resetPasswordToken` DATETIME(3) NULL,
    `resertPasswordTokenExpires` DATETIME(3) NULL,

    UNIQUE INDEX `Patient_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DoctorReview` (
    `id` VARCHAR(191) NOT NULL,
    `rate` INTEGER NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `doctorId` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PatientReports` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `doctorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `midName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `nationalId` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    `isVeriyfied` BOOLEAN NOT NULL DEFAULT false,
    `onlineExaminationPrice` INTEGER NULL,
    `resetPasswordToken` DATETIME(3) NULL,
    `resertPasswordTokenExpires` DATETIME(3) NULL,
    `medicalSpecializationId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Doctor_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicalSpecialization` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clinc` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `reservationPrice` INTEGER NULL,
    `doctorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkAppointments` (
    `id` VARCHAR(191) NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `to` VARCHAR(191) NOT NULL,
    `clincId` VARCHAR(191) NULL,
    `doctorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificate` (
    `id` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `doctorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OfflineConsultation` (
    `id` VARCHAR(191) NOT NULL,
    `appointment` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `clincId` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `prescriptionId` VARCHAR(191) NULL,

    UNIQUE INDEX `OfflineConsultation_prescriptionId_key`(`prescriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OnlineConsultations` (
    `id` VARCHAR(191) NOT NULL,
    `appointment` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `doctorId` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chat` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `onlineConsultationsId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Chat_onlineConsultationsId_key`(`onlineConsultationsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NULL,
    `attachedFileUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `chatId` VARCHAR(191) NOT NULL,
    `senderId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DiseaseToPatient` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DiseaseToPatient_AB_unique`(`A`, `B`),
    INDEX `_DiseaseToPatient_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DiseaseToPrescription` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DiseaseToPrescription_AB_unique`(`A`, `B`),
    INDEX `_DiseaseToPrescription_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MedicineToPatient` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_MedicineToPatient_AB_unique`(`A`, `B`),
    INDEX `_MedicineToPatient_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MedicineToPrescription` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_MedicineToPrescription_AB_unique`(`A`, `B`),
    INDEX `_MedicineToPrescription_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DoctorReview` ADD CONSTRAINT `DoctorReview_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DoctorReview` ADD CONSTRAINT `DoctorReview_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientReports` ADD CONSTRAINT `PatientReports_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientReports` ADD CONSTRAINT `PatientReports_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_medicalSpecializationId_fkey` FOREIGN KEY (`medicalSpecializationId`) REFERENCES `MedicalSpecialization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clinc` ADD CONSTRAINT `Clinc_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkAppointments` ADD CONSTRAINT `WorkAppointments_clincId_fkey` FOREIGN KEY (`clincId`) REFERENCES `Clinc`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkAppointments` ADD CONSTRAINT `WorkAppointments_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfflineConsultation` ADD CONSTRAINT `OfflineConsultation_clincId_fkey` FOREIGN KEY (`clincId`) REFERENCES `Clinc`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfflineConsultation` ADD CONSTRAINT `OfflineConsultation_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfflineConsultation` ADD CONSTRAINT `OfflineConsultation_prescriptionId_fkey` FOREIGN KEY (`prescriptionId`) REFERENCES `Prescription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineConsultations` ADD CONSTRAINT `OnlineConsultations_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineConsultations` ADD CONSTRAINT `OnlineConsultations_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_onlineConsultationsId_fkey` FOREIGN KEY (`onlineConsultationsId`) REFERENCES `OnlineConsultations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiseaseToPatient` ADD CONSTRAINT `_DiseaseToPatient_A_fkey` FOREIGN KEY (`A`) REFERENCES `Disease`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiseaseToPatient` ADD CONSTRAINT `_DiseaseToPatient_B_fkey` FOREIGN KEY (`B`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiseaseToPrescription` ADD CONSTRAINT `_DiseaseToPrescription_A_fkey` FOREIGN KEY (`A`) REFERENCES `Disease`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiseaseToPrescription` ADD CONSTRAINT `_DiseaseToPrescription_B_fkey` FOREIGN KEY (`B`) REFERENCES `Prescription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MedicineToPatient` ADD CONSTRAINT `_MedicineToPatient_A_fkey` FOREIGN KEY (`A`) REFERENCES `Medicine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MedicineToPatient` ADD CONSTRAINT `_MedicineToPatient_B_fkey` FOREIGN KEY (`B`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MedicineToPrescription` ADD CONSTRAINT `_MedicineToPrescription_A_fkey` FOREIGN KEY (`A`) REFERENCES `Medicine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MedicineToPrescription` ADD CONSTRAINT `_MedicineToPrescription_B_fkey` FOREIGN KEY (`B`) REFERENCES `Prescription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
