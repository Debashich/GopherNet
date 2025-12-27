package store

import (
	"fmt"
	"sync"
	"time"
)

type MemoryStore struct {
    events []Event
    mu     sync.Mutex
}

func NewMemoryStore() *MemoryStore {
    return &MemoryStore{events: []Event{}}
}

func (m *MemoryStore) Save(e Event) error {
    m.events = append(m.events, e)
    return nil
}

func (m *MemoryStore) ListByTopic(topic string) ([]Event, error) {
    return m.events, nil
}

func (m *MemoryStore) ListAfter(topic string, lastID int) ([]Event, error) {
    return m.events, nil
}

func (m *MemoryStore) ListAll() ([]Event, error) {
    return m.events, nil
}

func (m *MemoryStore) ListUnpublishedBefore(t time.Time) ([]Event, error) {
    var out []Event
    for _, e := range m.events {
        if !e.Published && !e.ScheduledAt.After(t) {
            out = append(out, e)
        }
    }
    return out, nil
}

func (m *MemoryStore) MarkPublished(id int) error {
    for i, e := range m.events {
        if e.ID == id {
            m.events[i].Published = true
            return nil
        }
    }
    return nil
}

func (m *MemoryStore) Delete(topic, message string, scheduledAt time.Time) error {
    m.mu.Lock()
    defer m.mu.Unlock()
    for i, e := range m.events {
        if e.Topic == topic && e.Message == message && e.ScheduledAt.Equal(scheduledAt) {
            // Remove the event from the slice
            m.events = append(m.events[:i], m.events[i+1:]...)
            return nil
        }
    }
    return fmt.Errorf("event not found")
}