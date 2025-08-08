"use client";

export function Scoreboard({
  scores,
  target,
  seriesWinner,
}: {
  scores: { X: number; O: number; draw: number };
  target: number;
  seriesWinner: "X" | "O" | null;
}) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Серия</h3>
      <ul className="space-y-2">
        <li className="flex items-center justify-between rounded-xl px-3 py-2 border border-white/10 bg-white/5">
          <span>✖ X</span>
          <span className="font-semibold">
            {scores.X} / {target}
          </span>
        </li>
        <li className="flex items-center justify-between rounded-xl px-3 py-2 border border-white/10 bg-white/5">
          <span>◯ O</span>
          <span className="font-semibold">
            {scores.O} / {target}
          </span>
        </li>
        <li className="flex items-center justify-between rounded-xl px-3 py-2 border border-white/10 bg-white/5">
          <span>Ничьи</span>
          <span className="font-semibold">{scores.draw}</span>
        </li>
      </ul>
      {seriesWinner && (
        <div className="mt-3 rounded-xl border-2 border-emerald-400/50 bg-emerald-500/10 p-3 text-center">
          Победитель серии: <b>{seriesWinner}</b> 🎉
        </div>
      )}
    </div>
  );
}
