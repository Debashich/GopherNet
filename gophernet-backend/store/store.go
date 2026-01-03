package store

import "time"

type Store interface {
    Save(e Event) error
    ListAll() ([]Event, error)
    ListByTopic(topic string) ([]Event, error)
    ListAfter(topic string, afterID int) ([]Event, error)
    ListUnpublishedBefore(t time.Time) ([]Event, error)
    MarkPublished(id int) error
    Delete(topic, message string, scheduledAt time.Time) error
    DeleteByID(id int) error
}

type EventStore interface {
    Store
}
