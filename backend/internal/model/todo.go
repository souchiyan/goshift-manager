package model

type Todo struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Todo   string `json:"todo"`
	Toggle bool   `json:"toggle"`
}
