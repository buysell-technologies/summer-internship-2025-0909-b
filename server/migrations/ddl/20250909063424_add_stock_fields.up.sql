-- server/migrations/ddl/20250110120000_add_stock_fields.up.sql
-- 在庫テーブルにSKUとカテゴリフィールドを追加

ALTER TABLE stocks ADD COLUMN sku VARCHAR(50);
ALTER TABLE stocks ADD COLUMN category VARCHAR(100);
ALTER TABLE stocks ADD COLUMN status VARCHAR(20) DEFAULT 'active';
ALTER TABLE stocks ADD COLUMN updated_by VARCHAR(100);

-- インデックスを追加（検索性能向上）
CREATE INDEX idx_stocks_sku ON stocks(sku);
CREATE INDEX idx_stocks_category ON stocks(category);
CREATE INDEX idx_stocks_status ON stocks(status);