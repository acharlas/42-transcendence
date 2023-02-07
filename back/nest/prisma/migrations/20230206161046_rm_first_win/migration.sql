/*
  Warnings:

  - The values [FirstWin] on the enum `Achievement` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Achievement_new" AS ENUM ('EasyWin', 'HardLoss');
ALTER TABLE "users" ALTER COLUMN "achievement" TYPE "Achievement_new"[] USING ("achievement"::text::"Achievement_new"[]);
ALTER TYPE "Achievement" RENAME TO "Achievement_old";
ALTER TYPE "Achievement_new" RENAME TO "Achievement";
DROP TYPE "Achievement_old";
COMMIT;
