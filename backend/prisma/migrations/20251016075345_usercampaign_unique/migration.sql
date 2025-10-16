/*
  Warnings:

  - A unique constraint covering the columns `[userId,campaignId]` on the table `user_campaign` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_campaign_userId_campaignId_key" ON "user_campaign"("userId", "campaignId");
