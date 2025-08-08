export type Difficulty = 'easy' | 'medium' | 'hard';
export type CrocWord = {
  text: string;
  difficulty: Difficulty;
  category?: string;
  hint?: string; // намёк ведущему
};

export type PackKey = 'basic' | 'actions' | 'animals' | 'movies' | 'hard';

export const difficultyPoints: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export const PACKS: Record<PackKey, CrocWord[]> = {
  basic: [
    { text: 'Кофеварка', difficulty: 'easy', category: 'Предмет', hint: 'Кухня' },
    { text: 'Фейерверк', difficulty: 'medium', category: 'Явление', hint: 'Ночное небо' },
    { text: 'Скейтборд', difficulty: 'easy', category: 'Транспорт' },
    { text: 'Пылесос', difficulty: 'easy', category: 'Быт' },
    { text: 'Рыцарь', difficulty: 'medium', category: 'Профессия/персонаж', hint: 'Средневековье' },
    { text: 'Гроза', difficulty: 'easy', category: 'Погода' },
    { text: 'Палатка', difficulty: 'easy', category: 'Туризм' },
    { text: 'Самолёт', difficulty: 'easy', category: 'Транспорт' },
    { text: 'Йога', difficulty: 'easy', category: 'Деятельность' },
    { text: 'Подводная лодка', difficulty: 'medium', category: 'Транспорт', hint: 'Глубоко' },
  ],
  actions: [
    { text: 'Гладить бельё', difficulty: 'easy', category: 'Действие' },
    { text: 'Ловить бабочек', difficulty: 'medium', category: 'Действие' },
    { text: 'Играть на саксофоне', difficulty: 'hard', category: 'Действие', hint: 'Джаз' },
    { text: 'Кормить кота', difficulty: 'easy', category: 'Действие' },
    { text: 'Надувать шарик', difficulty: 'easy', category: 'Действие' },
    { text: 'Чинить велосипед', difficulty: 'medium', category: 'Действие' },
  ],
  animals: [
    { text: 'Кенгуру', difficulty: 'easy', category: 'Животное', hint: 'Прыжки' },
    { text: 'Фламинго', difficulty: 'medium', category: 'Птица', hint: 'Розовый' },
    { text: 'Хамелеон', difficulty: 'hard', category: 'Ящерица', hint: 'Цвет' },
    { text: 'Муравьед', difficulty: 'hard', category: 'Животное', hint: 'Длинный язык' },
    { text: 'Панда', difficulty: 'easy', category: 'Животное', hint: 'Бамбук' },
  ],
  movies: [
    { text: 'Титаник', difficulty: 'easy', category: 'Фильм', hint: 'Корабль' },
    { text: 'Матрица', difficulty: 'medium', category: 'Фильм', hint: 'Пилюля' },
    { text: 'Интерстеллар', difficulty: 'hard', category: 'Фильм', hint: 'Чёрная дыра' },
    { text: 'Один дома', difficulty: 'easy', category: 'Фильм', hint: 'Похитители' },
  ],
  hard: [
    { text: 'Параллелепипед', difficulty: 'hard', category: 'Термин' },
    { text: 'Акклиматизация', difficulty: 'hard', category: 'Явление' },
    { text: 'Амфитеатр', difficulty: 'medium', category: 'Место' },
    { text: 'Антарктида', difficulty: 'medium', category: 'География', hint: 'Холод' },
  ],
};

export function buildCustomPack(raw: string): CrocWord[] {
  const items = raw.split(/\r?\n|,/).map(w => w.trim()).filter(Boolean);
  // по умолчанию помечаем как medium без категории
  return items.map(text => ({ text, difficulty: 'medium' as const }));
}

export function pickWord(list: CrocWord[], idx: number): CrocWord | undefined {
  return list[idx % Math.max(1, list.length)];
}
