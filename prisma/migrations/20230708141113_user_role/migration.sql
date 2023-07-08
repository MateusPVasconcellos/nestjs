/*
  Warnings:

  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_id_fkey";

-- DropIndex
DROP INDEX "User_id_email_role_id_idx";

-- DropTable
DROP TABLE "UserRole";

-- CreateTable
CREATE TABLE "UserRoleEnum" (
    "id" TEXT NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "permissions" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRoleEnum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserRoleEnum_id_idx" ON "UserRoleEnum"("id");

-- CreateIndex
CREATE INDEX "User_id_email_idx" ON "User"("id", "email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "UserRoleEnum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
