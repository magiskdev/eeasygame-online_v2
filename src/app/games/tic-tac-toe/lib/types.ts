export type Player = 'X' | 'O';
export type Cell = Player | null;
export type GameMode = 'pvp' | 'pvai';

export type Settings = {
  mode: GameMode;
  ai: 'easy' | 'medium' | 'hard';
  size: 3 | 4 | 5;
  winLength: number;
  seriesTo: number;
  perMoveSeconds: number;
  hints: boolean;
};

export type State = {
  winner: Player | 'draw' | null;
  line: number[] | null;
};

export type Move = {
  index: number;
  player: Player;
  skip?: boolean;
};

export type ChallengeKey = 'no_center_win' | 'fast_win_5' | 'fork_master';
