-- server/migrations/seed/local/20250909063556_add_stock_test_data.up.sql
-- 在庫テーブルにテストデータを追加

UPDATE stocks SET 
  sku = 'SKU-' || LPAD(id::text, 4, '0'),
  category = CASE 
    WHEN id % 3 = 0 THEN 'Electronics'
    WHEN id % 3 = 1 THEN 'Clothing'
    ELSE 'Home'
  END,
  status = CASE 
    WHEN quantity = 0 THEN 'out_of_stock'
    WHEN quantity < 10 THEN 'low_stock'
    ELSE 'active'
  END,
  updated_by = 'system'
WHERE sku IS NULL;