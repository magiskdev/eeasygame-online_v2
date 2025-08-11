'use client';

import { useState } from 'react';
import type { Team } from '../lib/types';

interface TeamManagerProps {
  teams: Team[];
  disabled?: boolean;
  onAddTeam: (name: string) => void;
  onRenameTeam: (id: string, name: string) => void;
  onRemoveTeam: (id: string) => void;
}

export function TeamManager({
  teams,
  disabled = false,
  onAddTeam,
  onRenameTeam,
  onRemoveTeam,
}: TeamManagerProps) {
  const [name, setName] = useState('');

  return (
    <div className="pt-2 border-t border-white/10">
      <h3 className="font-semibold mb-2">Команды</h3>

      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 min-w-0 rounded-xl bg-white/5 border border-white/10 px-3 py-2"
          placeholder="Имя команды"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!!disabled}
        />

        <button
          className="btn flex-shrink-0 px-3 py-2"
          onClick={() => {
            if (!name.trim()) return;
            onAddTeam(name.trim());
            setName('');
          }}
          disabled={!!disabled}
        >
          Добавить
        </button>
      </div>

      <ul className="space-y-2">
        {teams.map((t) => (
          <li key={t.id} className="flex gap-2">
            <input
              className="flex-1 min-w-0 rounded-xl bg-white/5 border border-white/10 px-3 py-2"
              value={t.name}
              onChange={(e) => onRenameTeam(t.id, e.target.value)}
              disabled={!!disabled}
            />
            
            <button
              className="btn flex-shrink-0 px-3 py-2 w-10 h-10 flex items-center justify-center"
              onClick={() => onRemoveTeam(t.id)}
              disabled={teams.length <= 2 || !!disabled}
              title={teams.length <= 2 ? 'Нужно минимум 2 команды' : 'Удалить'}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
