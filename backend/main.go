package main

import (
	"backend/config"
	"backend/middleware"
	"backend/routes"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file for local development
	// On Render, environment variables are set directly, so this will silently fail
	if err := godotenv.Load(); err == nil {
		log.Println("Loaded .env file")
	}

	// Initialize database (must be after env loading)
	log.Println("Connecting to database...")
	config.InitDB()

	// Setup router
	r := gin.Default()
	r.Use(middleware.CORSMiddleware())
	routes.SetupRoutes(r)

	// Get port from environment or use default for local dev
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
