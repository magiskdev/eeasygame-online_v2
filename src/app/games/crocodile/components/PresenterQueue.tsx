"use client";

import React, { useState } from "react";

export function PresenterQueue({
  team,
  onUpdate,
  disabled,
}: {
  team: { name: string; presenters: string[] };
  onUpdate: (list: string[]) => void;
  disabled?: boolean;
}) {
  const [name, setName] = useState("");

  function move(from: number, to: number) {
    const list = team.presenters.slice();
    const [x] = list.splice(from, 1);
    list.splice(to, 0, x);
    onUpdate(list);
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold mb-2">Очередь ведущих — {team.name}</h3>

      <div className="flex gap-2 mb-3">
        <input
          className="w-[50%] rounded-xl bg-white/5 border border-white/10 px-3 py-2"
          placeholder="Имя ведущего"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled}
        />

        <button
          className="btn flex-shrink-0"
          disabled={disabled}
          onClick={() => {
            if (!name.trim()) return;
            onUpdate([...team.presenters, name.trim()]);
            setName("");
          }}
        >
          Добавить
        </button>
      </div>

      {!team.presenters.length && (
        <p className="text-sm text-gray-400">
          Добавьте хотя бы одного ведущего.
        </p>
      )}

      <ul className="space-y-2">
        {team.presenters.map((p, i) => (
          <li key={p + i} className="flex items-center gap-2">
            <span
              className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg border ${
                i === 0
                  ? "border-green-400/50 bg-green-500/10 text-green-400"
                  : "border-white/10 bg-white/5 text-gray-400"
              }`}
            >
              {i === 0 ? "→" : i + 1}
            </span>

            <input
              className="w-[50%] rounded-xl bg-white/5 border border-white/10 px-3 py-2"
              value={p}
              onChange={(e) => {
                const list = team.presenters.slice();
                list[i] = e.target.value;
                onUpdate(list);
              }}
              disabled={disabled}
            />

            <div className="flex gap-1">
              <button
                className="btn"
                disabled={disabled || i === 0}
                onClick={() => move(i, i - 1)}
              >
                ↑
              </button>

              <button
                className="btn"
                disabled={disabled || i === team.presenters.length - 1}
                onClick={() => move(i, i + 1)}
              >
                ↓
              </button>

              <button
                className="btn"
                disabled={disabled}
                onClick={() => {
                  const list = team.presenters.slice();
                  list.splice(i, 1);
                  onUpdate(list);
                }}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
