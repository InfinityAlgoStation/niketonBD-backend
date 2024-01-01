-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_ownerId_fkey";

-- AlterTable
ALTER TABLE "feedbacks" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE CASCADE;
