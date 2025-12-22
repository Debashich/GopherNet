package main

type Store interface {
	Save(event Event) error
	ListByTopic(topic string) ([]Event, error)
}
