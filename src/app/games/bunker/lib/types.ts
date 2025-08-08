export type Attr = { title: string; desc?: string };

export type RevealKey = 'profession' | 'health' | 'biology' | 'hobby' | 'fact' | 'baggage' | 'special';

export type SpecialCode =
  | 'trader'        // обмен любыми 2 своими НЕ-спец атрибутами местами или обмен с другим игроком одним атрибутом
  | 'manipulator'   // +1 голос против выбранного игрока при текущем голосовании
  | 'immunity'      // игнорировать одно голосование против себя
  | 'force_reroll'  // заставить выбранного игрока перекинуть один НЕ-спец атрибут
  | 'sabotage'      // обнулить таймер обсуждения (мгновенно перейти к голосованию)
  | 'golden_ticket' // если лишний 1 человек — автоматически проходит в бункер
  | 'altruist';     // обмен багажом мирно

export type Special = { code: SpecialCode; title: string; desc: string; uses: number };

export type BunkerPlayer = {
  id: string;
  name: string;
  attrs: Record<RevealKey, Attr>;
  special?: Special;        // расшифрованный объект спец-умения
  revealed: Partial<Record<RevealKey, boolean>>;
  usedReroll: boolean;      // обычный reroll (если разрешён настройками)
  specialUsed?: boolean;    // использовал ли активку
  immunityArmed?: boolean;  // состояние "иммунитета" если включён
};

export type Catastrophe = 'nuclear' | 'pandemic' | 'asteroid' | 'ai' | 'climate';

export type BunkerSpec = {
  size: 'малый' | 'средний' | 'большой';
  supplies: 'на 3 месяца' | 'на 6 месяцев' | 'на 9 месяцев' | 'на 12 месяцев';
  extras: string[];
};

export type BunkerSettings = {
  playersCount: number;
  bunkerCapacity: number;
  discussionSeconds: number;
  revealOrder: RevealKey[];
  catastrophe: Catastrophe;
  bunker: BunkerSpec;
  allowRerollOnce: boolean;
};

export type RoundPhase = 'reveal' | 'discussion' | 'voting' | 'ended';

export type PersistedState = {
  settings: BunkerSettings;
  players: BunkerPlayer[];
  aliveIds: string[];
  round: number;
  phase: RoundPhase;
  timer: number;
  currentReveal: RevealKey;
  votes: Record<string,string|null>;
  log: string[];
};
