export interface Player {
  id: string;
  name: string;
}

export interface Settings {
  roundSeconds: number;
  spies: 'auto' | 'one' | 'two';
  allowSecondSpyThreshold: number;
  includeCategories: Array<'classic' | 'travel' | 'fun'>;
  customLocationsRaw: string;
  revealMode: 'private' | 'public';
  allowSpyGuess: boolean;
}

export type Phase = 'lobby' | 'playing' | 'voting' | 'ended';

export interface Vote {
  accusedId: string | null;
  votes: Record<string, boolean>; // voterId -> approve?
}

export interface RoundResult {
  winner: 'spies' | 'civilians';
  reason: 'time' | 'spy_guess' | 'accused_spy' | 'accused_civil';
}

export interface LocationCard {
  name: string;
  category: 'classic' | 'travel' | 'fun';
  categoryTitle: string;
}

export interface GameState {
  players: Player[];
  phase: Phase;
  seconds: number;
  running: boolean;
  location: LocationCard | null;
  spyIds: string[];
  revealed: Record<string, boolean>;
  vote: Vote;
  result: RoundResult | null;
  roundLog: string[];
}

export interface GameActions {
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  startRound: () => void;
  stopTimer: () => void;
  endRound: (result: RoundResult) => void;
  resetAll: () => void;
  toggleReveal: (id: string) => void;
  setAccused: (id: string) => void;
  castVote: (voterId: string, up: boolean) => void;
  resolveVote: () => void;
  spyGuessLocation: (guess: string) => void;
}
