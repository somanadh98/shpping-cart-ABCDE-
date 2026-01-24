package handlers

import (
	"backend/config"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateItem(c *gin.Context) {
	var req struct {
		Name   string  `json:"name" binding:"required"`
		Price  float64 `json:"price" binding:"required"`
		Status string  `json:"status"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	item := models.Item{
		Name:   req.Name,
		Price:  req.Price,
		Status: req.Status,
	}

	if err := config.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item"})
		return
	}

	c.JSON(http.StatusCreated, item)
}

func ListItems(c *gin.Context) {
	var items []models.Item
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

