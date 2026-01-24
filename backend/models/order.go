package models

import "time"

type Order struct {
	ID        uint      `gorm:"primary_key" json:"id"`
	CartID    uint      `gorm:"not null" json:"cart_id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}

