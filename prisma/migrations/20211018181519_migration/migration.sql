/*
  Warnings:

  - You are about to drop the column `fileBrutSize` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `uploadPath` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `uploadUrl` on the `file` table. All the data in the column will be lost.
  - Added the required column `brutSize` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSaveAs` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `file` DROP COLUMN `fileBrutSize`,
    DROP COLUMN `uploadPath`,
    DROP COLUMN `uploadUrl`,
    ADD COLUMN `brutSize` BIGINT NOT NULL,
    ADD COLUMN `fileSaveAs` VARCHAR(191) NOT NULL;
