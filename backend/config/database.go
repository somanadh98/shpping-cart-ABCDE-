package config

import (
	"backend/models"
	"fmt"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB

func InitDB() {
	var err error

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	if host == "" {
		host = "localhost"
	}
	if port == "" {
		port = "5432"
	}
	if user == "" {
		panic("DB_USER environment variable is required")
	}
	if password == "" {
		panic("DB_PASSWORD environment variable is required")
	}
	if dbname == "" {
		panic("DB_NAME environment variable is required")
	}

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	DB, err = gorm.Open("postgres", dsn)
	if err != nil {
		panic(fmt.Sprintf("failed to connect to PostgreSQL database: %v", err))
	}

	DB.LogMode(true)

	DB.AutoMigrate(
		&models.User{},
		&models.Item{},
		&models.Cart{},
		&models.CartItem{},
		&models.Order{},
	)
}
