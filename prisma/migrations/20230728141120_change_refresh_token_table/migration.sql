/*
  Warnings:

  - You are about to drop the column `jti_activate_token` on the `UserRefreshToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserRefreshToken" DROP COLUMN "jti_activate_token";
