package main

import (
	"net/http"
	"strings"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(allowedRoles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			h := r.Header.Get("Authorization")
			if !strings.HasPrefix(h, "Bearer ") {
				http.Error(w, "Unauthorized", 401)
				return
			}

			tkn := strings.TrimPrefix(h, "Bearer ")
			token, err := jwt.Parse(tkn, func(t *jwt.Token) (interface{}, error) {
				return jwtSecret, nil
			})

			if err != nil || !token.Valid{
				http.Error(w, "invalid token", 401)
				return
			}

			claims := token.Claims.(jwt.MapClaims)
			role := claims["role"].(string)


			for _, allowed := range allowedRoles {
				if role == allowed {
					next.ServeHTTP(w, r)
					return
				}
			}

			http.Error(w, "forbidden", 403)
		})
	}
}
