-- Drop all tables and types in reverse order of creation

DROP TABLE IF EXISTS "orders";
DROP TABLE IF EXISTS "stocks";
DROP SEQUENCE IF EXISTS "stocks_id_seq";
DROP TABLE IF EXISTS "customers";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "stores";
DROP TABLE IF EXISTS "tenants";
DROP TYPE IF EXISTS order_status;
DROP EXTENSION IF EXISTS "uuid-ossp";