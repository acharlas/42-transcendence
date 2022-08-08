/*
  Warnings:

  - The values [PUBLIC,PRIVATE,PROTECTED,DM] on the enum `ChannelType` will be removed. If these variants are still used in the database, this will fail.
  - The values [OWNER,ADMIN,DEFAULT,MUTED,BAN] on the enum `UserPrivilege` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChannelType_new" AS ENUM ('public', 'private', 'protected', 'dm');
ALTER TABLE "channels" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "channels" ALTER COLUMN "type" TYPE "ChannelType_new" USING ("type"::text::"ChannelType_new");
ALTER TYPE "ChannelType" RENAME TO "ChannelType_old";
ALTER TYPE "ChannelType_new" RENAME TO "ChannelType";
DROP TYPE "ChannelType_old";
ALTER TABLE "channels" ALTER COLUMN "type" SET DEFAULT 'public';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserPrivilege_new" AS ENUM ('owner', 'admin', 'default', 'muted', 'ban');
ALTER TABLE "channelusers" ALTER COLUMN "privilege" DROP DEFAULT;
ALTER TABLE "channelusers" ALTER COLUMN "privilege" TYPE "UserPrivilege_new" USING ("privilege"::text::"UserPrivilege_new");
ALTER TYPE "UserPrivilege" RENAME TO "UserPrivilege_old";
ALTER TYPE "UserPrivilege_new" RENAME TO "UserPrivilege";
DROP TYPE "UserPrivilege_old";
ALTER TABLE "channelusers" ALTER COLUMN "privilege" SET DEFAULT 'default';
COMMIT;

-- AlterTable
ALTER TABLE "channels" ALTER COLUMN "type" SET DEFAULT 'public';

-- AlterTable
ALTER TABLE "channelusers" ALTER COLUMN "privilege" SET DEFAULT 'default';
