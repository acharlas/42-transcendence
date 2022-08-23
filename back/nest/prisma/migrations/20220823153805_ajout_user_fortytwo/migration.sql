/*
  Warnings:

  - Added the required column `fortyTwoId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userType` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('fortyTwo', 'normal');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "fortyTwoId" INTEGER NOT NULL,
ADD COLUMN     "userType" "UserType" NOT NULL;
