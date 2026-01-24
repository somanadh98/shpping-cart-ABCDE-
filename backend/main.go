package main

import (
	"backend/config"
	"backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.InitDB()
	r := gin.Default()
	routes.SetupRoutes(r)
	r.Run(":8082")
}
