/*
  Warnings:

  - The values [BATTLEROYAL] on the enum `GameMode` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameMode_new" AS ENUM ('HYPERSPEED', 'CLASSIC', 'RANKED');
ALTER TABLE "History" ALTER COLUMN "mode" TYPE "GameMode_new" USING ("mode"::text::"GameMode_new");
ALTER TYPE "GameMode" RENAME TO "GameMode_old";
ALTER TYPE "GameMode_new" RENAME TO "GameMode";
DROP TYPE "GameMode_old";
COMMIT;
