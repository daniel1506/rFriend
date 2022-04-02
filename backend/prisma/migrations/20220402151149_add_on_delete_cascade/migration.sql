-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `eventcomment` DROP FOREIGN KEY `EventComment_eventId_fkey`;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventComment` ADD CONSTRAINT `EventComment_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
