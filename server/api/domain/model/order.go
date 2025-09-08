package model

type Order struct {
	Timestamp

	ID           int         `json:"id" gorm:"primaryKey;autoIncrement"`
	TotalAmount  int         `json:"total_amount"`
	Quantity     int         `json:"quantity"`
	DeliveryDate string      `json:"delivery_date"`
	Status       OrderStatus `json:"status"`
	StockID      int         `json:"stock_id"`
	CustomerID   string      `json:"customer_id"`
}
