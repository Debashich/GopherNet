package main

import "sync"

type MemoryStore struct {
	mu sync.RWMutex
	events []Event
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		events: make([]Event, 0),
	}
}

func (m *MemoryStore) Save(event Event) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.events = append(m.events, event)
	return nil
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
