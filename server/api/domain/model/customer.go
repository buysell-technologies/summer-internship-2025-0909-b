package model

type Customer struct {
	SoftDeleteTimestamp

	ID          string `json:"id" gorm:"primaryKey;type:uuid;size:255;default:uuid_generate_v4()"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
	Address     string `json:"address"`
	TenantID    string `json:"tenant_id"`
	// リレーション (hasMany)
	Orders []*Order `json:"orders" gorm:"foreignKey:CustomerID"`
}
