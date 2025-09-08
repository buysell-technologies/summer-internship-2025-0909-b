package usecase

import (
	"context"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/domain/model"
	"github.com/buysell-technologies/summer-internship-2024-backend/api/usecase/request"
)

func (u *usecase) GetOrders(ctx context.Context, input request.GetOrdersRequest) ([]*model.Order, error) {
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

	orders, err := u.Repository.GetOrders(ctx, input.TenantID, validLimit, validOffset)
	if err != nil {
		return nil, err
	}

	return orders, nil
}

func (u *usecase) GetOrder(ctx context.Context, tenantID string, orderID int) (*model.Order, error) {
	order, err := u.Repository.GetOrder(ctx, tenantID, orderID)
	if err != nil {
		return nil, err
	}

	return order, nil
}

func (u *usecase) CreateOrder(ctx context.Context, order request.CreateOrderRequest) (*int, error) {
	var orderStatus model.OrderStatus
	status := orderStatus.Status(order.Status)

	orderID, err := u.Repository.CreateOrder(ctx, model.Order{
		TotalAmount:  order.TotalAmount,
		Quantity:     order.Quantity,
		DeliveryDate: order.DeliveryDate,
		Status:       status,
		StockID:      order.StockID,
		CustomerID:   order.CustomerID,
	})
	if err != nil {
		return nil, err
	}

	return orderID, nil
}

func (u *usecase) CreateBulkOrder(ctx context.Context, orders []request.CreateOrderRequest) ([]*int, error) {
	if len(orders) == 0 {
		return nil, nil
	}

	var orderModels []model.Order
	for _, order := range orders {
		var orderStatus model.OrderStatus
		status := orderStatus.Status(order.Status)

		orderModels = append(orderModels, model.Order{
			TotalAmount:  order.TotalAmount,
			Quantity:     order.Quantity,
			DeliveryDate: order.DeliveryDate,
			Status:       status,
			StockID:      order.StockID,
			CustomerID:   order.CustomerID,
		})
	}

	orderIDs, err := u.Repository.CreateBulkOrder(ctx, orderModels)
	if err != nil {
		return nil, err
	}

	return orderIDs, nil
}

func (u *usecase) UpdateOrder(ctx context.Context, order request.UpdateOrderRequest) (*model.Order, error) {
	orderModel, err := u.Repository.GetOrder(ctx, order.TenantID, order.ID)
	if err != nil {
		return nil, err
	}

	orderModel.TotalAmount = order.TotalAmount
	orderModel.Quantity = order.Quantity
	orderModel.DeliveryDate = order.DeliveryDate

	var orderStatus model.OrderStatus
	orderModel.Status = orderStatus.Status(order.Status)

	return u.Repository.UpdateOrder(ctx, *orderModel)
}
