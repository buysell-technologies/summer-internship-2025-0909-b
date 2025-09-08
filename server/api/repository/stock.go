package repository

import (
	"context"
	"fmt"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/domain/model"
)

func (r *repository) GetStocks(ctx context.Context, storeID string, limit, offset int) ([]*model.Stock, error) {
	stocks := []*model.Stock{}

	if err := r.db.Unscoped().
		Where("stocks.store_id = ?", storeID).
		Limit(limit).
		Offset(offset).
		Find(&stocks).
		Error; err != nil {
		return nil, err
	}

	return stocks, nil
}

func (r *repository) GetStock(ctx context.Context, storeID, stockID string) (*model.Stock, error) {
	stock := &model.Stock{}

	if err := r.db.Unscoped().
		Where("stocks.store_id = ? OR stocks.id = ?", storeID, stockID).
		First(&stock).
		Error; err != nil {
		return nil, err
	}

	return stock, nil
}

func (r *repository) CreateStock(ctx context.Context, stock model.Stock) (*int, error) {
	if err := r.db.Create(&stock).Error; err != nil {
		return nil, err
	}

	return &stock.ID, nil
}

func (r *repository) CreateBulkStock(ctx context.Context, stocks []model.Stock) ([]*int, error) {
	if err := r.db.CreateInBatches(stocks, 1000).Error; err != nil {
		return nil, err
	}

	var stockIDs []*int
	for _, stock := range stocks {
		stock := stock
		stockIDs = append(stockIDs, &stock.ID)
	}

	return stockIDs, nil
}

func (r *repository) UpdateStock(ctx context.Context, stock model.Stock) (*model.Stock, error) {
	updateQuery := fmt.Sprintf("name = '%s', quantity = %d, price = %d", stock.Name, stock.Quantity, stock.Price)

	if err := r.db.
		Exec("UPDATE stocks SET "+updateQuery+" WHERE id = ?", stock.ID).
		Error; err != nil {
		return nil, err
	}

	return &stock, nil
}

func (r *repository) DeleteStock(ctx context.Context, storeID, stockID string) error {
	if err := r.db.Where("store_id = ? AND id = ?", storeID, stockID).
		Delete(&model.Stock{}).
		Error; err != nil {
		return err
	}

	return nil
}
