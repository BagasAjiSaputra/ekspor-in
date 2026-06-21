package announcement

import (
	"eksporin/modules/middleware"
	"eksporin/modules/utils"
	"encoding/json"
	"net/http"

	"image"
	"image/jpeg"
	_ "image/jpeg"
	_ "image/png"
	"os"

	"github.com/google/uuid"
	"github.com/nfnt/resize"
)

func CreateAnnouncementHandler(w http.ResponseWriter, r *http.Request) {

	err := r.ParseMultipartForm(10 << 20)

	if err != nil {
		utils.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	role, ok := r.Context().Value(middleware.UserRole).(string)

	if !ok || role != "admin" {
		utils.Error(w, "Forbidden Request", http.StatusForbidden)
		return
	}

	title := r.FormValue("title")
	description := r.FormValue("description")
	announcementType := r.FormValue("type")

	imageUrl := ""

	file, _, err := r.FormFile("image")
	if err == nil {
		defer file.Close()

		img, format, err := image.Decode(file)
		if err != nil {
			utils.Error(w, "Format gambar tidak valid", http.StatusBadRequest)
			return
		}

		resized := resize.Resize(800, 0, img, resize.Lanczos3)

		filename := uuid.New().String() + ".jpg"
		path := "./storage/uploads/" + filename

		out, err := os.Create(path)
		if err != nil {
			utils.Error(w, "Gagal simpan file", http.StatusInternalServerError)
			return
		}
		defer out.Close()

		err = jpeg.Encode(out, resized, &jpeg.Options{
			Quality: 100,
		})
		if err != nil {
			utils.Error(w, "Gagal encode gambar", http.StatusInternalServerError)
			return
		}

		imageUrl = "/uploads/" + filename
		_ = format
	}

	_, err = CreateAnnouncementService(title, description, announcementType, imageUrl)

	if err != nil {
		utils.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	response := CreateAnnouncementResponse{
		Message: "Pengumuman Berhasil Ditambahkan",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func UpdateAnnouncementHandler(w http.ResponseWriter, r *http.Request) {

	err := r.ParseMultipartForm(10 << 20)

	if err != nil {
		utils.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	role, ok := r.Context().Value(middleware.UserRole).(string)

	if !ok || role != "admin" {
		utils.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	idStr := r.FormValue("id")
	if idStr == "" {
		utils.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	id, err := uuid.Parse(idStr)
	if err != nil {
		utils.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	title := r.FormValue("title")
	description := r.FormValue("description")
	announcementType := r.FormValue("type")

	var isActive *bool
	isActiveStr := r.FormValue("is_active")
	if isActiveStr != "" {
		val := isActiveStr == "true"
		isActive = &val
	}

	imageUrl := ""

	file, _, err := r.FormFile("image")
	if err == nil {
		defer file.Close()

		img, format, err := image.Decode(file)
		if err != nil {
			utils.Error(w, "Format gambar tidak valid", http.StatusBadRequest)
			return
		}

		resized := resize.Resize(800, 0, img, resize.Lanczos3)

		filename := uuid.New().String() + ".jpg"
		path := "./storage/uploads/" + filename

		out, err := os.Create(path)
		if err != nil {
			utils.Error(w, "Gagal simpan file", http.StatusInternalServerError)
			return
		}
		defer out.Close()

		err = jpeg.Encode(out, resized, &jpeg.Options{
			Quality: 100,
		})
		if err != nil {
			utils.Error(w, "Gagal encode gambar", http.StatusInternalServerError)
			return
		}

		imageUrl = "/uploads/" + filename
		_ = format
	}

	_, err = UpdateAnnouncementService(id, title, description, announcementType, imageUrl, isActive)

	if err != nil {
		utils.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	response := UpdateAnnouncementResponse{
		Message: "Pengumuman Berhasil Di Update",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func DeleteAnnouncementHandler(w http.ResponseWriter, r *http.Request) {

	var req struct {
		ID uuid.UUID `json:"id"`
	}

	role, ok := r.Context().Value(middleware.UserRole).(string)

	if !ok || role != "admin" {
		utils.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		utils.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	_, err = DeleteAnnouncementService(req.ID)

	if err != nil {
		utils.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	response := map[string]string{
		"message": "Pengumuman Dihapus",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetAllAnnouncementsHandler(w http.ResponseWriter, r *http.Request) {

	announcements, err := GetAllAnnouncementsService()
	if err != nil {
		utils.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var response = []AnnouncementData{}
	for _, a := range announcements {
		response = append(response, AnnouncementData{
			ID:          a.ID,
			Title:       a.Title,
			Description: a.Description,
			Type:        a.Type,
			ImageUrl:    a.ImageUrl,
			IsActive:    a.IsActive,
			CreatedAt:   a.CreatedAt,
			UpdatedAt:   a.UpdatedAt,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetActiveAnnouncementsHandler(w http.ResponseWriter, r *http.Request) {

	announcements, err := GetActiveAnnouncementsService()
	if err != nil {
		utils.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var response = []AnnouncementData{}
	for _, a := range announcements {
		response = append(response, AnnouncementData{
			ID:          a.ID,
			Title:       a.Title,
			Description: a.Description,
			Type:        a.Type,
			ImageUrl:    a.ImageUrl,
			IsActive:    a.IsActive,
			CreatedAt:   a.CreatedAt,
			UpdatedAt:   a.UpdatedAt,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
