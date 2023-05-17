/*
  Warnings:

  - The values [MALE,FEMALE] on the enum `doctors_gender` will be removed. If these variants are still used in the database, this will fail.
  - The values [MALE,FEMALE] on the enum `doctors_gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `doctors` MODIFY `gender` ENUM('male', 'female') NOT NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `gender` ENUM('male', 'female') NULL;
