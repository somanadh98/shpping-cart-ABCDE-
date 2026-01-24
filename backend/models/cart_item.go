package models

type CartItem struct {
	CartID   uint `gorm:"primary_key" json:"cart_id"`
	ItemID   uint `gorm:"primary_key" json:"item_id"`
	Quantity int  `gorm:"default:1" json:"quantity"`
}
