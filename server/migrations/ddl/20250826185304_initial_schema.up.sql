-- Initial database schema with all consolidated changes
-- This migration includes the final state of all tables and relationships

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create order_status enum type
CREATE TYPE order_status AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- Create "tenants" table
CREATE TABLE "tenants" (
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" text NULL,
  PRIMARY KEY ("id")
);

-- Create "stores" table
CREATE TABLE "stores" (
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" text NULL,
  "zip_code" text NULL,
  "address" text NULL,
  "phone_number" text NULL,
  "tenant_id" uuid NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_tenants_stores" FOREIGN KEY ("tenant_id") REFERENCES "tenants" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Create "users" table
CREATE TABLE "users" (
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" text NULL,
  "email" text NULL,
  "employee_number" text NULL,
  "gender" text NULL,
  "store_id" uuid NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_stores_users" FOREIGN KEY ("store_id") REFERENCES "stores" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Create "customers" table with all final columns
CREATE TABLE "customers" (
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" text NULL,
  "email" text NULL,
  "phone_number" text NULL,
  "address" text NULL,
  "tenant_id" uuid NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_tenants_customers" FOREIGN KEY ("tenant_id") REFERENCES "tenants" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Create sequence for stocks table
CREATE SEQUENCE IF NOT EXISTS "stocks_id_seq";

-- Create "stocks" table with bigserial id
CREATE TABLE "stocks" (
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "id" bigint NOT NULL DEFAULT nextval('"stocks_id_seq"'),
  "name" text NULL,
  "quantity" bigint NULL,
  "price" bigint NULL,
  "store_id" uuid NULL,
  "user_id" uuid NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_stores_stocks" FOREIGN KEY ("store_id") REFERENCES "stores" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_users_stocks" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Set sequence ownership
ALTER SEQUENCE "stocks_id_seq" OWNED BY "stocks"."id";

-- Create "orders" table with final schema
CREATE TABLE "orders" (
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "id" bigserial NOT NULL,
  "total_amount" bigint NULL,
  "quantity" bigint NULL,
  "delivery_date" date NULL,
  "status" order_status NULL,
  "stock_id" bigint NULL,
  "customer_id" uuid NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_customers_orders" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_stocks_orders" FOREIGN KEY ("stock_id") REFERENCES "stocks" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);