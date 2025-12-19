package main

import (
	"encoding/json"
	"net/http"
)

var broker *Broker

func HealthHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("OK"))
}

func PublishHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var e Event
	err := json.NewDecoder(r.Body).Decode(&e)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	broker.events = append(broker.events, e)
	w.WriteHeader(http.StatusCreated)
}

func GetEventsHandler(w http.ResponseWriter, r *http.Request) {

	topic := r.URL.Query().Get("topic")

	// If no topic, return all events
	if topic == "" {
		json.NewEncoder(w).Encode(broker.events)
		return
	}

	// Filter by topic
	var filtered []Event
	for _, e := range broker.events {
		if e.Topic == topic {
			filtered = append(filtered, e)
		}
	}

	json.NewEncoder(w).Encode(filtered)
}
