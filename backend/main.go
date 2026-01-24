package main

import (
	"backend/config"
	"backend/middleware"
	"backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.InitDB()
	r := gin.Default()
	r.Use(middleware.CORSMiddleware())
	routes.SetupRoutes(r)
	r.Run(":8082")
}
