/*
  Warnings:

  - Added the required column `username` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "username" TEXT NOT NULL;
