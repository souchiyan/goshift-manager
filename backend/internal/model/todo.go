package model

type Todo struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Todo      string `json:"todo"`
	IsChecked bool   `json:"is_checked"`
	Priority  string `json:"priority"`
}
