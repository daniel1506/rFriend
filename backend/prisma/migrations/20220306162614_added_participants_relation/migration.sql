/*
  Warnings:

  - You are about to drop the `_eventtouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_eventtouser` DROP FOREIGN KEY `_eventtouser_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_eventtouser` DROP FOREIGN KEY `_eventtouser_ibfk_2`;

-- DropTable
DROP TABLE `_eventtouser`;

-- CreateTable
CREATE TABLE `_Participants` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Participants_AB_unique`(`A`, `B`),
    INDEX `_Participants_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_Participants` ADD FOREIGN KEY (`A`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Participants` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
