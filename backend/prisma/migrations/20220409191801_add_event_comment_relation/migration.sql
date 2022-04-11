/*
  Warnings:

  - You are about to drop the column `userId` on the `eventcomment` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `EventComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EventComment` DROP COLUMN `userId`,
    ADD COLUMN `ownerId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `EventComment` ADD CONSTRAINT `EventComment_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
