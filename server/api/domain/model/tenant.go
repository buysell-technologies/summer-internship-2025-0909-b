package model

type Tenant struct {
	Timestamp

	ID   string `json:"id" gorm:"primaryKey;type:uuid;size:255;default:uuid_generate_v4()"`
	Name string `json:"name"`
	// リレーション (hasMany)
	Stores    []*Store    `json:"stores" gorm:"foreignKey:TenantID"`
	Customers []*Customer `json:"customers" gorm:"foreignKey:TenantID"`
}
