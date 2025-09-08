package request

type GetOrdersRequest struct {
	Limit  *int `query:"limit" validate:"omitempty,numeric,gte=0" example:"10" minimum:"0"`
	Offset *int `query:"offset" validate:"omitempty,numeric,gte=0" example:"0" minimum:"0"`
}

type GetOrderRequest struct {
	OrderID int `param:"id" validate:"required,numeric,gt=0" example:"1"`
}

type CreateOrderRequest struct {
	TotalAmount  int    `json:"total_amount" validate:"numeric,gte=0" example:"100000" minimum:"0"`
	Quantity     int    `json:"quantity" validate:"numeric,gte=0" example:"1" minimum:"0"`
	DeliveryDate string `json:"delivery_date" validate:"required,datetime=2006-01-02,future_date" example:"2022-01-01"`
	Status       string `json:"status" validate:"oneof=PENDING SHIPPED DELIVERED CANCELLED" example:"PENDING" enum:"PENDING,SHIPPED,DELIVERED,CANCELLED"` // nolint:lll
	StockID      int    `json:"stock_id" validate:"required,numeric,gt=0" example:"1"`
	CustomerID   string `json:"customer_id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000"`
}

type CreateBulkOrderRequest struct {
	Orders []*CreateOrderRequest `json:"orders" validate:"required,dive"`
}

type UpdateOrderRequest struct {
	ID           int    `param:"id" validate:"required,numeric,gt=0" example:"1" swaggerignore:"true"`
	TenantID     string `json:"tenant_id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000"`
	TotalAmount  int    `json:"total_amount" validate:"numeric,gte=0" example:"100000" minimum:"0"`
	Quantity     int    `json:"quantity" validate:"numeric,gte=0" example:"1" minimum:"0"`
	DeliveryDate string `json:"delivery_date" validate:"required,datetime=2006-01-02,future_date" example:"2022-01-01"`
	Status       string `json:"status" validate:"oneof=PENDING SHIPPED DELIVERED CANCELLED" example:"PENDING" enum:"PENDING,SHIPPED,DELIVERED,CANCELLED"` // nolint:lll
}
