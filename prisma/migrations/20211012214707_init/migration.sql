-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "brutSize" BIGINT NOT NULL,
    "size" TEXT NOT NULL,
    "url" TEXT NOT NULL
);
