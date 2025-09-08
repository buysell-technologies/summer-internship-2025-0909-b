package usecase

import (
	"context"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/domain/model"
	"github.com/buysell-technologies/summer-internship-2024-backend/api/usecase/request"
)

func (u *usecase) GetUsers(ctx context.Context, input request.GetUsersRequest) ([]*model.User, error) {
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

	users, err := u.Repository.GetUsers(ctx, input.TenantID, validLimit, validOffset)
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (u *usecase) GetUser(ctx context.Context, tenantID, userID string) (*model.User, error) {
	user, err := u.Repository.GetUser(ctx, tenantID, userID)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (u *usecase) CreateUser(ctx context.Context, user request.CreateUserRequest) (*string, error) {
	userID, err := u.Repository.CreateUser(ctx, model.User{
		Name:           user.Name,
		Email:          user.Email,
		EmployeeNumber: user.EmployeeNumber,
		Gender:         user.Gender,
		StoreID:        user.StoreID,
	})
	if err != nil {
		return nil, err
	}

	return userID, nil
}

func (u *usecase) UpdateUser(ctx context.Context, tenantID string, user request.UpdateUserRequest) (*model.User, error) {
	userModel, err := u.Repository.GetUser(ctx, tenantID, user.ID)
	if err != nil {
		return nil, err
	}

	userModel.Name = user.Name
	userModel.Email = user.Email
	userModel.EmployeeNumber = user.EmployeeNumber
	if user.Gender != nil {
		userModel.Gender = user.Gender
	}
	userModel.StoreID = user.StoreID

	updatedUser, err := u.Repository.UpdateUser(ctx, *userModel)
	if err != nil {
		return nil, err
	}

	return updatedUser, nil
}

func (u *usecase) DeleteUser(ctx context.Context, tenantID, userID string) error {
	if err := u.Repository.DeleteUser(ctx, tenantID, userID); err != nil {
		return err
	}

	return nil
}
