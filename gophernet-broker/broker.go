package main

import "sync"

type Event struct {
	Topic   string `json:"topic"`
	Message string `json:"message"`
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
	b.events = append(b.events, e)
}

func (b *Broker) GetEvents() []Event {
	b.mu.RLock()
	defer b.mu.RUnlock()
	return b.events
}
