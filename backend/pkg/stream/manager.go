package stream

import (
	"football-tracker/internal/domain"
	"log"
	"sync"
)

// handles real-time event broadcasting to all connected client using the concept of brokers

type Manager struct {
	// Events are pushed to this channel
	message      chan domain.Match // carries live match updates
	newClients   chan chan domain.Match // register a new client
	closedClients chan chan domain.Match // when an sse client disconnects
	totalClients map[chan domain.Match]bool
	sync.RWMutex
}

func NewStreamManager() *Manager {
	m := &Manager{
		message:       make(chan domain.Match),
		newClients:    make(chan chan domain.Match),
		closedClients: make(chan chan domain.Match),
		totalClients:  make(map[chan domain.Match]bool),
	}
	go m.listen()
	return m
}

func (m *Manager) listen() {
	for {
		select {
		case client := <-m.newClients:
			m.Lock()
			m.totalClients[client] = true
			m.Unlock()
			log.Printf("Client connected. Total: %d", len(m.totalClients))
		case client := <-m.closedClients:
			m.Lock()
			delete(m.totalClients, client)
			close(client)
			m.Unlock()
			log.Printf("Client disconnected. Total: %d", len(m.totalClients))
		case eventMsg := <-m.message:
			m.RLock()
			for clientChan := range m.totalClients {
				select {
				case clientChan <- eventMsg:
				default:
					// Avoid blocking if client is stuck
				}
			}
			m.RUnlock()
		}
	}
}

// Implement domain.EventStreamer interface
func (m *Manager) Notify(match domain.Match) {
	m.message <- match
}

func (m *Manager) RegisterClient(clientChan chan domain.Match) {
	m.newClients <- clientChan
}

func (m *Manager) UnregisterClient(clientChan chan domain.Match) {
	m.closedClients <- clientChan
}