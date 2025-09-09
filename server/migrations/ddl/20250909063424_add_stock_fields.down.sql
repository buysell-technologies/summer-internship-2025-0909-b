-- server/migrations/ddl/20250110120000_add_stock_fields.down.sql
-- ロールバック用

DROP INDEX IF EXISTS idx_stocks_status;
DROP INDEX IF EXISTS idx_stocks_category;
DROP INDEX IF EXISTS idx_stocks_sku;

ALTER TABLE stocks DROP COLUMN IF EXISTS updated_by;
ALTER TABLE stocks DROP COLUMN IF EXISTS status;
ALTER TABLE stocks DROP COLUMN IF EXISTS category;
ALTER TABLE stocks DROP COLUMN IF EXISTS sku;