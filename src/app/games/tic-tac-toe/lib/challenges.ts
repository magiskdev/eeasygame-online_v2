import type { Cell, Move, Player } from "./types";
import { checkState } from "./rules";

export function usedCenter(moves: Move[], size: number) {
  const center = Math.floor((size * size) / 2);
  return moves.some((m) => m.index === center);
}

export function fastWin(moves: Move[]) {
  // «выиграй за ≤5 ходов» ~ у X 3 хода, у O 2 (итого 5 полуходов)
  return moves.length <= 5 * 1; // простая эвристика — проверяется при завершении
}

export function detectForkChance(board: Cell[], size: number, player: Player) {
  // очень простая эвристика: найдём ходы, которые создают 2+ немедленных выигрыша для текущего игрока
  const empties = board
    .map((v, i) => (v ? null : i))
    .filter((v): v is number => v !== null);
  for (const i of empties) {
    const next = board.slice();
    next[i] = player;
    let wins = 0;
    const em2 = next
      .map((v, ix) => (v ? null : ix))
      .filter((v): v is number => v !== null);
    for (const j of em2) {
      const n2 = next.slice();
      n2[j] = player;
      const st = checkState(n2, size, size === 3 ? 3 : size === 4 ? 4 : 4);
      if (st.winner === player) wins++;
      if (wins >= 2) return true;
    }
  }
  return false;
}
