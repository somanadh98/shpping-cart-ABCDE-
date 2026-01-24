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

	// Get all cart items with item details
	var cartItems []models.CartItem
	if err := config.DB.Where("cart_id = ?", cart.ID).Find(&cartItems).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to load cart items"})
		return
	}

	if len(cartItems) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is empty"})
		return
	}

	// Use transaction to ensure atomicity
	tx := config.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// Ensure rollback on any error
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r)
		}
	}()

	// Create order
	order := models.Order{
		CartID: cart.ID,
		UserID: currentUser.ID,
	}
	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Create order items from cart items (persist price at time of purchase)
	for _, cartItem := range cartItems {
		var item models.Item
		if err := tx.Where("id = ?", cartItem.ItemID).First(&item).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load item details"})
			return
		}

		orderItem := models.OrderItem{
			OrderID:  order.ID,
			ItemID:   cartItem.ItemID,
			Quantity: cartItem.Quantity,
			Price:    item.Price, // Persist price at time of purchase
		}

		if err := tx.Create(&orderItem).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order items"})
			return
		}
	}

	// Delete all cart items for this cart (do NOT delete the cart itself)
	if err := tx.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear cart items"})
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to complete order"})
		return
	}

	c.JSON(http.StatusCreated, order)
}

func ListOrders(c *gin.Context) {
	user, _ := c.Get("user")
	currentUser := user.(models.User)

	var orders []models.Order
	config.DB.Where("user_id = ?", currentUser.ID).
		Order("created_at DESC").
		Limit(5).
		Find(&orders)

	var orderDetails []gin.H
	for _, order := range orders {
		// Load order items with item details
		var orderItems []models.OrderItem
		config.DB.Where("order_id = ?", order.ID).Find(&orderItems)

		var items []gin.H
		total := 0.0

		for _, orderItem := range orderItems {
			var item models.Item
			config.DB.Where("id = ?", orderItem.ItemID).First(&item)

			subtotal := orderItem.Price * float64(orderItem.Quantity)
			total += subtotal
			items = append(items, gin.H{
				"name":     item.Name,
				"price":    orderItem.Price,
				"quantity": orderItem.Quantity,
				"subtotal": subtotal,
			})
		}

		orderDetails = append(orderDetails, gin.H{
			"order_id":   order.ID,
			"created_at": order.CreatedAt,
			"items":      items,
			"total":       total,
		})
	}

	c.JSON(http.StatusOK, orderDetails)
}

