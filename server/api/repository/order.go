package repository

import (
	"context"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/domain/model"
	"gorm.io/gorm/clause"
)

func (r *repository) GetOrders(ctx context.Context, tenantID string, limit, offset int) ([]*model.Order, error) {
	orders := []*model.Order{}

	if err := r.db.Unscoped().
		Joins("JOIN customers AS c ON orders.customer_id = c.id").
		Where("c.tenant_id = ?", tenantID).
		Limit(limit).
		Offset(offset).
		Find(&orders).
		Error; err != nil {
		return nil, err
	}

	return orders, nil
}

func (r *repository) GetOrder(ctx context.Context, tenantID string, orderID int) (*model.Order, error) {
	order := &model.Order{}

	if err := r.db.Unscoped().
		Joins("JOIN customers AS c ON orders.customer_id = c.id").
		Where("c.tenant_id = ? AND orders.id = ?", tenantID, orderID).
		First(&order).
		Error; err != nil {
		return nil, err
	}

	return order, nil
}

func (r *repository) CreateOrder(ctx context.Context, order model.Order) (*int, error) {
	if err := r.db.Create(&order).Error; err != nil {
		return nil, err
	}

	return &order.ID, nil
}

func (r *repository) CreateBulkOrder(ctx context.Context, orders []model.Order) ([]*int, error) {
	if err := r.db.CreateInBatches(orders, 1000).Error; err != nil {
		return nil, err
	}

	var orderIDs []*int
	for _, order := range orders {
		order := order
		orderIDs = append(orderIDs, &order.ID)
	}

	return orderIDs, nil
}

func (r *repository) UpdateOrder(ctx context.Context, order model.Order) (*model.Order, error) {
	if err := r.db.
		Clauses(clause.Returning{}).
		Where("id = ?", order.ID).
		Updates(&order).Error; err != nil {
		return nil, err
	}

	return &order, nil
}
