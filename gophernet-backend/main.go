package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Debashich/GopherNet/gophernet-backend/store"
	"github.com/joho/godotenv"
)

// Temporary MemoryStore
type MemoryStore struct {
	events []store.Event
}

func (m *MemoryStore) Save(e store.Event) error {
	m.events = append(m.events, e)
	return nil
}

func (m *MemoryStore) ListByTopic(topic string) ([]store.Event, error) {
	return m.events, nil
}

func (m *MemoryStore) ListAfter(topic string, lastID int) ([]store.Event, error) {
	return m.events, nil
}

func (m *MemoryStore) ListAll() ([]store.Event, error) {
	return m.events, nil
}

func main() {
	godotenv.Load()

	// Use memory store instead of MySQL
	memStore := &MemoryStore{events: []store.Event{}}
	broker := NewBroker(memStore)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", HealthHandler)
	mux.HandleFunc("/info", InfoHandler)
	mux.HandleFunc("/login", LoginHandler)
	mux.Handle(
		"/publish",
		AuthMiddleware("admin")(PublishHandler(broker)),
	)
	mux.HandleFunc("/subscribe", SubscribeHandler(broker))
	mux.HandleFunc("/events", EventsHandler(broker))

	handler := CORSMiddleware(mux)

	server := &http.Server{
		Addr:    ":3000",
		Handler: handler,
	}

	go func() {
		sigint := make(chan os.Signal, 1)
		signal.Notify(sigint, os.Interrupt, syscall.SIGTERM)
		<-sigint

		log.Println("Shutting down gracefully...")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := server.Shutdown(ctx); err != nil {
			log.Fatal("Server shutdown error:", err)
		}
	}()

	fmt.Println("GopherNet Broker running on :3000")
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatalf("ListenAndServe error: %v", err)
	}
}
