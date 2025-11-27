package http

import (
	"football-tracker/internal/domain"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

// http layer (gin hadlers) returns json responses

type MatchHandler struct {
	useCase  domain.MatchUseCase // business logic we difined on the lower level
	streamer domain.EventStreamer // streaming manager
}


func NewMatchHandler(r *gin.Engine, uc domain.MatchUseCase, es domain.EventStreamer) {
	handler := &MatchHandler{
		useCase:  uc,
		streamer: es, // We need this directly only to register new clients for SSE
	}

	api := r.Group("/api")
	{
		api.POST("/matches", handler.CreateMatch)
		api.GET("/matches", handler.GetMatches)
		api.PUT("/matches/:id/start", handler.StartMatch)
		api.POST("/matches/:id/event", handler.AddEvent)
		api.GET("/stream", handler.Stream)
	}
}

func (h *MatchHandler) CreateMatch(c *gin.Context) {
	var input struct {
		TeamA string `json:"team_a"`
		TeamB string `json:"team_b"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	match, err := h.useCase.CreateMatch(c, input.TeamA, input.TeamB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, match)
}

func (h *MatchHandler) GetMatches(c *gin.Context) {
	matches, err := h.useCase.GetMatches(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, matches)
}

func (h *MatchHandler) StartMatch(c *gin.Context) {
	id := c.Param("id")
	err := h.useCase.StartMatch(c, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "started"})
}

func (h *MatchHandler) AddEvent(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Type   string `json:"type"`
		Team   string `json:"team"`
		Detail string `json:"detail"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	match, err := h.useCase.AddMatchEvent(c, id, input.Type, input.Team, input.Detail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, match)
}

// Stream handles the SSE connection
func (h *MatchHandler) Stream(c *gin.Context) {
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	c.Writer.Header().Set("Transfer-Encoding", "chunked")

	clientChan := make(chan domain.Match)
	h.streamer.RegisterClient(clientChan)

	defer func() {
		h.streamer.UnregisterClient(clientChan)
	}()

	c.Stream(func(w io.Writer) bool {
		if msg, ok := <-clientChan; ok {
			c.SSEvent("message", msg)
			return true
		}
		return false
	})
}