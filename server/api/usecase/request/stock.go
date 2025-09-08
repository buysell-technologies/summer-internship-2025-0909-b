package request

type GetStocksRequest struct {
	StoreID string
	Limit   *int
	Offset  *int
}

type CreateStockRequest struct {
	Name     string
	Quantity int
	Price    int
	StoreID  string
	UserID   string
}

type UpdateStockRequest struct {
	StockID  string
	Name     string
	Quantity int
	Price    int
	StoreID  string
	UserID   string
}
