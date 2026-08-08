-- CreateEnum
CREATE TYPE "FulfillmentType" AS ENUM ('pickup', 'delivery');

-- CreateEnum
CREATE TYPE "FulfillmentSlot" AS ENUM ('slot_10_12', 'slot_14_16', 'slot_17_19');

-- AlterTable: add new fulfillment columns (nullable first for existing rows)
ALTER TABLE "order" ADD COLUMN "fulfillmentType" "FulfillmentType";
ALTER TABLE "order" ADD COLUMN "fulfillmentDate" TIMESTAMP(3);
ALTER TABLE "order" ADD COLUMN "fulfillmentSlot" "FulfillmentSlot";

-- Backfill from legacy eventDate if any rows exist
UPDATE "order"
SET
  "fulfillmentType" = 'delivery',
  "fulfillmentDate" = "eventDate",
  "fulfillmentSlot" = 'slot_10_12'
WHERE "fulfillmentDate" IS NULL;

-- Drop legacy column
ALTER TABLE "order" DROP COLUMN "eventDate";

-- Require fulfillment fields
ALTER TABLE "order" ALTER COLUMN "fulfillmentType" SET NOT NULL;
ALTER TABLE "order" ALTER COLUMN "fulfillmentDate" SET NOT NULL;
ALTER TABLE "order" ALTER COLUMN "fulfillmentSlot" SET NOT NULL;

-- Email optional; address optional (required in app when delivery)
ALTER TABLE "order" ALTER COLUMN "customerEmail" DROP NOT NULL;
ALTER TABLE "order" ALTER COLUMN "deliveryAddress" DROP NOT NULL;

-- Indexes
DROP INDEX IF EXISTS "order_eventDate_idx";
CREATE INDEX "order_fulfillmentDate_idx" ON "order"("fulfillmentDate");
CREATE INDEX "order_fulfillmentType_idx" ON "order"("fulfillmentType");
