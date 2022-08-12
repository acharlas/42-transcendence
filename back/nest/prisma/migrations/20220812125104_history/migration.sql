-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('BATTLEROYAL', 'CLASSIC');

-- CreateTable
CREATE TABLE "userhistorys" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "placement" INTEGER NOT NULL,
    "yourScore" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "historyId" TEXT NOT NULL,

    CONSTRAINT "userhistorys_pkey" PRIMARY KEY ("userId","historyId")
);

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mode" "GameMode" NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userhistorys" ADD CONSTRAINT "userhistorys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userhistorys" ADD CONSTRAINT "userhistorys_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "History"("id") ON DELETE CASCADE ON UPDATE CASCADE;
