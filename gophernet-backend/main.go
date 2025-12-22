package main

import (
	"fmt"
	"net/http"

)

func main() {


	store := NewMemoryStore()
	broker := NewBroker(store)

	http.HandleFunc("/health", HealthHandler)

	http.HandleFunc("/login", LoginHandler)

	http.Handle("/publish", 
	AuthMiddleware("admin", "publisher")(PublishHandler(broker)))



	http.HandleFunc("/events", EventsHandler(broker))
	http.HandleFunc("/subscribe", SubscribeHandler(broker))


	
	fmt.Println("GopherNet Broker running on : 3000")
	http.ListenAndServe(":3000", nil)
}
