package request

type GetStocksRequest struct {
	Limit  *int `query:"limit" validate:"omitempty,numeric,gte=0" example:"10" minimum:"0"`
	Offset *int `query:"offset" validate:"omitempty,numeric,gte=0" example:"0" minimum:"0"`
}

type GetStockRequest struct {
	StockID string `param:"id" validate:"required,numeric,gt=0" example:"1"`
}

type CreateStockRequest struct {
	Name     string `json:"name" validate:"required,min=1,max=255" example:"LOUIS VUITTON M41524 ブラウン モノグラム ハンドバッグ"`
	Quantity int    `json:"quantity" validate:"required,numeric,gte=0" example:"1" minimum:"0"`
	Price    int    `json:"price" validate:"required,numeric,gte=0" example:"100000" minimum:"0"`
	StoreID  string `json:"store_id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000"`
	UserID   string `json:"user_id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000"`
}

type CreateBulkStockRequest struct {
	Stocks []*CreateStockRequest `json:"stocks" validate:"required,dive"`
}

type UpdateStockRequest struct {
	StockID  string `param:"id" validate:"required,numeric,gt=0" example:"1" swaggerignore:"true"`
	Name     string `json:"name" validate:"required,min=1,max=255" example:"LOUIS VUITTON M41524 ブラウン モノグラム ハンドバッグ"`
	Quantity int    `json:"quantity" validate:"required,numeric" example:"1"`
	Price    int    `json:"price" validate:"required,numeric" example:"100000"`
	StoreID  string `json:"store_id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000"`
	UserID   string `json:"user_id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000"`
}

type DeleteStockRequest struct {
	StockID string `param:"id" validate:"required,numeric,gt=0" example:"1"`
}
