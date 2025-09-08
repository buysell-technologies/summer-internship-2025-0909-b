package repository

import (
	"context"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/domain/model"
	"gorm.io/gorm/clause"
)

func (r *repository) GetCustomers(ctx context.Context, tenantID string, limit, offset int) ([]*model.Customer, error) {
	customers := []*model.Customer{}

	if err := r.db.Unscoped().
		Preload("Orders").
		Joins("JOIN tenants AS t ON customers.tenant_id = t.id").
		Where("customers.tenant_id = ?", tenantID).
		Limit(limit).
		Offset(offset).
		Find(&customers).
		Error; err != nil {
		return nil, err
	}

	return customers, nil
}

func (r *repository) GetCustomer(ctx context.Context, tenantID, customerID string) (*model.Customer, error) {
	customer := &model.Customer{}

	if err := r.db.Unscoped().
		Preload("Orders").
		Joins("JOIN tenants AS t ON customers.tenant_id = t.id").
		Where("customers.tenant_id = ? AND customers.id = ?", tenantID, customerID).
		First(&customer).
		Error; err != nil {
		return nil, err
	}

	return customer, nil
}

func (r *repository) CreateCustomer(ctx context.Context, customer model.Customer) (*string, error) {
	if err := r.db.Create(&customer).Error; err != nil {
		return nil, err
	}

	return &customer.ID, nil
}

func (r *repository) UpdateCustomer(ctx context.Context, customer model.Customer) (*model.Customer, error) {
	if err := r.db.
		Clauses(clause.Returning{}).
		Where(
			"tenant_id = ? AND id = ?",
			customer.TenantID,
			customer.ID,
		).
		Updates(&customer).Error; err != nil {
		return nil, err
	}

	return &customer, nil
}

func (r *repository) DeleteCustomer(ctx context.Context, tenantID, customerID string) error {
	return r.db.Where(
		"tenant_id = ? AND id = ?",
		tenantID,
		customerID,
	).
		Delete(&model.Customer{}).Error
}
