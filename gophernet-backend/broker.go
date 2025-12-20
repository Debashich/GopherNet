package main

import (
	"sync"
	"time"
)

type Event struct {
	Topic string `json:"topic"`
	Message string `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

type Broker struct {
	mu sync.RWMutex
	events []Event
	subscriptions map[string][]string
}


func NewBroker() *Broker {
	return &Broker{
		events: make([]Event, 0),
		subscriptions: make(map[string][]string),
	}
}


// EVENTS

func (b *Broker) AddEvent(e Event) {
	b.mu.Lock()
	defer b.mu.Unlock()

	e.Timestamp = time.Now()
	b.events = append(b.events, e)
}

func (b *Broker) GetEvents() []Event {
	b.mu.RLock()
	defer b.mu.RUnlock()

	return b.events
}

// SUBSCRIPTIONS

func (b *Broker) Subscribe(topic string, userID string) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.subscriptions[topic] = append(b.subscriptions[topic], userID)
}

func (b *Broker) GetSubscribers(topic string) []string {
	b.mu.RLock()
	defer b.mu.RUnlock()
	return b.subscriptions[topic]
}
