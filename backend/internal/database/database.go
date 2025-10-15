package database

import (
	"fmt"
	"shift-manager/internal/model"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase() {

	dsn := "user:pass@tcp(db:3306)/detabase?charset=utf8mb4&parseTime=True&loc=Local"

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	DB.AutoMigrate(&model.Todo{})
	fmt.Println("データベース作成成功")
}
