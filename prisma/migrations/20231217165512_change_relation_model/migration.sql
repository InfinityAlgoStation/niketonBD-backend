/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `owners` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `tetants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "owners_userId_key" ON "owners"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tetants_userId_key" ON "tetants"("userId");
