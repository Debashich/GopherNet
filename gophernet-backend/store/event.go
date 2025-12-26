package store

import "time"

type Event struct {
	ID        int       `json:"id"`
	Topic     string    `json:"topic"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}
