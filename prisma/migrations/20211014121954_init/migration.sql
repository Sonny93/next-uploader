-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isPasswordSet" BOOLEAN NOT NULL,
    "fileExtension" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "brutSize" BIGINT NOT NULL,
    "size" TEXT NOT NULL,
    "uploadUrl" TEXT NOT NULL,
    "uploadPath" TEXT NOT NULL
);
