'use client';

import type { Team } from "../lib/types";

interface ScoreboardProps {
  teams: Team[];
  goalPoints: number;
  activeTeamIdx: number;
}

export function Scoreboard({ teams, goalPoints, activeTeamIdx }: ScoreboardProps) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Счёт</h3>
      <div className="space-y-3">
        {teams.map((team, idx) => (
          <div
            key={team.id}
            className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
              idx === activeTeamIdx
                ? "bg-blue-500/20 border border-blue-500/30"
                : "bg-white/5"
            }`}
          >
            <span className="font-medium">{team.name}</span>
            <span className="text-lg font-bold font-mono tabular-nums">
              {team.score} / {goalPoints}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
