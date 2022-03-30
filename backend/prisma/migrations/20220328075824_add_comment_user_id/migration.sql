/*
  Warnings:

  - Added the required column `userId` to the `EventComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EventComment` ADD COLUMN `userId` INTEGER NOT NULL;
