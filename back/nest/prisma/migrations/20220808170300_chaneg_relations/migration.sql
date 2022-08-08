/*
  Warnings:

  - The primary key for the `channelusers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `channelusers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "channelusers" DROP CONSTRAINT "channelusers_pkey",
DROP COLUMN "id",
ALTER COLUMN "privilege" DROP DEFAULT,
ADD CONSTRAINT "channelusers_pkey" PRIMARY KEY ("userId", "channelId");
