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

	db, err := gorm.Open("postgres", databaseURL)
	if err != nil {
		log.Fatalf("failed to connect to PostgreSQL database: %v", err)
	}

	db.LogMode(true)
	DB = db

	log.Println("Connected to PostgreSQL successfully")

	DB.AutoMigrate(
		&models.User{},
		&models.Item{},
		&models.Cart{},
		&models.CartItem{},
		&models.Order{},
	)
}
