package model

type Todo struct {
	ID     uint   `gorm:"primaryKey"`
	Todo   string `json:"todo"`
	Toggle bool   `json:"toggle"`
}
