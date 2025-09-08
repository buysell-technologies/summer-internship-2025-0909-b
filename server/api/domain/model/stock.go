package model

type Stock struct {
	Timestamp

	ID       int    `json:"id" gorm:"primaryKey;autoIncrement"`
	Name     string `json:"name"`
	Quantity int    `json:"quantity"`
	Price    int    `json:"price"`
	StoreID  string `json:"store_id"`
	UserID   string `json:"user_id"`
	// リレーション (hasMany)
	Orders []Order `json:"orders" gorm:"foreignKey:StockID"`
}
