package main

import (
	"encoding/json"
	"net/http"
	"os"
	"sort"
	"strings"
	"time"

	"github.com/Debashich/GopherNet/gophernet-backend/store"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// PUBLISH HANDLER
func PublishHandler(b *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var e store.Event
		if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}
		now := time.Now()
		if e.ScheduledAt.IsZero() || e.ScheduledAt.Before(now) {
			// Only set timestamp to now for immediate events
			e.Timestamp = now
			e.Published = true
			b.Publish(e)
		} else {
			// For scheduled events, keep the timestamp provided
			e.Published = false
			b.store.Save(e)
		}

		w.WriteHeader(201)
	}
}

func DeleteEventHandler(b *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Topic       string    `json:"topic"`
			Message     string    `json:"message"`
			ScheduledAt time.Time `json:"scheduled_at"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}

		// Try to delete the event from the store
		err := b.store.Delete(req.Topic, req.Message, req.ScheduledAt)
		if err != nil {
			http.Error(w, "event not found or could not be deleted", http.StatusNotFound)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
	}
}

// assignLanes assigns a lane number to each event based on scheduled_at/timestamp (no overlap in a lane)
func assignLanes(events []store.Event) []store.Event {
	// Sort events by scheduled_at or timestamp
	sort.Slice(events, func(i, j int) bool {
		ti := events[i].ScheduledAt
		if ti.IsZero() {
			ti = events[i].Timestamp
		}
		tj := events[j].ScheduledAt
		if tj.IsZero() {
			tj = events[j].Timestamp
		}
		return ti.Before(tj)
	})

	type lane struct {
		events []store.Event
		end    time.Time
	}
	var lanes []lane

	for i := range events {
		ev := &events[i]
		evTime := ev.ScheduledAt
		if evTime.IsZero() {
			evTime = ev.Timestamp
		}
		placed := false
		for lidx := range lanes {
			if !evTime.Before(lanes[lidx].end) {
				ev.Lane = lidx
				lanes[lidx].events = append(lanes[lidx].events, *ev)
				lanes[lidx].end = evTime
				placed = true
				break
			}
		}
		if !placed {
			ev.Lane = len(lanes)
			lanes = append(lanes, lane{
				events: []store.Event{*ev},
				end:    evTime,
			})
		}
	}
	return events
}

// EventsHandler - Get last N events, assign lanes
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
		events = events[start:]

		// Assign lanes
		events = assignLanes(events)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(events)
	}
}

//SUBSCRIPTIONS HANDLER

func SubscribeHandler(b *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		topic := r.URL.Query().Get("topic")
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
