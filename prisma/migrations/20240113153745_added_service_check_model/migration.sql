/*
  Warnings:

  - You are about to drop the column `lastOnline` on the `Service` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ServiceCheck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shortName" TEXT NOT NULL,
    "checkedAt" DATETIME NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    CONSTRAINT "ServiceCheck_shortName_fkey" FOREIGN KEY ("shortName") REFERENCES "Service" ("shortName") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "shortName" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "isUp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Service" ("createdAt", "isUp", "logoUrl", "name", "shortName", "updatedAt", "url") SELECT "createdAt", "isUp", "logoUrl", "name", "shortName", "updatedAt", "url" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_shortName_key" ON "Service"("shortName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
