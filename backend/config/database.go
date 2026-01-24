package config

import (
	"log"
	"os"

	"backend/models"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB

func InitDB() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}

	// Validate DATABASE_URL format (basic check)
	if len(databaseURL) < 10 {
		log.Fatal("DATABASE_URL appears to be invalid (too short)")
	}

	db, err := gorm.Open("postgres", databaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL database: %v", err)
	}

	// Test connection using ping
	if err := db.DB().Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	db.LogMode(true)
	DB = db

	log.Println("Database connected successfully")

	// AutoMigrate all models (safe - no DROP TABLE)
	log.Println("Running database migrations...")
	DB.AutoMigrate(
		&models.User{},
		&models.Item{},
		&models.Cart{},
		&models.CartItem{},
		&models.Order{},
	)
	log.Println("Database migrations completed")
}
