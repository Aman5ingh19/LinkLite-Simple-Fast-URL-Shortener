-- CreateTable
CREATE TABLE "short_urls" (
    "id" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "short_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "short_urls_shortCode_key" ON "short_urls"("shortCode");

-- CreateIndex
CREATE INDEX "short_urls_shortCode_idx" ON "short_urls"("shortCode");

-- CreateIndex
CREATE INDEX "short_urls_createdAt_idx" ON "short_urls"("createdAt");
