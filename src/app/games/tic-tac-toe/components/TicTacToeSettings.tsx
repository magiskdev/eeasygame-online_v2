"use client";

import React from "react";
import { GameSettingsModal, type GameSettingsField } from "shared/ui";

export type TicTacToeSettings = {
  boardSize: number;
  winLength: number;
  turnTimeLimit: number;
  gameMode: "pvp" | "pve";
  aiDifficulty: "easy" | "medium" | "hard";
};

export interface TicTacToeSettingsProps {
  open: boolean;
  onClose: () => void;
  settings: TicTacToeSettings;
  onSave: (settings: TicTacToeSettings) => void;
}

export const TicTacToeSettings: React.FC<TicTacToeSettingsProps> = ({
  open,
  onClose,
  settings,
  onSave,
}) => {
  const fields: GameSettingsField[] = [
    {
      key: "boardSize",
      label: "Размер поля",
      type: "number",
      min: 3,
      max: 10,
      step: 1,
    },
    {
      key: "winLength",
      label: "Длина для победы",
      type: "number",
      min: 3,
      max: settings.boardSize,
      step: 1,
    },
    {
      key: "turnTimeLimit",
      label: "Время на ход (сек)",
      type: "number",
      min: 5,
      max: 300,
      step: 5,
    },
    {
      key: "gameMode",
      label: "Режим игры",
      type: "select",
      options: [
        { value: "pvp", label: "Игрок против игрока" },
        { value: "pve", label: "Игрок против ИИ" },
      ],
    },
    {
      key: "aiDifficulty",
      label: "Сложность ИИ",
      type: "select",
      options: [
        { value: "easy", label: "Легкая" },
        { value: "medium", label: "Средняя" },
        { value: "hard", label: "Сложная" },
      ],
    },
  ];

  return (
    <GameSettingsModal
      open={open}
      onClose={onClose}
      gameTitle="Крестики-нолики"
      settings={settings}
      fields={fields}
      onSave={onSave}
    />
  );
};
