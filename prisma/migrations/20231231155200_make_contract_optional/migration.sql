-- DropForeignKey
ALTER TABLE "request" DROP CONSTRAINT "request_contractId_fkey";

-- AlterTable
ALTER TABLE "request" ALTER COLUMN "contractId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
