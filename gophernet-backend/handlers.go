package main

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HealthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func PublishHandler(b *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "missing authorization header", http.StatusUnauthorized)
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := ParseToken(tokenStr)
		if err != nil {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}
		if claims.Role != "admin" {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}



		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var e Event
		if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}

		b.AddEvent(e)
		w.WriteHeader(http.StatusCreated)
	}
}

//EVENTS HANDLER

func EventsHandler(b *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(b.GetEvents())
	}
}

//SUBSCRIPTIONS HANDLER

func SubscribeHandler(b *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {


		topic := r.URL.Query().Get("topic")
		if topic == "" {
			http.Error(w, "missing topic parameter", http.StatusBadRequest)
			return
		}



		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}

		b.AddSubscription(conn, topic)
		defer b.RemoveClient(conn)
		
		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				break
			}
		}
	}
}


// LOGIN HANDLER

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		Username string `json:"username"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	role := "user"
	if body.Username == "admin" {
		role = "admin"
	}

	token, err := GenerateToken(body.Username, role)
	if err != nil {
		http.Error(w, "could not generate token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	})

}