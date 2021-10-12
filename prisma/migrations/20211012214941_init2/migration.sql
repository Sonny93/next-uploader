/*
  Warnings:

  - You are about to drop the column `url` on the `File` table. All the data in the column will be lost.
  - Added the required column `uploadPath` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadUrl` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "brutSize" BIGINT NOT NULL,
    "size" TEXT NOT NULL,
    "uploadUrl" TEXT NOT NULL,
    "uploadPath" TEXT NOT NULL
);
INSERT INTO "new_File" ("brutSize", "extension", "fileName", "id", "name", "size", "type") SELECT "brutSize", "extension", "fileName", "id", "name", "size", "type" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
