
import { create } from 'zustand';
import { GameState, Team, GameStatus, Card, CategoryCode } from '../types';
import { CATEGORY_PATTERN } from '../constants';
import { storageService } from '../services/storageService';
import { prefetchCategory } from '../services/cardService';

interface GameStore extends GameState { }

export const useGameStore = create<GameStore>((set, get) => ({
  teamAPosition: 0,
  teamBPosition: 0,
  currentTurn: 'A',
  gameStatus: 'setup',
  currentCard: null,
  winner: null,
  isCardRevealed: false,
  winningScore: 30, // Default
  drawnCategory: null,

  usedWords: storageService.getRecentWords(),

  setGameStatus: (status: GameStatus) => set({ gameStatus: status }),

  setWinningScore: (score: number) => set({ winningScore: score }),

  setDrawnCategory: (category: CategoryCode | null) => set({ drawnCategory: category }),

  advanceTeam: (team: Team) => set((state) => {
    // Nova regra: Apenas categoria 'D' (Difícil) anda 2 casas. O resto anda 1.
    const points = state.currentCard?.category_code === 'D' ? 2 : 1;

    const currentPos = team === 'A' ? state.teamAPosition : state.teamBPosition;
    const newPos = Math.min(currentPos + points, state.winningScore);

    const updates: Partial<GameState> = {
      gameStatus: 'idle',
      currentCard: null,
      isCardRevealed: false,
      drawnCategory: null,
    };

    if (team === 'A') updates.teamAPosition = newPos;
    else updates.teamBPosition = newPos;

    if (newPos >= state.winningScore) {
      updates.gameStatus = 'game_over';
      updates.winner = team;
    }

    return updates;
  }),

  switchTurn: () => set((state) => {
    // CRITICAL: If game is over, do not reset status to idle
    if (state.gameStatus === 'game_over') return state;

    return {
      currentTurn: state.currentTurn === 'A' ? 'B' : 'A',
      gameStatus: 'idle',
      currentCard: null,
      isCardRevealed: false,
      drawnCategory: null,
    };
  }),

  setCard: (card: Card | null) => set((state) => {
    if (card) {
      storageService.addWord(card.word.pt);
      return {
        currentCard: card,
        gameStatus: 'card_drawn',
        isCardRevealed: false,
        usedWords: [...state.usedWords, card.word.pt]
      };
    }
    return {
      currentCard: null,
      gameStatus: 'card_drawn',
      isCardRevealed: false
    };
  }),

  revealCard: () => set({ isCardRevealed: true }),

  resetGame: () => set({
    teamAPosition: 0,
    teamBPosition: 0,
    currentTurn: 'A',
    gameStatus: 'setup',
    currentCard: null,
    winner: null,
    isCardRevealed: false,
    drawnCategory: null,
  }),

  prefetchUpcomingTurns: () => {
    const state = get();
    const nextIndexA = (state.teamAPosition + 1) % CATEGORY_PATTERN.length;
    const nextCatA = CATEGORY_PATTERN[nextIndexA];
    const nextIndexB = (state.teamBPosition + 1) % CATEGORY_PATTERN.length;
    const nextCatB = CATEGORY_PATTERN[nextIndexB];

    prefetchCategory();
    if (nextCatB !== nextCatA) {
      prefetchCategory();
    }
  }
}));
