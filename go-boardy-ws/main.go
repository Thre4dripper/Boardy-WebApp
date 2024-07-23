package main

import (
	"fmt"
	"net/http"
	"os"
	"sync"

	"github.com/gorilla/websocket"
	jsoniter "github.com/json-iterator/go"
	"encoding/json"
)

type Message struct {
	UserId   string `json:"userId"`
	UserName string `json:"userName"`
	Payload  json.RawMessage `json:"payload"`
	SocketId string `json:"socketId"`
}

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // Allow connections from any origin
		},
	}
	clients   = make(map[*websocket.Conn]bool) // Connected clients
	broadcast = make(chan Message)             // Broadcast channel
	mu        sync.Mutex                       // Mutex to protect clients
)

func echo(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil) // Upgrade the HTTP server connection to a WebSocket connection
	if err != nil {
		fmt.Println("Error upgrading to WebSocket:", err)
		return
	}
	defer conn.Close()

	// Register new client
	mu.Lock()
	clients[conn] = true
	mu.Unlock()

	for {
		_, message, err := conn.ReadMessage() // Read message from client
		if err != nil {
			fmt.Println("Error reading message:", err)
			mu.Lock()
			delete(clients, conn) // Remove client on error
			mu.Unlock()
			break
		}
		fmt.Printf("Received message: %s\n", message)

		var msg Message
		err = jsoniter.Unmarshal(message, &msg)
		if err != nil {
			fmt.Println("Error unmarshalling message:", err)
			continue
		}
		msg.SocketId = conn.RemoteAddr().String()
		broadcast <- msg // Send message to the broadcast channel
	}
}

func handleMessages() {
	for {
		message := <-broadcast // Read from the broadcast channel
		messageBytes, err := jsoniter.Marshal(message)
		if err != nil {
			fmt.Println("Error marshalling message:", err)
			continue
		}

		mu.Lock()
		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, messageBytes) // Send message to every client
			if err != nil {
				fmt.Println("Error writing message:", err)
				client.Close()
				delete(clients, client)
			}
		}
		mu.Unlock()
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not specified
	}

	http.HandleFunc("/", echo) // Set the route handler for the WebSocket connection
	go handleMessages()            // Start handling messages in a goroutine
	fmt.Printf("WebSocket server started on :%s\n", port)
	err := http.ListenAndServe(":"+port, nil) // Start the server on the specified port
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
