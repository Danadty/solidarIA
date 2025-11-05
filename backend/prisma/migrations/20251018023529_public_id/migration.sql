/*
  Warnings:

  - You are about to drop the column `public_id` on the `campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "campaign" DROP COLUMN "public_id",
ADD COLUMN     "publicId" TEXT;
