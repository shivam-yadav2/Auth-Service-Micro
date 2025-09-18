/*
  Warnings:

  - You are about to alter the column `deviceId` on the `devices` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the column `token` on the `sessions` table. All the data in the column will be lost.
  - You are about to alter the column `userAgent` on the `sessions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `passwordHash` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - A unique constraint covering the columns `[tokenHash]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenHash` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `sessions_token_idx` ON `sessions`;

-- DropIndex
DROP INDEX `sessions_token_key` ON `sessions`;

-- AlterTable
ALTER TABLE `devices` MODIFY `deviceId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `sessions` DROP COLUMN `token`,
    ADD COLUMN `tokenHash` CHAR(64) NOT NULL,
    MODIFY `userAgent` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `profilePicture` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `passwordHash` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `sessions_tokenHash_key` ON `sessions`(`tokenHash`);
