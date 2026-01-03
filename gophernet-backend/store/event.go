package store

import "time"

type Event struct {
    ID          int       `json:"id"`
    Topic       string    `json:"topic"`
    Message     string    `json:"message"`
    Timestamp   time.Time `json:"timestamp"`
    ScheduledAt time.Time `json:"scheduled_at"`
    Published   bool      `json:"published"`
    Lane        int       `json:"lane"`
}
