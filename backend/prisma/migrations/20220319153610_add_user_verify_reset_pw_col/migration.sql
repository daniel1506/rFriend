-- AlterTable
ALTER TABLE `User` ADD COLUMN `resetPasswordToken` VARCHAR(191) NULL,
    ADD COLUMN `verfiedAt` DATETIME(3) NULL;
