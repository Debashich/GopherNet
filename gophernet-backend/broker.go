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
	events []Event
	subscriptions map[*websocket.Conn][]string
}


func NewBroker() *Broker {
	return &Broker{
		events: make([]Event, 0),
		subscriptions: make(map[*websocket.Conn][]string),
	}
}


// EVENTS

func (b *Broker) AddEvent(e Event) {
	b.mu.Lock()
	defer b.mu.Unlock()
	
	e.Timestamp = time.Now()
	b.events = append(b.events, e)

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

	return b.events
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