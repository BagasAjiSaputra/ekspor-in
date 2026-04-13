package users

import (
	"eksporin/models"
	"eksporin/modules/utils"
	"errors"
	"github.com/google/uuid"
)

func RegisterUser(name string, email string, password string)(*models.User, error) {

	if name == "" || email == "" || password == "" {
		return nil, errors.New("All Field Required")
	}

	hashedPassword, err := utils.HashPassword(password)

	if err != nil {
		return nil, err
	}
	
	user := &models.User{
		Name: name,
		Email : email,
		Password : hashedPassword,
	}

	err = CreateUser(user)

	if err != nil {
		return nil, errors.New("User Already Exist")
	}

	return user, nil
}

func LoginUser(email string, password string) (string, error) {
	user := FindByEmail(email) 

	if user == nil {
		return "", errors.New("Invalid Credentials")
	}

	if !utils.CheckPassword(user.Password, password) {
		return "", errors.New("Invalid Credentials")
	}

	token, err := utils.GenerateToken(user.ID, user.Email, string(user.Role))

	if err != nil {
		return "", err
	}

	return token, nil
}

func GetUserByID(id uuid.UUID) (*models.User, error) {
	return FindByID(id)
}
