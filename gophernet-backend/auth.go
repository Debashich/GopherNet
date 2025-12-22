package main

import(
	"errors"
	"time"
	"github.com/golang-jwt/jwt/v5"
)


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

