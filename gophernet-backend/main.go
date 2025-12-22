package main

import (
	"fmt"
	"net/http"

)

func main() {

	broker := NewBroker()

	http.HandleFunc("/health", HealthHandler)

	http.HandleFunc("/login", LoginHandler)

	http.HandleFunc("/publish", PublishHandler(broker))
	http.HandleFunc("/events", EventsHandler(broker))
	http.HandleFunc("/subscribe", SubscribeHandler(broker))


	
	fmt.Println("GopherNet Broker running on : 3000")
	http.ListenAndServe(":3000", nil)
}
