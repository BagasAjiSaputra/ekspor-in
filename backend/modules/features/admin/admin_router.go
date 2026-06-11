package admin

import (
	"eksporin/modules/utils"
	"net/http"
)

func AdminRouter(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case http.MethodGet:
		GetAllUserHandler(w, r)

	default:
		utils.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}

}

func BanRouter(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case http.MethodPost:
		BanUserHandler(w, r)
	case http.MethodPut:
		UnbanUserHandler(w, r)

	default:
		utils.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}

}
