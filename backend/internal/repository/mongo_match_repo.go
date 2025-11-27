package repository

import (
	"context"
	"football-tracker/internal/domain"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// other layers like usecases an ddelivery depend on this module
// stores and retrieves match data
type mongoMatchRepo struct {
	db *mongo.Collection
}

func NewMongoMatchRepo(db *mongo.Database) domain.MatchRepository {
	return &mongoMatchRepo{
		db: db.Collection("matches"),
	}
}

func (r *mongoMatchRepo) Create(ctx context.Context, match *domain.Match) error {
	match.ID = primitive.NewObjectID() // generate unique id
	_, err := r.db.InsertOne(ctx, match)
	return err
}

func (r *mongoMatchRepo) Fetch(ctx context.Context) ([]domain.Match, error) {
	cursor, err := r.db.Find(ctx, bson.M{"status": bson.M{"$ne": "finished"}}) //ne == not equal
	if err != nil {
		return nil, err
	}
	var matches []domain.Match
	// cursor.All() decodes all db results into matches
	if err = cursor.All(ctx, &matches); err != nil {
		return nil, err
	}
	return matches, nil
}

// to get specific matches
func (r *mongoMatchRepo) GetByID(ctx context.Context, id string) (*domain.Match, error) {
	objID, _ := primitive.ObjectIDFromHex(id) // must be converted from hex string to object id
	var match domain.Match
	err := r.db.FindOne(ctx, bson.M{"_id": objID}).Decode(&match)
	if err != nil {
		return nil, err
	}
	return &match, err
}

func (r *mongoMatchRepo) UpdateStatus(ctx context.Context, id string, status string) (*domain.Match, error) {
	objID, _ := primitive.ObjectIDFromHex(id)
	// creates $set update document
	setFields := bson.M{"status": status}

	// If status is "live", also set the start time
	if status == "live" {
		now := time.Now()
		setFields["start_time"] = now
	}

	update := bson.M{"$set": setFields}

	// FindOneAndUpdate returns the document *after* update if ReturnDocument is set to After
	// But for simplicity, we update then fetch
	_, err := r.db.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		return nil, err
	}
	return r.GetByID(ctx, id)
}

func (r *mongoMatchRepo) AddEvent(ctx context.Context, id string, event domain.MatchEvent) (*domain.Match, error) {
	objID, _ := primitive.ObjectIDFromHex(id)
	update := bson.M{"$push": bson.M{"events": event}}
	if event.Type == "goal" {
		if event.Team == "A" {
			update["$inc"] = bson.M{"score_a": 1}
		} else {
			update["$inc"] = bson.M{"score_b": 1}
		}
	}

	_, err := r.db.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		return nil, err
	}
	return r.GetByID(ctx, id)
}
