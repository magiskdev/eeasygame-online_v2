'use client';

import React, { useState } from 'react';

type Team = { id: string; name: string; score: number };

export function TeamManager({
  teams,
  onAdd,
  onRename,
  onRemove,
  disabledWhileRunning,
}: {
  teams: Team[];
  onAdd: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
  disabledWhileRunning?: boolean;
}) {
  const [name, setName] = useState('');

  return (
    <div className="pt-2 border-t border-white/10">
      <h3 className="font-semibold mb-2">Команды</h3>

      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2"
          placeholder="Имя команды"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!!disabledWhileRunning}
        />

        <button
          className="btn"
          onClick={() => {
            if (!name.trim()) return;
            onAdd(name.trim());
            setName('');
          }}
          disabled={!!disabledWhileRunning}
        >
          Добавить
        </button>
      </div>

      <ul className="space-y-2">
        {teams.map((t) => (
          <li key={t.id} className="flex gap-2">
            <input
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2"
              value={t.name}
              onChange={(e) => onRename(t.id, e.target.value)}
              disabled={!!disabledWhileRunning}
            />
            
            <button
              className="btn"
              onClick={() => onRemove(t.id)}
              disabled={teams.length <= 2 || !!disabledWhileRunning}
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
