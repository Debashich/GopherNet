package main

import (
	"fmt"
	"net/http"

	"github.com/Debashich/GopherNet/gophernet-backend/store"
)

func main() {
	memStore := store.NewMemoryStore() // ✅ FIX
	broker := NewBroker(memStore)

	http.HandleFunc("/health", HealthHandler)
	http.HandleFunc("/login", LoginHandler)

	http.Handle(
		"/publish",
		AuthMiddleware("admin", "publisher")(PublishHandler(broker)),
	)

	http.HandleFunc("/subscribe", SubscribeHandler(broker))

	fmt.Println("GopherNet Broker running on :3000")
	http.ListenAndServe(":3000", nil)
}
