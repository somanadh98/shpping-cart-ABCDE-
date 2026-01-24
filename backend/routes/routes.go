package routes

import (
	"backend/handlers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.POST("/users", handlers.CreateUser)
	r.POST("/users/login", handlers.Login)

	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware())

	auth.GET("/users", handlers.ListUsers)
	auth.POST("/items", handlers.CreateItem)
	auth.GET("/items", handlers.ListItems)
	auth.POST("/carts", handlers.CreateCart)
	auth.GET("/carts", handlers.ListCarts)
	auth.POST("/carts/remove", handlers.RemoveCartItem)
	auth.POST("/orders", handlers.CreateOrder)
	auth.GET("/orders", handlers.ListOrders)
}
