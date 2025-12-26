package store

type Store interface {
	Save(e Event) error
	ListByTopic(topic string) ([]Event, error)
	ListAfter(topic string, lastID int) ([]Event, error)
	ListAll() ([]Event, error)
}
