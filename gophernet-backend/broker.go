package main

import (
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/Debashich/GopherNet/gophernet-backend/store"
)

type Event struct {
	ID        int       `json:"id"`
	Topic     string    `json:"topic"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

type Broker struct {
	mu            sync.RWMutex
	store         store.Store
	subscriptions map[*websocket.Conn][]string
	nextEventID   int
}

func NewBroker(s store.Store) *Broker {
	return &Broker{
		store:         s,
		subscriptions: make(map[*websocket.Conn][]string),
		nextEventID:   1,
	}
}

func (b *Broker) AddEvent(e Event) {
	b.mu.Lock()
	defer b.mu.Unlock() // ✅ FIX

	e.ID = b.nextEventID
	e.Timestamp = time.Now()
	b.nextEventID++

	// convert to store.Event
	b.store.Save(store.Event{
		ID:        e.ID,
		Topic:     e.Topic,
		Message:   e.Message,
		Timestamp: e.Timestamp,
	})

	for conn, topics := range b.subscriptions {
		for _, topic := range topics {
			if topic == e.Topic {
				conn.WriteJSON(e)
			}
		}
	}
}

// func (b *Broker) GetAllEvents() []Event {
// 	b.mu.RLock()
// 	defer b.mu.RUnlock()

// 	events, _ := b.store.ListByTopic("")
// 	return events
// }


func (b *Broker) GetEventsAfter(topic string, lastID int) []Event {
	stored, _ := b.store.ListAfter(topic, lastID)

	var out []Event
	for _, e := range stored {
		out = append(out, Event{
			ID:        e.ID,
			Topic:     e.Topic,
			Message:   e.Message,
			Timestamp: e.Timestamp,
		})
	}
	return out
}

func (b *Broker) AddSubscription(conn *websocket.Conn, topic string) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.subscriptions[conn] = append(b.subscriptions[conn], topic)
}

func (b *Broker) RemoveClient(conn *websocket.Conn) {
	b.mu.Lock()
	defer b.mu.Unlock()
	delete(b.subscriptions, conn)
}
