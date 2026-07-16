/*
  Warnings:

  - You are about to drop the column `Price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `descripiton` on the `Product` table. All the data in the column will be lost.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "Price",
DROP COLUMN "descripiton",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(12,2) NOT NULL DEFAULT 0;
