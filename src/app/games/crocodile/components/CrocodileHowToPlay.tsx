"use client";

import React from "react";
import { GameHowToPlayModal } from "shared/ui";
import { KEYBOARD_SHORTCUTS } from "../lib/constants";

interface CrocodileHowToPlayProps {
  open: boolean;
  onClose: () => void;
}

export function CrocodileHowToPlay({ open, onClose }: CrocodileHowToPlayProps) {
  const rules = (
    <ol className="list-decimal list-inside space-y-2 text-gray-300">
      <li>Игра для команд от 2 человек. Один игрок показывает слово жестами, остальные отгадывают.</li>
      <li>Ведущий команды видит слово на экране и показывает его жестами без слов и звуков.</li>
      <li>Команда должна отгадать как можно больше слов за отведенное время.</li>
      <li>За каждое отгаданное слово команда получает очки (1 или по сложности: легкое=1, среднее=2, сложное=3).</li>
      <li>Можно пропускать сложные слова, но есть лимит пропусков за ход.</li>
      <li>При включенном штрафе за пропуск команда теряет 1 очко.</li>
      <li>Побеждает команда, первой набравшая целевое количество очков.</li>
      <li>Ведущие в команде чередуются каждый ход для справедливости.</li>
    </ol>
  );

  const hotkeys = (
    <div className="space-y-1">
      {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
        <div key={index} className="flex justify-between">
          <span className="font-mono bg-white/10 px-2 py-1 rounded text-xs">
            {shortcut.key}
          </span>
          <span className="text-gray-400">{shortcut.action}</span>
        </div>
      ))}
    </div>
  );

  return (
    <GameHowToPlayModal
      open={open}
      onClose={onClose}
      gameTitle="Крокодил"
      rules={rules}
      hotkeys={hotkeys}
    />
  );
}
