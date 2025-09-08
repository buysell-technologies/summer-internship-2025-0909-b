package request

type GetOrdersRequest struct {
	TenantID string
	Limit    *int
	Offset   *int
}

type CreateOrderRequest struct {
	TotalAmount  int
	Quantity     int
	DeliveryDate string
	Status       string
	StockID      int
	CustomerID   string
}

type UpdateOrderRequest struct {
	ID           int
	TenantID     string
	TotalAmount  int
	Quantity     int
	DeliveryDate string
	Status       string
}
