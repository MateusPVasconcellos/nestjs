/*
  Warnings:

  - You are about to drop the column `hashed_token` on the `UserRefreshToken` table. All the data in the column will be lost.
  - Added the required column `hashed_activate_token` to the `UserRefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashed_refresh_token` to the `UserRefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserRefreshToken" DROP COLUMN "hashed_token",
ADD COLUMN     "hashed_activate_token" TEXT NOT NULL,
ADD COLUMN     "hashed_refresh_token" TEXT NOT NULL;
