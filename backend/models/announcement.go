package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Announcement struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid();"`
	Title       string    `gorm:"type:varchar(255);not null"`
	Description string    `gorm:"type:text;not null"`
	Type        string    `gorm:"type:varchar(50);not null"`
	ImageUrl    string    `gorm:"type:varchar(1000)"`
	IsActive    bool      `gorm:"default:true"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoCreateTime"`
}

func (a *Announcement) BeforeCreate(tx *gorm.DB) (err error) {
	a.ID = uuid.New()
	return
}
