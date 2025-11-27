package main

import (
	"context"
	"football-tracker/internal/delivery/http"
	"football-tracker/internal/repository"
	"football-tracker/internal/usecase"
	"football-tracker/pkg/stream"
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Load .env file from backend root directory (where go.mod is)
	// This allows .env to be in the backend/ directory instead of cmd/
	// Try multiple locations in order of preference
	envPaths := []string{
		"../.env",    // Backend root when running from cmd/ directory
		".env",       // Current directory
		"../../.env", // Project root as fallback
	}

	var loaded bool
	for _, envPath := range envPaths {
		if err := godotenv.Load(envPath); err == nil {
			loaded = true
			break
		}
	}

	if !loaded {
		log.Println("Warning: .env file not found in any of the expected locations, using system environment variables")
	}

	// 1. Setup Database Connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get MongoDB connection string from environment
	mongoURI := os.Getenv("MONGODB_URI")

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	// Verify connection
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}
	log.Println("Successfully connected to MongoDB")

	// Get database name from env or use default
	dbName := os.Getenv("MONGODB_DATABASE")
	if dbName == "" {
		dbName = "football_db"
	}
	db := client.Database(dbName)
	// 2. Initialize Infrastructure
	streamManager := stream.NewStreamManager()

	// 3. Initialize Repository (Data Access)
	matchRepo := repository.NewMongoMatchRepo(db)

	// 4. Initialize UseCase (Business Logic)
	// Inject Repo and StreamManager into UseCase
	matchUC := usecase.NewMatchUseCase(matchRepo, streamManager, 2*time.Second)

	// 5. Initialize Delivery (HTTP Router)
	r := gin.Default()

	// Setup CORS - Allow all origins for development (can be restricted in production)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Allow all origins for network access
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false, // Set to false when using wildcard origin
	}))

	// Register Handlers
	http.NewMatchHandler(r, matchUC, streamManager)

	// 6. Run - Bind to 0.0.0.0 to allow network access
	r.Run("0.0.0.0:8080")
}
