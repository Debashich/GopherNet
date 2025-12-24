package store

import "time"

type Event struct {
	ID        int
	Topic     string
	Message   string
	Timestamp time.Time
}

type Store interface {
	Save(event Event) error
	ListByTopic(topic string) ([]Event, error)
	ListAfter(topic string, lastID int) ([]Event, error)
}
