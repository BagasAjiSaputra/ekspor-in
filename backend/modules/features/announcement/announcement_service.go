package announcement

import (
	"eksporin/models"
	"errors"

	"github.com/google/uuid"
)

func CreateAnnouncementService(title string, description string, announcementType string, imageUrl string) (*models.Announcement, error) {

	if title == "" {
		return nil, errors.New("Judul wajib diisi")
	}

	if description == "" {
		return nil, errors.New("Deskripsi wajib diisi")
	}

	if announcementType != "promo" && announcementType != "diskon" {
		return nil, errors.New("Tipe pengumuman harus promo atau diskon")
	}

	announcement := &models.Announcement{
		Title:       title,
		Description: description,
		Type:        announcementType,
		ImageUrl:    imageUrl,
	}

	err := CreateAnnouncement(announcement)

	if err != nil {
		return nil, errors.New("Gagal menambahkan Pengumuman")
	}

	return announcement, nil
}

func UpdateAnnouncementService(id uuid.UUID, title string, description string, announcementType string, imageUrl string, isActive *bool) (*models.Announcement, error) {

	announcement, err := FindAnnouncement(id)

	if err != nil {
		return nil, errors.New("Pengumuman Tidak Ditemukan")
	}

	if title != "" {
		announcement.Title = title
	}

	if description != "" {
		announcement.Description = description
	}

	if announcementType != "" {
		if announcementType != "promo" && announcementType != "diskon" {
			return nil, errors.New("Tipe pengumuman harus promo atau diskon")
		}
		announcement.Type = announcementType
	}

	if imageUrl != "" {
		announcement.ImageUrl = imageUrl
	}

	if isActive != nil {
		announcement.IsActive = *isActive
	}

	err = UpdateAnnouncement(announcement)

	if err != nil {
		return nil, errors.New("Gagal Update Pengumuman")
	}

	return announcement, nil
}

func DeleteAnnouncementService(id uuid.UUID) (*models.Announcement, error) {

	announcement, err := FindAnnouncement(id)

	if err != nil {
		return nil, errors.New("Pengumuman Tidak Ditemukan")
	}

	err = DeleteAnnouncement(id)

	if err != nil {
		return nil, errors.New("Gagal Menghapus Pengumuman")
	}

	return announcement, nil
}

func GetAllAnnouncementsService() ([]models.Announcement, error) {
	announcements, err := FindAllAnnouncements()
	if err != nil {
		return nil, errors.New("Gagal Mengambil Data Pengumuman")
	}
	return announcements, nil
}

func GetActiveAnnouncementsService() ([]models.Announcement, error) {
	announcements, err := FindActiveAnnouncements()
	if err != nil {
		return nil, errors.New("Gagal Mengambil Data Pengumuman")
	}
	return announcements, nil
}
