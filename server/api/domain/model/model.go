package model

import (
	"time"

	"gorm.io/gorm"
)

type Timestamp struct {
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type SoftDeleteTimestamp struct {
	Timestamp
	DeletedAt gorm.DeletedAt `json:"deleted_at" swaggertype:"string" format:"date-time" example:"2023-01-01T00:00:00Z"`
}
