package announcement

import (
	"time"

	"github.com/google/uuid"
)

type CreateAnnouncementRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Type        string `json:"type"`
	ImageUrl    string `json:"image_url"`
}

type CreateAnnouncementResponse struct {
	Message string `json:"message"`
}

type UpdateAnnouncementRequest struct {
	ID          uuid.UUID `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Type        string    `json:"type"`
	ImageUrl    string    `json:"image_url"`
	IsActive    *bool     `json:"is_active"`
}

type UpdateAnnouncementResponse struct {
	Message string `json:"message"`
}

type AnnouncementData struct {
	ID          uuid.UUID `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Type        string    `json:"type"`
	ImageUrl    string    `json:"image_url"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
