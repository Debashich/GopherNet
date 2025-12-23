package main

import(
	"encoding/json"
	"errors"
	"time"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
)


var demoUsers = map[string]struct {
	Password string
	Role     string
}{
	"admin":{
		Password: "admin123",
		Role: "admin",
	},
	"user":{
		Password: "user123",
		Role: "user",
	},
}




var jwtSecret = []byte("gophernet-secret")

type Claims struct{
	Username string `json:"username"`
	Role string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(username, role string) (string, error){
	claims := Claims{
		Username: username,
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}


func ParseToken(tokenStr string) (*Claims, error){
	token, err := jwt.ParseWithClaims(
		tokenStr,
		&Claims{},
		func(token *jwt.Token) (interface{}, error){
			return jwtSecret, nil
		},
	)

	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	return claims, nil
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var creds struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	user, ok := demoUsers[creds.Username]
	if !ok || user.Password != creds.Password {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := GenerateToken(creds.Username, user.Role)
	if err != nil {
		http.Error(w, "failed to generate token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
		"role":  user.Role,
	})
}