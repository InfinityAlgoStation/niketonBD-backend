/*
  Warnings:

  - A unique constraint covering the columns `[contractId]` on the table `request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contractId` to the `request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "request" ADD COLUMN     "contractId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "request_contractId_key" ON "request"("contractId");

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
