import type { LocationCard } from '../lib/types';

const classic = (name: string): LocationCard => ({
  name,
  category: "classic",
  categoryTitle: "Классика",
});
const travel = (name: string): LocationCard => ({
  name,
  category: "travel",
  categoryTitle: "Путешествия",
});
const fun = (name: string): LocationCard => ({
  name,
  category: "fun",
  categoryTitle: "Весёлые",
});

export const LOCATIONS: Record<string, LocationCard> = {
  Ресторан: classic("Ресторан"),
  Школа: classic("Школа"),
  Больница: classic("Больница"),
  Банк: classic("Банк"),
  Театр: classic("Театр"),
  Стадион: classic("Стадион"),
  Парк: classic("Парк"),
  Офис: classic("Офис"),
  Пляж: travel("Пляж"),
  Аэропорт: travel("Аэропорт"),
  Поезд: travel("Поезд"),
  Кемпинг: travel("Кемпинг"),
  Корабль: travel("Корабль"),
  "Космический корабль": fun("Космический корабль"),
  "Подводная лодка": fun("Подводная лодка"),
  Киностудия: fun("Киностудия"),
  Цирк: fun("Цирк"),
  Аквапарк: fun("Аквапарк"),
};

export function buildCustomLocations(raw: string) {
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map<LocationCard>((name) => ({
      name,
      category: "fun",
      categoryTitle: "Пользовательские",
    }));
}

export const SUGGESTED_TIMERS = [300, 480, 600]; // 5, 8, 10 минут
