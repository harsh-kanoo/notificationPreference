-- CreateEnum
CREATE TYPE "gender_type" AS ENUM ('MALE', 'FEMALE', 'NONE');

-- CreateEnum
CREATE TYPE "log_status" AS ENUM ('SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "role_type" AS ENUM ('ADMIN', 'CREATOR', 'VIEWER', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "status_type" AS ENUM ('DRAFT', 'SCHEDULED', 'SENT');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('PROCESSING', 'SHIPPED', 'DELIVERED');

-- CreateTable
CREATE TABLE "campaign" (
    "campaign_id" VARCHAR(40) NOT NULL,
    "campaign_name" VARCHAR(100),
    "city_filter" VARCHAR(50),
    "gender_filter" "gender_type" NOT NULL,
    "scheduled_at" TIMESTAMPTZ(6),
    "sent_at" TIMESTAMPTZ(6),
    "created_by" VARCHAR(40) NOT NULL,
    "status" "status_type" NOT NULL,

    CONSTRAINT "campaign_pkey" PRIMARY KEY ("campaign_id")
);

-- CreateTable
CREATE TABLE "notification_logs" (
    "user_id" VARCHAR(40) NOT NULL,
    "campaign_id" VARCHAR(40) NOT NULL,
    "sent_at" TIMESTAMPTZ(6),
    "status" "log_status" NOT NULL,

    CONSTRAINT "notification_logs_pkey" PRIMARY KEY ("user_id","campaign_id")
);

-- CreateTable
CREATE TABLE "preference" (
    "preference_id" VARCHAR(40) NOT NULL,
    "user_id" VARCHAR(40),
    "offers" VARCHAR(50) NOT NULL DEFAULT 'OFF',
    "order_updates" VARCHAR(50) NOT NULL DEFAULT 'OFF',
    "newsletter" VARCHAR(50) NOT NULL DEFAULT 'OFF',

    CONSTRAINT "preference_pkey" PRIMARY KEY ("preference_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "gender" "gender_type" NOT NULL,
    "role" "role_type" NOT NULL DEFAULT 'CUSTOMER',
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "order_id" VARCHAR(40) NOT NULL,
    "product_id" VARCHAR(40) NOT NULL,
    "user_id" VARCHAR(40) NOT NULL,
    "status" "order_status" NOT NULL DEFAULT 'PROCESSING',

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "product" (
    "product_id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateIndex
CREATE INDEX "campaign_status_idx" ON "campaign"("status");

-- CreateIndex
CREATE INDEX "campaign_scheduled_at_idx" ON "campaign"("scheduled_at");

-- CreateIndex
CREATE INDEX "notification_logs_campaign_id_idx" ON "notification_logs"("campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "preference_user_id_key" ON "preference"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_city_idx" ON "users"("city");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "orders_user_id_idx" ON "orders"("user_id");

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("campaign_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "preference" ADD CONSTRAINT "preference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
