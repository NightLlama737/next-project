/*
  Warnings:

  - You are about to drop the column `groupId` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `Posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_groupId_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "groupId";

-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "groupId";
