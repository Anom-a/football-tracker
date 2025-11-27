package usecase

import (
	"context"
	"football-tracker/internal/domain"
	"log"
	"time"
)

type matchUseCase struct {
	matchRepo      domain.MatchRepository
	streamer       domain.EventStreamer
	contextTimeout time.Duration
}

func NewMatchUseCase(mr domain.MatchRepository, es domain.EventStreamer, timeout time.Duration) domain.MatchUseCase {
	return &matchUseCase{
		matchRepo:      mr,
		streamer:       es,
		contextTimeout: timeout,
	}
}

// ... CreateMatch and GetMatches remain the same ...

func (u *matchUseCase) CreateMatch(c context.Context, teamA, teamB string) (*domain.Match, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	match := &domain.Match{
		TeamA:  teamA,
		TeamB:  teamB,
		Status: "scheduled",
		Events: []domain.MatchEvent{},
	}
	err := u.matchRepo.Create(ctx, match)
	return match, err
}

func (u *matchUseCase) GetMatches(c context.Context) ([]domain.Match, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()
	return u.matchRepo.Fetch(ctx)
}

// --- UPDATED LOGIC HERE ---

func (u *matchUseCase) StartMatch(c context.Context, id string) error {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	// 1. Set status to LIVE immediately
	updatedMatch, err := u.matchRepo.UpdateStatus(ctx, id, "live")
	if err != nil {
		return err
	}
	u.streamer.Notify(*updatedMatch)

	// 2. Start the Automatic Timer in the background
	go func(matchID string) {
		// Wait 90 minutes for a real match
		log.Printf("Match %s started. Timer set for 90 minutes...", matchID)

		time.Sleep(90 * time.Minute)

		// 3. Time is up! Finish the match.
		// We use context.Background() because the original HTTP request context is dead by now
		bgCtx, bgCancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer bgCancel()

		_, err := u.matchRepo.UpdateStatus(bgCtx, matchID, "finished")
		if err != nil {
			log.Printf("Error finishing match %s automatically: %v", matchID, err)
			return
		}

		// 4. Add a "Full Time" event to the timeline
		finalEvent := domain.MatchEvent{
			Type:      "whistle",
			Team:      "Ref",
			Detail:    "Full Time (90')",
			Timestamp: time.Now(),
		}
		u.matchRepo.AddEvent(bgCtx, matchID, finalEvent)

		// 5. Fetch one last time to get the event and status together, then broadcast
		finalState, _ := u.matchRepo.GetByID(bgCtx, matchID)
		u.streamer.Notify(*finalState)

		log.Printf("Match %s ended automatically.", matchID)
	}(id)

	return nil
}

// You can remove FinishMatch from the Interface/Struct if you don't want manual control,
// or keep it as a backup override.
func (u *matchUseCase) FinishMatch(c context.Context, id string) error {
	// ... logic ...
	return nil
}

func (u *matchUseCase) AddMatchEvent(c context.Context, id string, eventType, team, detail string) (*domain.Match, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()

	event := domain.MatchEvent{
		Type:      eventType,
		Team:      team,
		Detail:    detail,
		Timestamp: time.Now(),
	}

	updatedMatch, err := u.matchRepo.AddEvent(ctx, id, event)
	if err != nil {
		return nil, err
	}
	u.streamer.Notify(*updatedMatch)
	return updatedMatch, nil
}
