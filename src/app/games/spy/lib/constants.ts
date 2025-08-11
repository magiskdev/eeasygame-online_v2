import type { Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  roundSeconds: 480, // 8 минут
  spies: 'auto',
  allowSecondSpyThreshold: 8,
  includeCategories: ['classic', 'travel', 'fun'],
  customLocationsRaw: '',
  revealMode: 'private',
  allowSpyGuess: true,
};

export const SUGGESTED_TIMERS = [300, 480, 600, 900]; // 5, 8, 10, 15 минут

export const HOTKEYS = {
  START_ROUND: 'Space',
  RESET_GAME: 'r',
  HOW_TO_PLAY: 'h',
  SETTINGS: 's',
  ROUND_LOG: 'l',
} as const;

export const KEYBOARD_SHORTCUTS = [
  { key: 'Space', action: 'Начать/остановить раунд' },
  { key: 'R', action: 'Сбросить игру' },
  { key: 'H', action: 'Показать/скрыть правила' },
  { key: 'S', action: 'Открыть настройки' },
  { key: 'L', action: 'Показать лог раунда' },
];
