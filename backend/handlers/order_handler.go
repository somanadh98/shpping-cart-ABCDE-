package handlers

import (
	"backend/config"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
	user, _ := c.Get("user")
	currentUser := user.(models.User)

	var cart models.Cart
	if err := config.DB.Where("user_id = ?", currentUser.ID).First(&cart).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart not found"})
		return
	}

	order := models.Order{
		CartID: cart.ID,
		UserID: currentUser.ID,
	}
	config.DB.Create(&order)

	c.JSON(http.StatusCreated, order)
}

func ListOrders(c *gin.Context) {
	user, _ := c.Get("user")
	currentUser := user.(models.User)

	var orders []models.Order
	config.DB.Where("user_id = ?", currentUser.ID).Order("created_at DESC").Limit(5).Find(&orders)

	var orderDetails []gin.H
	for _, order := range orders {
		var cart models.Cart
		config.DB.Where("id = ?", order.CartID).First(&cart)

		var cartItems []models.CartItem
		config.DB.Where("cart_id = ?", cart.ID).Find(&cartItems)

		var items []gin.H
		total := 0.0
		for _, cartItem := range cartItems {
			var item models.Item
			config.DB.Where("id = ?", cartItem.ItemID).First(&item)
			subtotal := item.Price * float64(cartItem.Quantity)
			total += subtotal
			items = append(items, gin.H{
				"id":       item.ID,
				"name":     item.Name,
				"price":    item.Price,
				"quantity": cartItem.Quantity,
				"subtotal": subtotal,
			})
		}

		orderDetails = append(orderDetails, gin.H{
			"order_id":   order.ID,
			"created_at": order.CreatedAt,
			"items":      items,
			"total":      total,
		})
	}

	c.JSON(http.StatusOK, orderDetails)
}

