package store

type MemoryStore struct {
	events []Event
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{events: []Event{}}
}

func (m *MemoryStore) Save(e Event) error {
	m.events = append(m.events, e)
	return nil
}

func (m *MemoryStore) ListByTopic(topic string) ([]Event, error) {
	var out []Event
	for _, e := range m.events {
		if topic == "" || e.Topic == topic {
			out = append(out, e)
		}
	}
	return out, nil
}

func (m *MemoryStore) ListAfter(topic string, lastID int) ([]Event, error) {
	var out []Event
	for _, e := range m.events {
		if e.Topic == topic && e.ID > lastID {
			out = append(out, e)
		}
	}
	return out, nil
}
