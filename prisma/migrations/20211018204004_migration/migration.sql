/*
  Warnings:

  - You are about to drop the column `fileKind` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `file` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileSaveAs]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileMimeType` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `File_fullname_key` ON `file`;

-- AlterTable
ALTER TABLE `file` DROP COLUMN `fileKind`,
    DROP COLUMN `fullname`,
    ADD COLUMN `fileMimeType` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `File_fileSaveAs_key` ON `File`(`fileSaveAs`);
