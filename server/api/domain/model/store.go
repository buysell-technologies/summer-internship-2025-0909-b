package model

type Store struct {
	SoftDeleteTimestamp

	ID          string `json:"id" gorm:"primaryKey;type:uuid;size:255;default:uuid_generate_v4()"`
	Name        string `json:"name"`
	ZipCode     string `json:"zip_code"`
	Address     string `json:"address"`
	PhoneNumber string `json:"phone_number"`
	TenantID    string `json:"tenant_id"`
	// リレーション (hasMany)
	Users  []*User  `json:"users" gorm:"foreignKey:StoreID"`
	Stocks []*Stock `json:"stocks" gorm:"foreignKey:StoreID"`
}
