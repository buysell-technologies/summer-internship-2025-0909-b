package model

type OrderStatus string

const (
	StatusPending   OrderStatus = "PENDING"   // 保留中
	StatusShipped   OrderStatus = "SHIPPED"   // 出荷済み
	StatusDelivered OrderStatus = "DELIVERED" // 納品済み
	StatusCancelled OrderStatus = "CANCELLED" // キャンセル
)

func (o *OrderStatus) Status(input string) OrderStatus {
	switch input {
	case "PENDING":
		return StatusPending
	case "SHIPPED":
		return StatusShipped
	case "DELIVERED":
		return StatusDelivered
	case "CANCELLED":
		return StatusCancelled
	default:
		return StatusPending
	}
}
