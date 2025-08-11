"use client";

import React, { useMemo } from "react";
import { GameSettingsModal, type GameSettingsField } from "shared/ui";
import { PACKS, buildCustomPack } from "../lib/dictionaries";
import type { CrocodileSettings } from "../lib/types";

interface CrocodileSettingsProps {
  open: boolean;
  onClose: () => void;
  settings: CrocodileSettings;
  onSave: (settings: CrocodileSettings) => void;
}

export function CrocodileSettings({ open, onClose, settings, onSave }: CrocodileSettingsProps) {
  const fields: GameSettingsField[] = useMemo(() => {
    const baseFields: GameSettingsField[] = [
      {
        key: 'roundSeconds',
        label: 'Длительность раунда (сек.)',
        type: 'number' as const,
        min: 30,
        max: 300,
        step: 5,
      },
      {
        key: 'goalPoints',
        label: 'Цель по очкам',
        type: 'number' as const,
        min: 5,
        max: 100,
        step: 1,
      },
      {
        key: 'skipLimit',
        label: 'Лимит пропусков за ход',
        type: 'number' as const,
        min: 0,
        max: 10,
        step: 1,
      },
      {
        key: 'minusOnSkip',
        label: 'Штраф -1 очко за пропуск',
        type: 'boolean' as const,
      },
      {
        key: 'pack',
        label: 'Словарь',
        type: 'select' as const,
        options: [
          { value: 'basic', label: 'Базовый' },
          { value: 'kids', label: 'Детский' },
          { value: 'hard', label: 'Сложный' },
          { value: 'it', label: 'IT-термины' },
          { value: 'custom', label: 'Свой словарь' },
        ],
      },
      {
        key: 'difficultyScoring',
        label: 'Очки по сложности (1/2/3)',
        type: 'boolean' as const,
        description: 'Если выключено, за любое слово дается 1 очко',
      },
      {
        key: 'allowHints',
        label: 'Разрешить подсказки',
        type: 'boolean' as const,
      },
      {
        key: 'hintDelay',
        label: 'Задержка подсказки (сек.)',
        type: 'number' as const,
        min: 5,
        max: 60,
        step: 5,
      },
    ];

    const customField = settings.pack === 'custom' ? [{
      key: 'customRaw' as const,
      label: 'Свои слова (через запятую)',
      type: 'textarea' as const,
      placeholder: 'кот, собака, дом, машина...',
    }] : [];

    return [...baseFields, ...customField];
  }, [settings.pack]);

  const wordsCount = useMemo(() => {
    if (settings.pack === 'custom') {
      return buildCustomPack(settings.customRaw).length;
    }
    return PACKS[settings.pack as keyof typeof PACKS]?.length || 0;
  }, [settings.pack, settings.customRaw]);

  const additionalContent = (
    <div className="text-sm text-gray-400">
      Доступно слов: <span className="font-mono tabular-nums font-semibold text-blue-400">
        {wordsCount}
      </span>
    </div>
  );

  return (
    <GameSettingsModal
      open={open}
      onClose={onClose}
      gameTitle="Крокодил"
      settings={settings}
      fields={fields}
      onSave={onSave}
      additionalContent={additionalContent}
    />
  );
}
