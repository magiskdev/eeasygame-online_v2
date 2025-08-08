'use client';

import React, { useMemo } from 'react';
import { Cell, ChallengeKey, Move, Player } from '../lib/types';
import { detectForkChance, fastWin, usedCenter } from '../lib/challenges';

const CHALLENGES: Record<ChallengeKey, { title: string; desc: string }> = {
  no_center_win: { title: 'Без центра', desc: 'Выиграй партию ни разу не заняв центр' },
  fast_win_5:   { title: 'Быстрый победитель', desc: 'Выиграй за ≤5 ходов' },
  fork_master:  { title: 'Мастер вилки', desc: 'Создай позицию с двумя угрозами' },
};

export function Challenges({
  board, moves, size, current,
}: {
  board: Cell[]; moves: Move[]; size: number; current: Player;
}) {
  const progress = useMemo(() => ({
    no_center_win: usedCenter(moves, size) ? 'fail' : 'progress',
    fast_win_5: fastWin(moves) ? 'done' : (moves.length <= 10 ? 'progress' : 'fail'),
    fork_master: detectForkChance(board, size, current) ? 'progress' : 'idle',
  }), [board, moves, size, current]);

  return (
    <div>
      <h3 className="font-semibold mb-2">Челленджи</h3>
      <ul className="space-y-2">
        {Object.entries(CHALLENGES).map(([key, meta]) => {
          const state = (progress as any)[key] as 'done'|'progress'|'fail'|'idle';
          const badge =
            state==='done' ? 'bg-emerald-500/15 border-emerald-400/40' :
            state==='progress' ? 'bg-amber-500/15 border-amber-400/40' :
            state==='fail' ? 'bg-rose-500/15 border-rose-400/40' :
            'bg-white/5 border-white/10';
          return (
            <li key={key} className={`rounded-xl border px-3 py-2 ${badge}`}>
              <div className="font-medium">{meta.title}</div>
              <div className="text-sm text-gray-300">{meta.desc}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
