/*
  Warnings:

  - Added the required column `icon` to the `amenities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "amenities" ADD COLUMN     "icon" TEXT NOT NULL;
