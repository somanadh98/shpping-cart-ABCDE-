package models

type OrderItem struct {
	OrderID  uint    `gorm:"primary_key" json:"order_id"`
	ItemID   uint    `gorm:"primary_key" json:"item_id"`
	Quantity int     `gorm:"not null" json:"quantity"`
	Price    float64 `gorm:"type:numeric(10,2);not null" json:"price"`
	
	Order Order `gorm:"foreignkey:OrderID" json:"-"`
	Item  Item  `gorm:"foreignkey:ItemID" json:"-"`
}

