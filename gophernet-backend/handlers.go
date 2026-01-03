package main

import (
    "encoding/json"
    "log"
    "net/http"
    "os"
    "sort"
    "strconv"
    "strings"
    "time"

    "github.com/Debashich/GopherNet/gophernet-backend/store"
    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

// PUBLISH HANDLER
func PublishHandler(b *Broker) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {

        var e store.Event
        if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
            http.Error(w, "invalid JSON", http.StatusBadRequest)
            return
        }
        now := time.Now()
        if e.ScheduledAt.IsZero() || e.ScheduledAt.Before(now) {
            e.Timestamp = now
            e.Published = true
            b.Publish(e)
        } else {
            e.Published = false
            b.store.Save(e)
        }

        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(201)
        json.NewEncoder(w).Encode(map[string]interface{}{
            "status": "created",
            "id":     e.ID,
            "event":  e,
        })
    }
}

func DeleteEventHandler(b *Broker) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Println("🔴 DeleteEventHandler START")
        
        path := r.URL.Path
        log.Println("Path:", path)
        
        parts := strings.Split(path, "/")
        log.Println("Parts:", parts)
        
        if len(parts) < 3 || parts[len(parts)-1] == "" {
            log.Println("❌ Error: event ID required")
            http.Error(w, "event ID required in URL", http.StatusBadRequest)
            return
        }
        
        eventIDStr := parts[len(parts)-1]
        log.Println("Event ID string:", eventIDStr)
        
        eventID, err := strconv.Atoi(eventIDStr)
        if err != nil {
            log.Println("❌ Error converting ID:", err)
            http.Error(w, "invalid event ID", http.StatusBadRequest)
            return
        }
        
        log.Println("🔍 Attempting to delete event ID:", eventID)
        
        err = b.store.DeleteByID(eventID)
        if err != nil {
            log.Println("❌ Error from store.DeleteByID:", err)
            http.Error(w, err.Error(), http.StatusNotFound)
            return
        }

        log.Println("✅ Successfully deleted event ID:", eventID)
        
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]interface{}{
            "status": "deleted",
            "id":     eventID,
        })
        
        log.Println("✅ Response sent successfully")
    }
}

func assignLanes(events []store.Event) []store.Event {
    sort.Slice(events, func(i, j int) bool {
        ti := events[i].ScheduledAt
        if ti.IsZero() {
            ti = events[i].Timestamp
        }
        tj := events[j].ScheduledAt
        if tj.IsZero() {
            tj = events[j].Timestamp
        }
        return ti.Before(tj)
    })

    type lane struct {
        events []store.Event
        end    time.Time
    }
    var lanes []lane

    for i := range events {
        ev := &events[i]
        evTime := ev.ScheduledAt
        if evTime.IsZero() {
            evTime = ev.Timestamp
        }
        placed := false
        for lidx := range lanes {
            if !evTime.Before(lanes[lidx].end) {
                ev.Lane = lidx
                lanes[lidx].events = append(lanes[lidx].events, *ev)
                lanes[lidx].end = evTime
                placed = true
                break
            }
        }
        if !placed {
            ev.Lane = len(lanes)
            lanes = append(lanes, lane{
                events: []store.Event{*ev},
                end:    evTime,
            })
        }
    }
    return events
}

func EventsHandler(b *Broker) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        topic := r.URL.Query().Get("topic")
        limit := 10

        allEvents, err := b.store.ListAll()
        if err != nil {
            http.Error(w, "failed to fetch events", 500)
            return
        }

        var events []store.Event
        for _, e := range allEvents {
            if topic == "" || e.Topic == topic {
                events = append(events, e)
            }
        }

        start := 0
        if len(events) > limit {
            start = len(events) - limit
        }
        events = events[start:]

        events = assignLanes(events)

        // Always return an array, even if empty
        if events == nil {
            events = []store.Event{}
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(events)
    }
}

func SubscribeHandler(b *Broker) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {

        topic := r.URL.Query().Get("topic")
        conn, err := upgrader.Upgrade(w, r, nil)
        if err != nil {
            return
        }
        b.AddSubscription(conn, topic)
        defer b.RemoveClient(conn)

        for {
            if _, _, err := conn.ReadMessage(); err != nil {
                break
            }
        }
    }
}

func CORSMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        origin := r.Header.Get("Origin")
        allowed := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")

        for _, o := range allowed {
            if origin == strings.TrimSpace(o) {
                w.Header().Set("Access-Control-Allow-Origin", origin)
                break
            }
        }

        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}

func HealthHandler(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(200)
    json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func InfoHandler(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(map[string]string{
        "version": os.Getenv("VERSION"),
        "service": "GopherNet Broker",
    })
}
