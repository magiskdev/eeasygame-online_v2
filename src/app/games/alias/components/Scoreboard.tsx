'use client';

type Team = { id: string; name: string; score: number };

export function Scoreboard({
  teams,
  activeIdx,
  goal,
}: {
  teams: Team[];
  activeIdx: number;
  goal: number;
}) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Счёт</h3>
      <ul className="space-y-2">
        {teams.map((t, i) => (
          <li
            key={t.id}
            className={
              'flex items-center justify-between rounded-xl px-3 py-2 border ' +
              (i === activeIdx
                ? 'border-blue-400/40 bg-blue-500/10'
                : 'border-white/10 bg-white/5')
            }
          >
            <span className="truncate">{t.name}</span>
            <span className="font-semibold">{t.score} / {goal}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
