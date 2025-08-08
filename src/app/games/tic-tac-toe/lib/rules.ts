import type { Cell, Player, State } from './types';

export const buildEmpty = (size: number): Cell[] => Array(size * size).fill(null);

export function indexToCoords(i: number, size: number) {
  const r = Math.floor(i / size), c = i % size;
  return `${r+1},${c+1}`;
}
export function coordsToIndex(r: number, c: number, size: number) {
  return r * size + c;
}

export function nextPlayer(p: Player): Player {
  return p === 'X' ? 'O' : 'X';
}

export function checkState(board: Cell[], size: number, winLength: number): State {
  // проверяем все линии
  const lines: number[][] = [];
  // горизонтали
  for (let r = 0; r < size; r++) for (let c = 0; c <= size - winLength; c++) {
    lines.push(Array.from({ length: winLength }, (_, k) => coordsToIndex(r, c+k, size)));
  }
  // вертикали
  for (let c = 0; c < size; c++) for (let r = 0; r <= size - winLength; r++) {
    lines.push(Array.from({ length: winLength }, (_, k) => coordsToIndex(r+k, c, size)));
  }
  // диагонали ↘
  for (let r = 0; r <= size - winLength; r++) for (let c = 0; c <= size - winLength; c++) {
    lines.push(Array.from({ length: winLength }, (_, k) => coordsToIndex(r+k, c+k, size)));
  }
  // диагонали ↗
  for (let r = winLength - 1; r < size; r++) for (let c = 0; c <= size - winLength; c++) {
    lines.push(Array.from({ length: winLength }, (_, k) => coordsToIndex(r-k, c+k, size)));
  }

  for (const line of lines) {
    const vals = line.map(i => board[i]);
    if (vals.every(v => v && v === vals[0])) return { winner: vals[0], line };
  }
  if (board.every(Boolean)) return { winner: 'draw', line: null };
  return { winner: null, line: null };
}
