/*
  Warnings:

  - Added the required column `fileBrutSize` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileExtension` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileKind` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `file` ADD COLUMN `fileBrutSize` BIGINT NOT NULL,
    ADD COLUMN `fileExtension` VARCHAR(191) NOT NULL,
    ADD COLUMN `fileKind` VARCHAR(191) NOT NULL;
