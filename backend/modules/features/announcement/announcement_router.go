package announcement

import (
	"eksporin/modules/utils"
	"net/http"
)

func AnnouncementRouter(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case http.MethodGet:
		GetAllAnnouncementsHandler(w, r)
	case http.MethodPost:
		CreateAnnouncementHandler(w, r)
	case http.MethodPut:
		UpdateAnnouncementHandler(w, r)
	case http.MethodDelete:
		DeleteAnnouncementHandler(w, r)

	default:
		utils.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}
