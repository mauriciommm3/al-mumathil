
export type Team = 'A' | 'B';

export type CategoryCode = 'P' | 'O' | 'A' | 'D' | 'L' | 'T';

export interface CategoryDefinition {
  code: CategoryCode;
  label: string;
  labelAr: string;
  color: string;
  description: string;
  descriptionAr: string;
  icon?: string;
}

export interface Card {
  category_code: CategoryCode;
  category_name: {
    pt: string;
    ar: string;
  };
  word: {
    pt: string;
    ar: string;
    phonetic: string;
  };
  difficulty_score: number;
  is_all_play: boolean;
  forbidden_words?: string[];
}

export type GameStatus = 'setup' | 'idle' | 'card_drawn' | 'timer_running' | 'resolution' | 'game_over';

export interface GameState {
  teamAPosition: number;
  teamBPosition: number;
  currentTurn: Team;
  gameStatus: GameStatus;
  currentCard: Card | null;
  winner: Team | null;
  winningScore: number;
  drawnCategory: CategoryCode | null;

  // New state for requirements
  isCardRevealed: boolean;
  usedWords: string[];

  // Actions
  setGameStatus: (status: GameStatus) => void;
  setWinningScore: (score: number) => void;
  setDrawnCategory: (category: CategoryCode | null) => void;
  advanceTeam: (team: Team) => void;
  switchTurn: () => void;
  setCard: (card: Card | null) => void;
  revealCard: () => void;
  resetGame: () => void;

  // Performance
  prefetchUpcomingTurns: () => void;
}
