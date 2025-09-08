package request

type GetUsersRequest struct {
	Limit  *int `query:"limit" validate:"omitempty,numeric,gte=0" example:"10" minimum:"0"`
	Offset *int `query:"offset" validate:"omitempty,numeric,gte=0" example:"0" minimum:"0"`
}

type GetUserRequest struct {
	UserID string `param:"id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000"`
}

type CreateUserRequest struct {
	Name           string  `json:"name" validate:"required,min=1,max=255" example:"田中 太郎"`
	Email          string  `json:"email" validate:"required,email" example:"taro_tanaka@example.com"`
	EmployeeNumber string  `json:"employee_number" validate:"required,min=1,max=10" example:"0000000000"`
	Gender         *string `json:"gender" validate:"omitempty,oneof=male female" example:"male"`
	StoreID        string  `json:"store_id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000"`
}

type UpdateUserRequest struct {
	UserID         string  `param:"id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000" swaggerignore:"true"`
	Name           string  `json:"name" validate:"required,min=1,max=255" example:"田中 太郎"`
	Email          string  `json:"email" validate:"required,email" example:"taro_tanaka@example.com"`
	EmployeeNumber string  `json:"employee_number" validate:"required,min=1,max=10" example:"0000000000"`
	Gender         *string `json:"gender" validate:"omitempty,oneof=male female" example:"male"`
	StoreID        string  `json:"store_id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000"`
}

type DeleteUserRequest struct {
	UserID string `param:"id" validate:"required,uuid4" example:"00000000-0000-0000-0000-000000000000"`
}
