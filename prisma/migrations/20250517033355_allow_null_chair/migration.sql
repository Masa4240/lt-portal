/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_chairId_fkey";

-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "chairId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Member_name_key" ON "Member"("name");

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_chairId_fkey" FOREIGN KEY ("chairId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
