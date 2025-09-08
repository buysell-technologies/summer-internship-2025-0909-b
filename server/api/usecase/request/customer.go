package request

type GetCustomersRequest struct {
	TenantID string
	Limit    *int
	Offset   *int
}

type CreateCustomerRequest struct {
	TenantID    string
	Name        string
	Email       string
	PhoneNumber string
	Address     string
}

type UpdateCustomerRequest struct {
	ID          string
	TenantID    string
	Name        string
	Email       string
	PhoneNumber string
	Address     string
}
