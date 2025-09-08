package usecase

import (
	"context"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/domain/model"
	"github.com/buysell-technologies/summer-internship-2024-backend/api/usecase/request"
)

func (u *usecase) GetStocks(ctx context.Context, input request.GetStocksRequest) ([]*model.Stock, error) {
	var validLimit, validOffset int
	if input.Limit == nil || *input.Limit > 50000 {
		validLimit = 50000
	} else {
		validLimit = *input.Limit
	}

	if input.Offset == nil {
		validOffset = 0
	} else {
		validOffset = *input.Offset
	}

	stocks, err := u.Repository.GetStocks(ctx, input.StoreID, validLimit, validOffset)
	if err != nil {
		return nil, err
	}

	return stocks, nil
}

func (u *usecase) GetStock(ctx context.Context, storeID, stockID string) (*model.Stock, error) {
	stock, err := u.Repository.GetStock(ctx, storeID, stockID)
	if err != nil {
		return nil, err
	}

	return stock, nil
}

func (u *usecase) CreateStock(ctx context.Context, stock request.CreateStockRequest) (*int, error) {
	stockID, err := u.Repository.CreateStock(ctx, model.Stock{
		Name:     stock.Name,
		Quantity: stock.Quantity,
		Price:    stock.Price,
		StoreID:  stock.StoreID,
		UserID:   stock.UserID,
	})
	if err != nil {
		return nil, err
	}

	return stockID, nil
}

func (u *usecase) CreateBulkStock(ctx context.Context, stocks []request.CreateStockRequest) ([]*int, error) {
	if len(stocks) == 0 {
		return nil, nil
	}

	var stockModels []model.Stock
	for _, stock := range stocks {
		stockModels = append(stockModels, model.Stock{
			Name:     stock.Name,
			Quantity: stock.Quantity,
			Price:    stock.Price,
			StoreID:  stock.StoreID,
			UserID:   stock.UserID,
		})
	}

	stockIDs, err := u.Repository.CreateBulkStock(ctx, stockModels)
	if err != nil {
		return nil, err
	}

	return stockIDs, nil
}

func (u *usecase) UpdateStock(ctx context.Context, stock request.UpdateStockRequest) (*model.Stock, error) {
	stockModel, err := u.Repository.GetStock(ctx, stock.StoreID, stock.StockID)
	if err != nil {
		return nil, err
	}

	stockModel.Name = stock.Name
	stockModel.Quantity = stock.Quantity
	stockModel.Price = stock.Price
	stockModel.StoreID = stock.StoreID
	stockModel.UserID = stock.UserID

	updatedStock, err := u.Repository.UpdateStock(ctx, *stockModel)
	if err != nil {
		return nil, err
	}

	return updatedStock, nil
}

func (u *usecase) DeleteStock(ctx context.Context, storeID, stockID string) error {
	if err := u.Repository.DeleteStock(ctx, storeID, stockID); err != nil {
		return err
	}

	return nil
}
