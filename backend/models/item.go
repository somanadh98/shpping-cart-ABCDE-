package models

import "time"

type Item struct {
	ID        uint      `gorm:"primary_key" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Price     float64   `gorm:"type:numeric(10,2);not null" json:"price"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}
