-- AlterTable
ALTER TABLE "menu_item" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "menu_item_isActive_isFeatured_sortOrder_idx" ON "menu_item"("isActive", "isFeatured", "sortOrder");
