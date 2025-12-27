package store
import "time"

type Store interface {
	Save(e Event) error
	ListByTopic(topic string) ([]Event, error)
	ListAfter(topic string, lastID int) ([]Event, error)
	ListAll() ([]Event, error)
	ListUnpublishedBefore(t time.Time) ([]Event, error)
	MarkPublished(id int) error
	Delete(topic, message string, scheduledAt time.Time) error
}
