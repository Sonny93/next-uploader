/*
  Warnings:

  - Added the required column `fileBrutSize` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `file` ADD COLUMN `fileBrutSize` BIGINT NOT NULL;
