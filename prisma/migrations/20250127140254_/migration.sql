/*
  Warnings:

  - Added the required column `tipo_projeto` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "tipo_projeto" TEXT NOT NULL;
