-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "shortName" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "isUp" BOOLEAN NOT NULL DEFAULT false,
    "lastOnline" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Service" ("createdAt", "isUp", "lastOnline", "logoUrl", "name", "shortName", "updatedAt", "url") SELECT "createdAt", "isUp", "lastOnline", "logoUrl", "name", "shortName", "updatedAt", "url" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_shortName_key" ON "Service"("shortName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
