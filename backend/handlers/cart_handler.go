package handlers

import (
	"backend/config"
	"backend/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func CreateCart(c *gin.Context) {
	user, _ := c.Get("user")
	currentUser := user.(models.User)

	var input struct {
		ItemIDs []uint `json:"item_ids"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cart models.Cart
	if err := config.DB.Where("user_id = ?", currentUser.ID).First(&cart).Error; err != nil {
		cart = models.Cart{
			UserID: currentUser.ID,
			Name:   "Cart",
			Status: "active",
		}
		config.DB.Create(&cart)
		currentUser.CartID = cart.ID
		config.DB.Save(&currentUser)
	}

	for _, itemID := range input.ItemIDs {
		var cartItem models.CartItem
		if err := config.DB.Where("cart_id = ? AND item_id = ?", cart.ID, itemID).First(&cartItem).Error; err != nil {
			cartItem = models.CartItem{
				CartID:   cart.ID,
				ItemID:   itemID,
				Quantity: 1,
			}
			config.DB.Create(&cartItem)
		} else {
			cartItem.Quantity++
			config.DB.Save(&cartItem)
		}
	}

	c.JSON(http.StatusCreated, cart)
}

func ListCarts(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token != "" {
		token = strings.TrimPrefix(token, "Bearer ")
		if token == "" {
			token = strings.TrimPrefix(c.GetHeader("Authorization"), "Token ")
		}

		var user models.User
		if err := config.DB.Where("token = ?", token).First(&user).Error; err == nil {

			var cart models.Cart
			if err := config.DB.Where("user_id = ?", user.ID).First(&cart).Error; err != nil {
				c.JSON(http.StatusOK, gin.H{
					"cart_id": 0,
					"items":   []interface{}{},
					"total":   0,
				})
				return
			}

			var cartItems []models.CartItem
			config.DB.Where("cart_id = ?", cart.ID).Find(&cartItems)

			var items []gin.H
			var total float64 = 0

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

			c.JSON(http.StatusOK, gin.H{
				"cart_id": cart.ID,
				"items":   items,
				"total":   total,
			})
			return
		}
	}

	var carts []models.Cart
	config.DB.Find(&carts)
	c.JSON(http.StatusOK, carts)
}

func RemoveCartItem(c *gin.Context) {
	user, _ := c.Get("user")
	currentUser := user.(models.User)

	var input struct {
		ItemID uint `json:"item_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cart models.Cart
	if err := config.DB.Where("user_id = ?", currentUser.ID).First(&cart).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart not found"})
		return
	}

	var cartItem models.CartItem
	if err := config.DB.Where("cart_id = ? AND item_id = ?", cart.ID, input.ItemID).First(&cartItem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Item not in cart"})
		return
	}

	if cartItem.Quantity > 1 {
		cartItem.Quantity--
		config.DB.Save(&cartItem)
	} else {
		config.DB.Delete(&cartItem)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item removed from cart"})
}
