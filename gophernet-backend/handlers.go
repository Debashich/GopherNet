package main

import (
	"encoding/json"
	
	"net/http"
	"os"
	// "strconv"
	"strings"
	"github.com/gorilla/websocket"
	"github.com/Debashich/GopherNet/gophernet-backend/store"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// func HealthHandler(w http.ResponseWriter, r *http.Request) {
// 	w.WriteHeader(http.StatusOK)
// 	w.Write([]byte("OK"))
// }


// PUBLISH HANDLER
func PublishHandler(b *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// authHeader := r.Header.Get("Authorization")
		// if authHeader == "" {
		// 	http.Error(w, "missing authorization header", http.StatusUnauthorized)
		// 	return
		// }

		// tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		// claims, err := ParseToken(tokenStr)
		// if err != nil {
		// 	http.Error(w, "invalid token", http.StatusUnauthorized)
		// 	return
		// }
		// if claims.Role != "admin" {
		// 	http.Error(w, "forbidden", http.StatusForbidden)
		// 	return
		// }

		// if r.Method != http.MethodPost {
		// 	http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		// 	return
		// }

		var e store.Event
		json.NewDecoder(r.Body).Decode(&e)

		b.Publish(e)
		w.WriteHeader(201)
	}
}

// //EVENTS HANDLER

// func EventsHandler(b *Broker) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		w.Header().Set("Content-Type", "application/json")
// 		json.NewEncoder(w).Encode(b.GetEvents())
// 	}
// }

// EventsHandler - Get last N events
func EventsHandler(b *Broker) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        topic := r.URL.Query().Get("topic")
        limit := 10
        
        // Use ListAll and filter by topic
        allEvents, err := b.store.ListAll()
        if err != nil {
            http.Error(w, "failed to fetch events", 500)
            return
        }
        
        // Filter by topic if specified
        var events []store.Event
        for _, e := range allEvents {
            if topic == "" || e.Topic == topic {
                events = append(events, e)
            }
        }
        
        // Return last N events
        start := 0
        if len(events) > limit {
            start = len(events) - limit
        }
        
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(events[start:])
    }
}
//SUBSCRIPTIONS HANDLER

func SubscribeHandler(b *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		topic := r.URL.Query().Get("topic")
		// lastID, _ := strconv.Atoi(r.URL.Query().Get("offset"))

		// if topic == "" {
		// 	http.Error(w, "missing topic parameter", http.StatusBadRequest)
		// 	return
		// }

		// lastID := 0
		// if offsetStr != "" {
		// 	fmt.Sscanf(offsetStr, "%d", &lastID)
		// }

		conn, err := upgrader.Upgrade(w, r, nil)
		if err !=nil{
			return 
		}
		
		// past, _ := b.store.ListAfter(topic, lastID)
		// for _, e := range past {
		// 	conn.WriteJSON(e)
		// }

		// pastEvents := b.GetEventsAfter(topic, lastID)
		// for _, e := range pastEvents {
		// 	conn.WriteJSON(e)
		// }

		b.AddSubscription(conn, topic)
		defer b.RemoveClient(conn)

		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				break
			}
		}
	}
}


// CORS Middleware
func CORSMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        origin := r.Header.Get("Origin")
        allowed := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")
        
        for _, o := range allowed {
            if origin == strings.TrimSpace(o) {
                w.Header().Set("Access-Control-Allow-Origin", origin)
                break
            }
        }
        
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        next.ServeHTTP(w, r)
    })
}

// Health endpoint
func HealthHandler(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(200)
    json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// Info endpoint
func InfoHandler(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(map[string]string{
        "version": os.Getenv("VERSION"),
        "service": "GopherNet Broker",
    })
}
// LOGIN HANDLER

// func LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}

// 	var body struct {
// 		Username string `json:"username"`
// 	}

// 	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
// 		http.Error(w, "invalid JSON", http.StatusBadRequest)
// 		return
// 	}

// 	role := "user"
// 	if body.Username == "admin" {
// 		role = "admin"
// 	}

// 	token, err := GenerateToken(body.Username, role)
// 	if err != nil {
// 		http.Error(w, "could not generate token", http.StatusInternalServerError)
// 		return
// 	}

// 	json.NewEncoder(w).Encode(map[string]string{
// 		"token": token,
// 	})

// }
