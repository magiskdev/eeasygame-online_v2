import { AliasSettingsType } from "./types";

export const DEFAULT_SETTINGS: AliasSettingsType = {
  roundSeconds: 60,
  goalPoints: 30,
  minusOnSkip: false,
  skipLimit: 3,
  dictionary: "basic",
  customWordsRaw: "",
};

export const DEFAULT_TEAMS = [
  { id: crypto.randomUUID(), name: "Команда А", score: 0 },
  { id: crypto.randomUUID(), name: "Команда Б", score: 0 },
];

export const KEYBOARD_SHORTCUTS = {
  CORRECT: 'Space',
  SKIP: 'ArrowRight', 
  START_PAUSE: 'Enter',
} as const;
