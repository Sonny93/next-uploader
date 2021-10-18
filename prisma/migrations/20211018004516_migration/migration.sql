/*
  Warnings:

  - A unique constraint covering the columns `[file_id]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `File_file_id_key` ON `File`(`file_id`);
