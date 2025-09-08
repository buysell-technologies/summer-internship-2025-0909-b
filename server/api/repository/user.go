package repository

import (
	"context"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/domain/model"
	"gorm.io/gorm/clause"
)

func (r *repository) GetUsers(ctx context.Context, tenantID string, limit, offset int) ([]*model.User, error) {
	users := []*model.User{}

	if err := r.db.Unscoped().
		Joins("LEFT JOIN stores AS s ON users.store_id = s.id").
		Where("s.tenant_id = ?", tenantID).
		Limit(limit).
		Offset(offset).
		Find(&users).
		Error; err != nil {
		return nil, err
	}

	for i, user := range users {
		stocks := []*model.Stock{}
		if err := r.db.Where("user_id = ?", user.ID).Find(&stocks).Error; err == nil {
			users[i].Stocks = stocks
		}
	}

	return users, nil
}

func (r *repository) GetUser(ctx context.Context, tenantID, userID string) (*model.User, error) {
	user := &model.User{}

	if err := r.db.Unscoped().
		Joins("LEFT JOIN stores AS s ON users.store_id = s.id").
		Where("s.tenant_id = ? AND users.id = ?", tenantID, userID).
		First(&user).
		Error; err != nil {
		return nil, err
	}

	stocks := []*model.Stock{}
	if err := r.db.Where("user_id = ?", user.ID).Find(&stocks).Error; err == nil {
		user.Stocks = stocks
	}

	return user, nil
}

func (r *repository) CreateUser(ctx context.Context, user model.User) (*string, error) {
	if err := r.db.Create(&user).Error; err != nil {
		return nil, err
	}

	return &user.ID, nil
}

func (r *repository) UpdateUser(ctx context.Context, user model.User) (*model.User, error) {
	if err := r.db.Model(&user).
		Unscoped().
		Clauses(clause.Returning{}).
		Where("id = ?", user.ID).
		Updates(&user).
		Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *repository) DeleteUser(ctx context.Context, tenantID, userID string) error {
	if err := r.db.
		Where(
			"users.id = ? AND users.store_id IN (?)",
			userID,
			r.db.Model(&model.Store{}).
				Select("id").
				Where("tenant_id = ?", tenantID),
		).
		Delete(&model.User{}).
		Error; err != nil {
		return err
	}

	return nil
}
