package usecase

import (
	"context"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/domain/model"
	"github.com/buysell-technologies/summer-internship-2024-backend/api/usecase/request"
)

func (u *usecase) GetCustomers(ctx context.Context, input request.GetCustomersRequest) ([]*model.Customer, error) {
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

	customers, err := u.Repository.GetCustomers(ctx, input.TenantID, validLimit, validOffset)
	if err != nil {
		return nil, err
	}

	return customers, nil
}

func (u *usecase) GetCustomer(ctx context.Context, tenantID, customerID string) (*model.Customer, error) {
	customer, err := u.Repository.GetCustomer(ctx, tenantID, customerID)
	if err != nil {
		return nil, err
	}

	return customer, nil
}

func (u *usecase) CreateCustomer(ctx context.Context, customer request.CreateCustomerRequest) (*string, error) {
	customerID, err := u.Repository.CreateCustomer(ctx, model.Customer{
		TenantID:    customer.TenantID,
		Name:        customer.Name,
		Email:       customer.Email,
		PhoneNumber: customer.PhoneNumber,
		Address:     customer.Address,
	})
	if err != nil {
		return nil, err
	}

	return customerID, nil
}

func (u *usecase) UpdateCustomer(ctx context.Context, customer request.UpdateCustomerRequest) (*model.Customer, error) {
	customerModel, err := u.Repository.GetCustomer(ctx, customer.TenantID, customer.ID)
	if err != nil {
		return nil, err
	}

	customerModel.Name = customer.Name
	customerModel.Email = customer.Email
	customerModel.PhoneNumber = customer.PhoneNumber
	customerModel.Address = customer.Address

	return u.Repository.UpdateCustomer(ctx, *customerModel)
}

func (u *usecase) DeleteCustomer(ctx context.Context, tenantID, customerID string) error {
	return u.Repository.DeleteCustomer(ctx, tenantID, customerID)
}
