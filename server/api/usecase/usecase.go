package usecase

import (
	"context"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/domain/model"
	"github.com/buysell-technologies/summer-internship-2024-backend/api/repository"
	"github.com/buysell-technologies/summer-internship-2024-backend/api/usecase/request"
)

type usecase struct {
	*UsecaseBundle
}

type UsecaseBundle struct {
	Repository repository.RepositoryInterface
}

type UsecaseInterface interface {
	/* user */
	GetUsers(ctx context.Context, input request.GetUsersRequest) ([]*model.User, error)
	GetUser(ctx context.Context, tenantID, userID string) (*model.User, error)
	CreateUser(ctx context.Context, user request.CreateUserRequest) (*string, error)
	UpdateUser(ctx context.Context, tenantID string, user request.UpdateUserRequest) (*model.User, error)
	DeleteUser(ctx context.Context, tenantID, userID string) error
	/* stock */
	GetStocks(ctx context.Context, input request.GetStocksRequest) ([]*model.Stock, error)
	GetStock(ctx context.Context, storeID, stockID string) (*model.Stock, error)
	CreateStock(ctx context.Context, stock request.CreateStockRequest) (*int, error)
	CreateBulkStock(ctx context.Context, stocks []request.CreateStockRequest) ([]*int, error)
	UpdateStock(ctx context.Context, stock request.UpdateStockRequest) (*model.Stock, error)
	DeleteStock(ctx context.Context, storeID, stockID string) error
	/* customer */
	GetCustomers(ctx context.Context, input request.GetCustomersRequest) ([]*model.Customer, error)
	GetCustomer(ctx context.Context, tenantID, customerID string) (*model.Customer, error)
	CreateCustomer(ctx context.Context, customer request.CreateCustomerRequest) (*string, error)
	UpdateCustomer(ctx context.Context, customer request.UpdateCustomerRequest) (*model.Customer, error)
	DeleteCustomer(ctx context.Context, tenantID, customerID string) error
	/* order */
	GetOrders(ctx context.Context, input request.GetOrdersRequest) ([]*model.Order, error)
	GetOrder(ctx context.Context, tenantID string, orderID int) (*model.Order, error)
	CreateOrder(ctx context.Context, order request.CreateOrderRequest) (*int, error)
	CreateBulkOrder(ctx context.Context, orders []request.CreateOrderRequest) ([]*int, error)
	UpdateOrder(ctx context.Context, order request.UpdateOrderRequest) (*model.Order, error)
}

func NewUsecase(ub *UsecaseBundle) UsecaseInterface {
	return &usecase{ub}
}
