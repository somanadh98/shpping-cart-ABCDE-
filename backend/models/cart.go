package models

import "time"

type Cart struct {
	ID        uint      `gorm:"primary_key" json:"id"`
	UserID    uint      `gorm:"unique;not null" json:"user_id"`
	Name      string    `json:"name"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}

