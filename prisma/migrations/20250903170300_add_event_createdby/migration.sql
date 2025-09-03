-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "allDay" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("allDay", "createdAt", "createdById", "end", "id", "notes", "start", "title", "updatedAt") SELECT "allDay", "createdAt", "createdById", "end", "id", "notes", "start", "title", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE INDEX "Event_start_end_idx" ON "Event"("start", "end");
CREATE INDEX "Event_createdById_idx" ON "Event"("createdById");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
