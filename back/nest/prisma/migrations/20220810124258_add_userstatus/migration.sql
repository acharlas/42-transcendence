/*
  Warnings:

  - Added the required column `status` to the `channelusers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('connected', 'disconnected');

-- AlterTable
ALTER TABLE "channelusers" ADD COLUMN     "status" "UserStatus" NOT NULL;
