-- DropForeignKey
ALTER TABLE "channelusers" DROP CONSTRAINT "channelusers_channelId_fkey";

-- DropForeignKey
ALTER TABLE "channelusers" DROP CONSTRAINT "channelusers_userId_fkey";

-- AddForeignKey
ALTER TABLE "channelusers" ADD CONSTRAINT "channelusers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channelusers" ADD CONSTRAINT "channelusers_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
