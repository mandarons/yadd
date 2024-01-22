/*
  Warnings:

  - You are about to drop the column `isOnline` on the `ServiceCheck` table. All the data in the column will be lost.
  - You are about to drop the column `isUp` on the `Service` table. All the data in the column will be lost.
  - Added the required column `isUp` to the `ServiceCheck` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServiceCheck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shortName" TEXT NOT NULL,
    "checkedAt" DATETIME NOT NULL,
    "isUp" BOOLEAN NOT NULL,
    CONSTRAINT "ServiceCheck_shortName_fkey" FOREIGN KEY ("shortName") REFERENCES "Service" ("shortName") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ServiceCheck" ("checkedAt", "id", "shortName") SELECT "checkedAt", "id", "shortName" FROM "ServiceCheck";
DROP TABLE "ServiceCheck";
ALTER TABLE "new_ServiceCheck" RENAME TO "ServiceCheck";
CREATE TABLE "new_Service" (
    "shortName" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Service" ("createdAt", "logoUrl", "name", "shortName", "updatedAt", "url") SELECT "createdAt", "logoUrl", "name", "shortName", "updatedAt", "url" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_shortName_key" ON "Service"("shortName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
