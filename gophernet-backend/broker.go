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
	mu     sync.RWMutex
	events []Event
}




func NewBroker() *Broker {
	return &Broker{
		events: make([]Event, 0),
	}
}

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
