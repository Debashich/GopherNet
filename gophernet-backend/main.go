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

func main() {
    godotenv.Load()

    memStore := store.NewMemoryStore()
    broker := NewBroker(memStore)

    go func() {
        for {
            events, err := broker.store.ListUnpublishedBefore(time.Now())
            if err == nil {
                for _, e := range events {
                    broker.Emit(e)
                }
            }
            time.Sleep(1 * time.Second)
        }
    }()

    mux := http.NewServeMux()
    mux.HandleFunc("/health", HealthHandler)
    mux.HandleFunc("/info", InfoHandler)
    mux.HandleFunc("/login", LoginHandler)
    mux.Handle("/publish", AuthMiddleware("admin")(PublishHandler(broker)))
    mux.HandleFunc("/subscribe", SubscribeHandler(broker))

    mux.HandleFunc("/events", func(w http.ResponseWriter, r *http.Request) {
        log.Printf("Request: %s %s", r.Method, r.URL.Path)
        if r.Method == "GET" {
            EventsHandler(broker).ServeHTTP(w, r)
        } else {
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        }
    })

    mux.HandleFunc("/events/", func(w http.ResponseWriter, r *http.Request) {
        log.Printf("Request: %s %s", r.Method, r.URL.Path)
        
        if r.Method == "DELETE" {
            AuthMiddleware("admin")(DeleteEventHandler(broker)).ServeHTTP(w, r)
        } else {
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        }
    })

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
