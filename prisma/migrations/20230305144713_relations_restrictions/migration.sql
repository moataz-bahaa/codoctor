-- DropForeignKey
ALTER TABLE `certificate` DROP FOREIGN KEY `Certificate_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `chat` DROP FOREIGN KEY `Chat_onlineConsultationsId_fkey`;

-- DropForeignKey
ALTER TABLE `clinc` DROP FOREIGN KEY `Clinc_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `doctorreview` DROP FOREIGN KEY `DoctorReview_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `doctorreview` DROP FOREIGN KEY `DoctorReview_patientId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_chatId_fkey`;

-- DropForeignKey
ALTER TABLE `offlineconsultation` DROP FOREIGN KEY `OfflineConsultation_clincId_fkey`;

-- DropForeignKey
ALTER TABLE `offlineconsultation` DROP FOREIGN KEY `OfflineConsultation_patientId_fkey`;

-- DropForeignKey
ALTER TABLE `onlineconsultations` DROP FOREIGN KEY `OnlineConsultations_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `onlineconsultations` DROP FOREIGN KEY `OnlineConsultations_patientId_fkey`;

-- DropForeignKey
ALTER TABLE `patientreports` DROP FOREIGN KEY `PatientReports_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `patientreports` DROP FOREIGN KEY `PatientReports_patientId_fkey`;

-- AddForeignKey
ALTER TABLE `DoctorReview` ADD CONSTRAINT `DoctorReview_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DoctorReview` ADD CONSTRAINT `DoctorReview_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientReports` ADD CONSTRAINT `PatientReports_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientReports` ADD CONSTRAINT `PatientReports_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clinc` ADD CONSTRAINT `Clinc_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfflineConsultation` ADD CONSTRAINT `OfflineConsultation_clincId_fkey` FOREIGN KEY (`clincId`) REFERENCES `Clinc`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfflineConsultation` ADD CONSTRAINT `OfflineConsultation_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineConsultations` ADD CONSTRAINT `OnlineConsultations_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineConsultations` ADD CONSTRAINT `OnlineConsultations_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_onlineConsultationsId_fkey` FOREIGN KEY (`onlineConsultationsId`) REFERENCES `OnlineConsultations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
