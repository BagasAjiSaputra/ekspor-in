package announcement

import (
	"eksporin/config"
	"eksporin/models"

	"github.com/google/uuid"
)

func CreateAnnouncement(announcement *models.Announcement) error {
	return config.DB.Create(announcement).Error
}

func FindAnnouncement(id uuid.UUID) (*models.Announcement, error) {
	var announcement models.Announcement

	result := config.DB.Where("id = ?", id).First(&announcement)

	if result.Error != nil {
		return nil, result.Error
	}

	return &announcement, nil
}

func UpdateAnnouncement(announcement *models.Announcement) error {
	return config.DB.Save(announcement).Error
}

func DeleteAnnouncement(id uuid.UUID) error {
	return config.DB.Delete(&models.Announcement{}, "id = ?", id).Error
}

func FindAllAnnouncements() ([]models.Announcement, error) {
	var announcements []models.Announcement

	result := config.DB.Order("created_at desc").Find(&announcements)

	if result.Error != nil {
		return nil, result.Error
	}

	return announcements, nil
}

func FindActiveAnnouncements() ([]models.Announcement, error) {
	var announcements []models.Announcement

	result := config.DB.Where("is_active = ?", true).Order("created_at desc").Find(&announcements)

	if result.Error != nil {
		return nil, result.Error
	}

	return announcements, nil
}
