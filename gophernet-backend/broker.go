package main

import (
	"sync"
	"time"
	"github.com/gorilla/websocket"
)

type Event struct {
	Topic string `json:"topic"`
	Message string `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	ID        int       `json:"id"`
}

type Broker struct {
	mu sync.RWMutex
	store Store
	subscriptions map[*websocket.Conn][]string
	nextEventID int
}


func NewBroker(store Store) *Broker {
	return &Broker{
		store: store,
		subscriptions: make(map[*websocket.Conn][]string),
		nextEventID: 1,
	}
}


// EVENTS

func (b *Broker) AddEvent(e Event) {
	b.mu.Lock()
	defer b.mu.Unlock()
	
	e.Timestamp = time.Now()
	e.ID = b.nextEventID
	b.nextEventID++
	

	for conn, topics := range b.subscriptions {
		for _, topic := range topics {
			if topic == e.Topic {
				conn.WriteJSON(e)
				break
			}
		}
	}
}

func (b *Broker) GetEvents() []Event {
	b.mu.RLock()
	defer b.mu.RUnlock()

	events, _ := b.store.ListByTopic("")
	return events
}



func (b *Broker) GetEventsAfter(topic string, lastID int) []Event {
	events, err := b.store.ListAfter(topic, lastID)
	if err != nil {
		return []Event{}
	}
	return events
}

// SUBSCRIPTIONS

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