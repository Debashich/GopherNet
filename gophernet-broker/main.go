package main

import (
	"fmt"
	"net/http"
)

func main() {
	broker := NewBroker()

	http.HandleFunc("/health", HealthHandler)
	http.HandleFunc("/publish", PublishHandler(broker))
	http.HandleFunc("/events", GetEventsHandler(broker))

	fmt.Println("GopherNet Broker running on :3000")
	http.ListenAndServe(":3000", nil)
}
