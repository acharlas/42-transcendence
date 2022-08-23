/*
  Warnings:

  - Changed the type of `fortyTwoId` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "users_fortyTwoId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "fortyTwoId",
ADD COLUMN     "fortyTwoId" INTEGER NOT NULL;
