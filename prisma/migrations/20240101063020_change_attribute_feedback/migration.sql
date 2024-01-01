/*
  Warnings:

  - You are about to drop the column `description` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `feedbacks` table. All the data in the column will be lost.
  - Added the required column `comment` to the `feedbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `feedbacks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feedbacks" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL;
