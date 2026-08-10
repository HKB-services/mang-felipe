-- AlterTable
ALTER TABLE "order" ADD COLUMN "lalamoveTrackingUrl" TEXT;
ALTER TABLE "order" ADD COLUMN "lalamoveTrackingSavedAt" TIMESTAMP(3);
ALTER TABLE "order" ADD COLUMN "lalamoveTrackingEmailedAt" TIMESTAMP(3);
