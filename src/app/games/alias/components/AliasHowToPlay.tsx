"use client";

import React from "react";
import { GameHowToPlayModal } from "shared/ui";

export interface AliasHowToPlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AliasHowToPlay: React.FC<AliasHowToPlayProps> = ({ isOpen, onClose }) => {
  const rules = (
    <ol className="list-decimal pl-6 space-y-2">
      <li>
        Разделитесь на 2+ команд. В свой ход один игрок объясняет слова своей
        команде.
      </li>
      <li>Запрещены однокоренные слова, переводы и прямые подсказки.</li>
      <li>За каждое отгаданное слово — +1 очко команде.</li>
      <li>
        Можно пропускать слова (лимит на ход). При включённом штрафе — пропуск
        даёт -1.
      </li>
      <li>Раунд длится N секунд. Ход переходит следующей команде.</li>
      <li>Побеждает команда, достигшая цели по очкам.</li>
    </ol>
  );

  const hotkeys = (
    <ul className="space-y-1">
      <li><kbd className="px-2 py-1 bg-white/10 rounded text-xs">Пробел</kbd> — «Отгадали»</li>
      <li><kbd className="px-2 py-1 bg-white/10 rounded text-xs">→</kbd> — «Пропуск»</li>
      <li><kbd className="px-2 py-1 bg-white/10 rounded text-xs">Enter</kbd> — старт/стоп</li>
    </ul>
  );

  return (
    <GameHowToPlayModal
      open={isOpen}
      onClose={onClose}
      gameTitle="Alias"
      rules={rules}
      hotkeys={hotkeys}
    />
  );
};
