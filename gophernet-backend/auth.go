package main

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

var demoUsers = map[string]struct {
	Password string
	Role     string
}{
	"admin": {"admin123", "admin"}, //DEMO
	"user":  {"user123", "user"},	//DEMO
}

type Claims struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var c struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	json.NewDecoder(r.Body).Decode(&c)

	u, ok := demoUsers[c.Username]
	if !ok || u.Password != c.Password {
		http.Error(w, "invalid credentials", 401)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, Claims{
		Username: c.Username,
		Role:     u.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	})

	t, _ := token.SignedString(jwtSecret)
	json.NewEncoder(w).Encode(map[string]string{
		"token": t,
		"role":  u.Role,
	})
}
