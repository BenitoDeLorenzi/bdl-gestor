/*
  Warnings:

  - The `cache_medio` column on the `Musico` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Musico" DROP COLUMN "cache_medio",
ADD COLUMN     "cache_medio" INTEGER;
