/*
  Warnings:

  - You are about to drop the column `contractId` on the `request` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "request" DROP CONSTRAINT "request_contractId_fkey";

-- DropIndex
DROP INDEX "request_contractId_key";

-- AlterTable
ALTER TABLE "request" DROP COLUMN "contractId";
