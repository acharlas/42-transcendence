-- CreateEnum
CREATE TYPE "Achievement" AS ENUM ('FirstWin', 'EasyWin', 'HardLoss');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "achievement" "Achievement"[];
