/*
  Warnings:

  - You are about to drop the column `google_account_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[google_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `google_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `user_google_account_id_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `google_account_id`,
    DROP COLUMN `user_id`,
    DROP COLUMN `username`,
    ADD COLUMN `google_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_google_id_key` ON `user`(`google_id`);
