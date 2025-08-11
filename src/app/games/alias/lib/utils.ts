/**
 * Перетасовка массива (алгоритм Фишера-Йетса)
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Генерация уникального ID
 */
export function generateId(): string {
  return crypto.randomUUID();
}
