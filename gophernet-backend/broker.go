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
}

type Broker struct {
	mu sync.RWMutex
	store Store
	subscriptions map[*websocket.Conn][]string
}


func NewBroker(store Store) *Broker {
	return &Broker{
		store: store,
		subscriptions: make(map[*websocket.Conn][]string),
	}
}


// EVENTS

func (b *Broker) AddEvent(e Event) {
	b.mu.Lock()
	defer b.mu.Unlock()
	


	_=b.store.Save(e)
	e.Timestamp = time.Now()
	

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