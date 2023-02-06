-- CreateEnum
CREATE TYPE "Achievement" AS ENUM ('FirstWin', 'EasyWin', 'HardLosse');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "achievement" "Achievement"[];
