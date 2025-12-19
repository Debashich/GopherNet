package main

import (
	"fmt"
	"net/http"
)

func main() {

	broker = NewBroker()

	http.HandleFunc("/health", HealthHandler)
	http.HandleFunc("/publish", PublishHandler)
	http.HandleFunc("/events", GetEventsHandler)

	fmt.Println("GopherNet Broker running on :3000")
	http.ListenAndServe(":3000", nil)
}
