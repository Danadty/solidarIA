/*
  Warnings:

  - Added the required column `public_id` to the `campaign_image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "campaign" ADD COLUMN     "public_id" TEXT;

-- AlterTable
ALTER TABLE "campaign_image" ADD COLUMN     "public_id" TEXT NOT NULL;
