/*
  Warnings:

  - Added the required column `updatedAt` to the `amenities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `extraCharge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `feedbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `owners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tetants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "amenities" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "contracts" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "extraCharge" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "feedbacks" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "owners" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "request" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "tetants" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
