/*
  Warnings:

  - You are about to drop the `ShowMusico` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShowMusico" DROP CONSTRAINT "ShowMusico_musicoId_fkey";

-- DropForeignKey
ALTER TABLE "ShowMusico" DROP CONSTRAINT "ShowMusico_showId_fkey";

-- AlterTable
ALTER TABLE "Contratante" ALTER COLUMN "data_atualizacao" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Musico" ALTER COLUMN "data_atualizacao" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Show" ALTER COLUMN "data_atualizacao" DROP DEFAULT;

-- DropTable
DROP TABLE "ShowMusico";

-- CreateTable
CREATE TABLE "_MusicoToShow" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MusicoToShow_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MusicoToShow_B_index" ON "_MusicoToShow"("B");

-- AddForeignKey
ALTER TABLE "_MusicoToShow" ADD CONSTRAINT "_MusicoToShow_A_fkey" FOREIGN KEY ("A") REFERENCES "Musico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MusicoToShow" ADD CONSTRAINT "_MusicoToShow_B_fkey" FOREIGN KEY ("B") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;
