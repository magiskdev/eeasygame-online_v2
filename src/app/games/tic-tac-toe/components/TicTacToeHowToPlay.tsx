"use client";

import React from "react";
import { GameHowToPlayModal } from "shared/ui";

export interface TicTacToeHowToPlayProps {
  open: boolean;
  onClose: () => void;
}

export const TicTacToeHowToPlay: React.FC<TicTacToeHowToPlayProps> = ({ open, onClose }) => {
  const rules = (
    <ul className="list-disc pl-6 space-y-2">
      <li>Играют ✖ X и ◯ O поочерёдно.</li>
      <li>
        Цель — собрать линию из K символов (по
        горизонтали/вертикали/диагонали).
      </li>
      <li>
        Есть таймер на ход, Undo/Redo, режимы PvP и PvAI (несколько
        сложностей).
      </li>
    </ul>
  );

  const hotkeys = (
    <ul className="space-y-1">
      <li><kbd className="px-2 py-1 bg-white/10 rounded text-xs">Z</kbd> — Undo</li>
      <li><kbd className="px-2 py-1 bg-white/10 rounded text-xs">Y</kbd> — Redo</li>
      <li><kbd className="px-2 py-1 bg-white/10 rounded text-xs">H</kbd> — подсказка</li>
      <li><kbd className="px-2 py-1 bg-white/10 rounded text-xs">N</kbd> — новая партия</li>
    </ul>
  );

  return (
    <GameHowToPlayModal
      open={open}
      onClose={onClose}
      gameTitle="Крестики-нолики"
      rules={rules}
      hotkeys={hotkeys}
    />
  );
};
