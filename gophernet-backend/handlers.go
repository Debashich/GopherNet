package main

import (
	"fmt"
	"encoding/json"
	"net/http"
)

var broker *Broker

func HealthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func PublishHandler(b *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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


		subscribers := b.GetSubscribers(e.Topic)
		fmt.Printf(
			"Notifying %d subscriber(s) for topic %s\n",
			len(subscribers),
			e.Topic,
		)





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

type SubscribeRequest struct {
	Topic  string `json:"topic"`
	UserID string `json:"user_id"`
}

func SubscribeHandler(b *Broker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req SubscribeRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}

		if req.Topic == "" || req.UserID == "" {
			http.Error(w, "missing topic or user_id", http.StatusBadRequest)
			return
		}

		b.Subscribe(req.Topic, req.UserID)

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("subscribed successfully"))
	}
}