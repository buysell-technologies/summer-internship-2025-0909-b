package repository

import (
	"context"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/domain/model"
	"github.com/buysell-technologies/summer-internship-2024-backend/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type RepositoryInterface interface {
	GetDB() *gorm.DB
	/* user */
	GetUsers(ctx context.Context, tenantID string, limit, offset int) ([]*model.User, error)
	GetUser(ctx context.Context, tenantID, userID string) (*model.User, error)
	CreateUser(ctx context.Context, user model.User) (*string, error)
	UpdateUser(ctx context.Context, user model.User) (*model.User, error)
	DeleteUser(ctx context.Context, tenantID, userID string) error
	/* stock */
	GetStocks(ctx context.Context, storeID string, limit, offset int) ([]*model.Stock, error)
	GetStock(ctx context.Context, storeID, stockID string) (*model.Stock, error)
	CreateStock(ctx context.Context, stock model.Stock) (*int, error)
	CreateBulkStock(ctx context.Context, stocks []model.Stock) ([]*int, error)
	UpdateStock(ctx context.Context, stock model.Stock) (*model.Stock, error)
	DeleteStock(ctx context.Context, storeID, stockID string) error
	/* customer */
	GetCustomers(ctx context.Context, tenantID string, limit, offset int) ([]*model.Customer, error)
	GetCustomer(ctx context.Context, tenantID, customerID string) (*model.Customer, error)
	CreateCustomer(ctx context.Context, customer model.Customer) (*string, error)
	UpdateCustomer(ctx context.Context, customer model.Customer) (*model.Customer, error)
	DeleteCustomer(ctx context.Context, tenantID, customerID string) error
	/* order */
	GetOrders(ctx context.Context, tenantID string, limit, offset int) ([]*model.Order, error)
	GetOrder(ctx context.Context, tenantID string, orderID int) (*model.Order, error)
	CreateOrder(ctx context.Context, order model.Order) (*int, error)
	CreateBulkOrder(ctx context.Context, orders []model.Order) ([]*int, error)
	UpdateOrder(ctx context.Context, order model.Order) (*model.Order, error)
}

type repository struct {
	db *gorm.DB
}

func New(cfg *config.Config) (RepositoryInterface, error) {
	dsn := cfg.DSN()

	db, err := gorm.Open(
		postgres.New(
			postgres.Config{
				DSN: dsn,
			},
		),
		&gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		},
	)
	if err != nil {
		return nil, err
	}

	return &repository{db}, nil
}

func (re *repository) GetDB() *gorm.DB {
	return re.db
}
