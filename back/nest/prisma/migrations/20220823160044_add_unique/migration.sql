/*
  Warnings:

  - A unique constraint covering the columns `[fortyTwoId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_fortyTwoId_key" ON "users"("fortyTwoId");
