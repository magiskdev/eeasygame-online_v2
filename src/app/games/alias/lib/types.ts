import type { DictionaryKey } from '../components/lib/dictionaries';

export interface Team {
  id: string;
  name: string;
  score: number;
}

export interface AliasSettingsType {
  roundSeconds: number; // длительность раунда
  goalPoints: number; // цель по очкам
  minusOnSkip: boolean; // штраф -1 за пропуск?
  skipLimit: number; // лимит пропусков за ход
  dictionary: DictionaryKey | "custom";
  customWordsRaw: string; // если выбирают 'custom'
}

export interface GameState {
  teams: Team[];
  activeTeamIdx: number;
  round: number;
  seconds: number;
  running: boolean;
  turnScore: number;
  skipsLeft: number;
  wordIdx: number;
  winner: Team | null;
}

export interface GameActions {
  startTurn: () => void;
  endTurn: () => void;
  onCorrect: () => void;
  onSkip: () => void;
  resetGame: () => void;
  updateTeams: (teams: Team[]) => void;
  setActiveTeamIdx: (idx: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
}
