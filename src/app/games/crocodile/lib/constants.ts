import type { CrocodileSettings, Team } from './types';

export const DEFAULT_SETTINGS: CrocodileSettings = {
  roundSeconds: 90,
  goalPoints: 20,
  skipLimit: 3,
  minusOnSkip: false,
  pack: "basic",
  customRaw: "",
  difficultyScoring: true,
  allowHints: true,
  hintDelay: 20,
};

export const DEFAULT_TEAMS: Team[] = [
  {
    id: crypto.randomUUID(),
    name: "Команда А",
    score: 0,
    presenters: ["Аня", "Иван"],
  },
  {
    id: crypto.randomUUID(),
    name: "Команда Б", 
    score: 0,
    presenters: ["Оля", "Сергей"],
  },
];

export const KEYBOARD_SHORTCUTS = [
  { key: 'Пробел', action: 'Отгадали / Старт' },
  { key: 'Enter', action: 'Завершить ход / Старт' },
  { key: '→', action: 'Пропуск' },
  { key: 'H', action: 'Показать/скрыть слово' },
  { key: 'R', action: 'Сброс игры' },
];
