import type { Cell, Player } from "./types";
import { checkState } from "./rules";

const SCORES = { X: -10, O: 10, draw: 0 }; // O — ИИ по умолчанию

export function aiBestMove(
  board: Cell[],
  size: number,
  winLength: number,
  me: Player,
  level: "easy" | "medium" | "hard",
  opts?: { forHint?: boolean }
) {
  const empties = board
    .map((v, i) => (v ? null : i))
    .filter((v): v is number => v !== null);
  if (!empties.length) return null;

  if (level === "easy") {
    return empties[Math.floor(Math.random() * empties.length)];
  }

  if (level === "medium") {
    // 1) выиграть сразу
    for (const i of empties) {
      const next = board.slice();
      next[i] = me;
      const st = checkState(next, size, winLength);
      if (st.winner === me) return i;
    }
    // 2) заблокировать соперника
    const opp: Player = me === "X" ? "O" : "X";
    for (const i of empties) {
      const next = board.slice();
      next[i] = opp;
      const st = checkState(next, size, winLength);
      if (st.winner === opp) return i;
    }
    // 3) центр/углы/случай
    const center = Math.floor((size * size) / 2);
    if (empties.includes(center)) return center;
    const corners = [0, size - 1, size * (size - 1), size * size - 1].filter(
      (i) => empties.includes(i)
    );
    if (corners.length)
      return corners[Math.floor(Math.random() * corners.length)];
    return empties[Math.floor(Math.random() * empties.length)];
  }

  // hard — минимакс с ограничением глубины
  const depth = size === 3 ? 7 : size === 4 ? 5 : 4;
  let best = { idx: empties[0], score: -Infinity };
  for (const i of empties) {
    const next = board.slice();
    next[i] = me;
    const score = minimax(
      next,
      size,
      winLength,
      false,
      me,
      -Infinity,
      Infinity,
      depth
    );
    if (score > best.score) best = { idx: i, score };
  }
  return best.idx;
}

function minimax(
  board: Cell[],
  size: number,
  winLength: number,
  isMax: boolean,
  me: Player,
  alpha: number,
  beta: number,
  depth: number
): number {
  const st = checkState(board, size, winLength);
  if (st.winner) return SCORES[st.winner as "X" | "O" | "draw"];
  if (depth <= 0) return 0;

  const empties = board
    .map((v, i) => (v ? null : i))
    .filter((v): v is number => v !== null);
  const player: Player = isMax ? me : me === "X" ? "O" : "X";

  if (isMax) {
    let best = -Infinity;
    for (const i of empties) {
      const next = board.slice();
      next[i] = player;
      best = Math.max(
        best,
        minimax(next, size, winLength, false, me, alpha, beta, depth - 1)
      );
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const i of empties) {
      const next = board.slice();
      next[i] = player;
      best = Math.min(
        best,
        minimax(next, size, winLength, true, me, alpha, beta, depth - 1)
      );
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}
