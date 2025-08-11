"use client";

import React from "react";
import { GameHowToPlayModal } from "shared/ui";
import { KEYBOARD_SHORTCUTS } from "../lib/constants";

interface CrocodileHowToPlayProps {
  open: boolean;
  onClose: () => void;
}

export function CrocodileHowToPlay({ open, onClose }: CrocodileHowToPlayProps) {
  const rules = [
    "Игра для команд от 2 человек. Один игрок показывает слово жестами, остальные отгадывают.",
    "Ведущий команды видит слово на экране и показывает его жестами без слов и звуков.",
    "Команда должна отгадать как можно больше слов за отведенное время.",
    "За каждое отгаданное слово команда получает очки (1 или по сложности: легкое=1, среднее=2, сложное=3).",
    "Можно пропускать сложные слова, но есть лимит пропусков за ход.",
    "При включенном штрафе за пропуск команда теряет 1 очко.",
    "Побеждает команда, первой набравшая целевое количество очков.",
    "Ведущие в команде чередуются каждый ход для справедливости.",
  ];

  return (
    <GameHowToPlayModal
      open={open}
      onClose={onClose}
      gameTitle="Крокодил"
      rules={rules}
      keyboardShortcuts={KEYBOARD_SHORTCUTS}
    />
  );
}
