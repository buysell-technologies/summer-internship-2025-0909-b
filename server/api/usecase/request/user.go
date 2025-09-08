package request

type GetUsersRequest struct {
	TenantID string
	Limit    *int
	Offset   *int
}

type CreateUserRequest struct {
	Name           string
	Email          string
	EmployeeNumber string
	Gender         *string
	StoreID        string
}

type UpdateUserRequest struct {
	ID             string
	Name           string
	Email          string
	EmployeeNumber string
	Gender         *string
	StoreID        string
}
