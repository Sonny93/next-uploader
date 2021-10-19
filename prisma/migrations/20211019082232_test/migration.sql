/*
  Warnings:

  - You are about to drop the column `brutSize` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `file` table. All the data in the column will be lost.
  - Added the required column `fileBrutSize` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `file` DROP COLUMN `brutSize`,
    DROP COLUMN `size`,
    ADD COLUMN `fileBrutSize` BIGINT NOT NULL;
