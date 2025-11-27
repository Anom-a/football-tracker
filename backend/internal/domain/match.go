package domain

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MatchEvent struct {
	Type      string    `json:"type" bson:"type"`
	Team      string    `json:"team" bson:"team"`
	Detail    string    `json:"detail" bson:"detail"`
	Timestamp time.Time `json:"timestamp" bson:"timestamp"`
}

type Match struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	TeamA     string             `json:"team_a" bson:"team_a"`
	TeamB     string             `json:"team_b" bson:"team_b"`
	ScoreA    int                `json:"score_a" bson:"score_a"`
	ScoreB    int                `json:"score_b" bson:"score_b"`
	Status    string             `json:"status" bson:"status"`
	StartTime *time.Time         `json:"start_time,omitempty" bson:"start_time,omitempty"`
	Events    []MatchEvent       `json:"events" bson:"events"`
}

// to connect to db defines how the usecase layer interacts with data storage
type MatchRepository interface {
	Create(ctx context.Context, match *Match) error
	Fetch(ctx context.Context) ([]Match, error)
	GetByID(ctx context.Context, id string) (*Match, error)
	UpdateStatus(ctx context.Context, id string, status string) (*Match, error)
	AddEvent(ctx context.Context, id string, event MatchEvent) (*Match, error)
}

// defines how real-time updates are send (in this case sse)
type EventStreamer interface {
	Notify(match Match)
	RegisterClient(clientChan chan Match)
	UnregisterClient(clientChan chan Match)
}

// business logic abstraction
type MatchUseCase interface {
	CreateMatch(ctx context.Context, teamA, teamB string) (*Match, error)
	GetMatches(ctx context.Context) ([]Match, error)
	StartMatch(ctx context.Context, id string) error
	AddMatchEvent(ctx context.Context, id string, eventType, team, detail string) (*Match, error)
}
