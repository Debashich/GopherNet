package store

import (
    "fmt"
    "sync"
    "time"
)

type MemoryStore struct {
    mu     sync.RWMutex
    events []Event
    nextID int
}

func NewMemoryStore() *MemoryStore {
    return &MemoryStore{
        events: []Event{},
        nextID: 1,
    }
}

func (m *MemoryStore) Save(e Event) error {
    m.mu.Lock()
    defer m.mu.Unlock()

    if e.ID == 0 {
        e.ID = m.nextID
        m.nextID++
    }

    m.events = append(m.events, e)
    return nil
}

func (m *MemoryStore) ListAll() ([]Event, error) {
    m.mu.RLock()
    defer m.mu.RUnlock()

    return m.events, nil
}

func (m *MemoryStore) ListByTopic(topic string) ([]Event, error) {
    m.mu.RLock()
    defer m.mu.RUnlock()

    var result []Event
    for _, e := range m.events {
        if e.Topic == topic {
            result = append(result, e)
        }
    }
    return result, nil
}

func (m *MemoryStore) ListAfter(topic string, afterID int) ([]Event, error) {
    m.mu.RLock()
    defer m.mu.RUnlock()

    var result []Event
    for _, e := range m.events {
        if (topic == "" || e.Topic == topic) && e.ID > afterID {
            result = append(result, e)
        }
    }
    return result, nil
}

func (m *MemoryStore) ListUnpublishedBefore(t time.Time) ([]Event, error) {
    m.mu.RLock()
    defer m.mu.RUnlock()

    var result []Event
    for _, e := range m.events {
        if !e.Published && !e.ScheduledAt.IsZero() && e.ScheduledAt.Before(t) {
            result = append(result, e)
        }
    }
    return result, nil
}

func (m *MemoryStore) MarkPublished(id int) error {
    m.mu.Lock()
    defer m.mu.Unlock()

    for i := range m.events {
        if m.events[i].ID == id {
            m.events[i].Published = true
            return nil
        }
    }
    return fmt.Errorf("event not found")
}

func (m *MemoryStore) Delete(topic, message string, scheduledAt time.Time) error {
    m.mu.Lock()
    defer m.mu.Unlock()

    for i, e := range m.events {
        if e.Topic == topic && e.Message == message && e.ScheduledAt.Equal(scheduledAt) {
            m.events = append(m.events[:i], m.events[i+1:]...)
            return nil
        }
    }
    return fmt.Errorf("event not found")
}

func (m *MemoryStore) DeleteByID(id int) error {
    m.mu.Lock()
    defer m.mu.Unlock()
    
    for i, e := range m.events {
        if e.ID == id {
            m.events = append(m.events[:i], m.events[i+1:]...)
            return nil
        }
    }
    return fmt.Errorf("event with ID %d not found", id)
}
