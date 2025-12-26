package main

import (
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/Debashich/GopherNet/gophernet-backend/store"
)

// type Event struct {
// 	ID        int       `json:"id"`
// 	Topic     string    `json:"topic"`
// 	Message   string    `json:"message"`
// 	Timestamp time.Time `json:"timestamp"`
// }

type Broker struct {
	mu            sync.RWMutex
	store         store.Store
	subscribers   map[*websocket.Conn]string
	nextEventID   int
}

func NewBroker(s store.Store) *Broker {
	return &Broker{
		store:         s,
		subscribers:   make(map[*websocket.Conn]string),
		nextEventID:   1,
	}
}

func (b *Broker) Publish(e store.Event) {
	// b.store.Save(e)
	b.mu.Lock()
	defer b.mu.Unlock() 

	e.ID = b.nextEventID
	e.Timestamp = time.Now()
	b.nextEventID++


	b.store.Save(e)

	for conn, topic := range b.subscribers {
		// for _, topic := range topics {
		if topic == e.Topic {
			conn.WriteJSON(e)
		}
		//}
	}
	
	// // convert to store.Event
	// b.store.Save(store.Event{
	// 	ID:        e.ID,
	// 	Topic:     e.Topic,
	// 	Message:   e.Message,
	// 	Timestamp: e.Timestamp,
	// })

	
}

// func (b *Broker) GetAllEvents() []Event {
// 	b.mu.RLock()
// 	defer b.mu.RUnlock()

// 	events, _ := b.store.ListByTopic("")
// 	return events
// }


func (b *Broker) GetEventsAfter(topic string, lastID int) []store.Event {
events, _ := b.store.ListAfter(topic, lastID)

// 	var out []Event
// 	for _, e := range stored {
// 		out = append(out, Event{
// 			ID:        e.ID,
// 			Topic:     e.Topic,
// 			Message:   e.Message,
// 			Timestamp: e.Timestamp,
// 		})
// 	}
return events
}

func (b *Broker) AddSubscription(conn *websocket.Conn, topic string) {
	b.mu.Lock()
	b.subscribers[conn] = topic
	b.mu.Unlock()
}

func (b *Broker) RemoveClient(conn *websocket.Conn) {
	b.mu.Lock()
	delete(b.subscribers, conn)
	b.mu.Unlock()
}
