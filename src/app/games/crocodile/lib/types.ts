export interface Team {
  id: string;
  name: string;
  score: number;
  presenters: string[];
  currentPresenterIndex: number;
}

export interface CrocodileSettings {
  roundSeconds: number;
  goalPoints: number;
  skipLimit: number;
  minusOnSkip: boolean;
  pack: string;
  customRaw: string;
  difficultyScoring: boolean;
  allowHints: boolean;
  hintDelay: number;
}

export interface TurnLogItem {
  teamId: string;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  category?: string;
  result: "correct" | "skip";
  points: number;
}

export interface GameState {
  teams: Team[];
  activeTeamIdx: number;
  round: number;
  running: boolean;
  seconds: number;
  turnScore: number;
  skipsLeft: number;
  wordIdx: number;
  hidden: boolean;
  hintVisible: boolean;
  turnLog: TurnLogItem[];
  gameEnded: boolean;
}

export interface GameActions {
  startTurn: () => void;
  endTurn: () => void;
  onCorrect: () => void;
  onSkip: () => void;
  resetGame: () => void;
  nextWord: () => void;
  toggleWordVisibility: () => void;
  updateTeams: (teams: Team[]) => void;
  setActiveTeam: (idx: number) => void;
}
