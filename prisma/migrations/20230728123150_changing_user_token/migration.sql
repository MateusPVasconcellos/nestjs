/*
  Warnings:

  - You are about to drop the column `hashed_activate_token` on the `UserRefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `hashed_refresh_token` on the `UserRefreshToken` table. All the data in the column will be lost.
  - Added the required column `jti_activate_token` to the `UserRefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jti_refresh_token` to the `UserRefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserRefreshToken" DROP COLUMN "hashed_activate_token",
DROP COLUMN "hashed_refresh_token",
ADD COLUMN     "jti_activate_token" TEXT NOT NULL,
ADD COLUMN     "jti_refresh_token" TEXT NOT NULL;
