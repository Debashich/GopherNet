package main

type Store interface {
	Save(event Event) error
	ListByTopic(topic string) ([]Event, error)
	ListAfter(topic string, lastID int) ([]Event, error)
}
