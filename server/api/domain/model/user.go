package model

type User struct {
	SoftDeleteTimestamp

	ID             string  `json:"id" gorm:"primaryKey;type:uuid;size:255;default:uuid_generate_v4()"`
	Name           string  `json:"name"`
	Email          string  `json:"email"`
	EmployeeNumber string  `json:"employee_number"`
	Gender         *string `json:"gender"`
	StoreID        string  `json:"store_id"`
	// リレーション (hasMany)
	Stocks []*Stock `json:"stocks" gorm:"foreignKey:UserID"`
}
