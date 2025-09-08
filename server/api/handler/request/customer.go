package request

type GetCustomersRequest struct {
	Limit  *int `query:"limit" validate:"omitempty,numeric,gte=0" example:"10" minimum:"0"`
	Offset *int `query:"offset" validate:"omitempty,numeric,gte=0" example:"0" minimum:"0"`
}

type GetCustomerRequest struct {
	CustomerID string `param:"id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000"`
}

type CreateCustomerRequest struct {
	TenantID    string `json:"tenant_id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000"`
	Name        string `json:"name" validate:"required,min=1,max=255" example:"田中 太郎"`
	Email       string `json:"email" validate:"required,email" example:"taro_tanaka@example.com"`
	PhoneNumber string `json:"phone_number" validate:"required,jp_phone_number" example:"09012345678"`
	Address     string `json:"address" validate:"required,min=1,max=255" example:"東京都千代田区丸の内1-1-1"`
}

type UpdateCustomerRequest struct {
	ID          string `param:"id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000" swaggerignore:"true"`
	TenantID    string `json:"tenant_id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000"`
	Name        string `json:"name" validate:"required,min=1,max=255" example:"田中 太郎"`
	Email       string `json:"email" validate:"required,email" example:"taro_tanaka@example.com"`
	PhoneNumber string `json:"phone_number" validate:"required,jp_phone_number" example:"09012345678"`
	Address     string `json:"address" validate:"required,min=1,max=255" example:"東京都千代田区丸の内1-1-1"`
}

type DeleteCustomerRequest struct {
	CustomerID string `param:"id" validate:"required" example:"00000000-0000-0000-0000-000000000000"`
}
