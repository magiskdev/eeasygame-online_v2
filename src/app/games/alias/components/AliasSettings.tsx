"use client";

import React, { useMemo } from "react";
import { GameSettingsModal, type GameSettingsField } from "shared/ui";
import { DICTIONARIES, type DictionaryKey, buildCustomDictionary } from "./lib/dictionaries";

export type AliasSettings = {
  roundSeconds: number;
  goalPoints: number;
  minusOnSkip: boolean;
  skipLimit: number;
  dictionary: DictionaryKey | "custom";
  customWordsRaw: string;
};

export interface AliasSettingsProps {
  open: boolean;
  onClose: () => void;
  settings: AliasSettings;
  onSave: (settings: AliasSettings) => void;
}

export const AliasSettings: React.FC<AliasSettingsProps> = ({
  open,
  onClose,
  settings,
  onSave,
}) => {
  const fields: GameSettingsField[] = [
    {
      key: 'roundSeconds',
      label: 'Длительность раунда (сек.)',
      type: 'number',
      min: 10,
      max: 300,
      step: 5,
    },
    {
      key: 'goalPoints',
      label: 'Цель по очкам',
      type: 'number',
      min: 5,
      max: 100,
      step: 5,
    },
    {
      key: 'skipLimit',
      label: 'Лимит пропусков за ход',
      type: 'number',
      min: 0,
      max: 10,
      step: 1,
    },
    {
      key: 'minusOnSkip',
      label: 'Штраф -1 за пропуск',
      type: 'boolean',
    },
    {
      key: 'dictionary',
      label: 'Словарь',
      type: 'select',
      options: [
        { value: 'basic', label: 'Базовый' },
        { value: 'kids', label: 'Детский' },
        { value: 'hard', label: 'Сложный' },
        { value: 'it', label: 'IT-термины' },
        { value: 'custom', label: 'Свой словарь' },
      ],
    },
  ];

  // Добавляем поле для кастомного словаря, если выбран custom
  if (settings.dictionary === 'custom') {
    fields.push({
      key: 'customWordsRaw',
      label: 'Свои слова',
      type: 'textarea',
      placeholder: 'Введите слова через запятую или с новой строки...',
      description: 'Разделяйте слова запятыми или переносами строк',
    });
  }

  const totalWords = useMemo(() => {
    if (settings.dictionary === "custom") {
      return buildCustomDictionary(settings.customWordsRaw).length;
    }
    return DICTIONARIES[settings.dictionary].length;
  }, [settings.dictionary, settings.customWordsRaw]);

  const additionalContent = (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="text-sm text-gray-300">
        <strong>Словарь:</strong> {settings.dictionary === 'custom' ? 'Пользовательский' : 
          settings.dictionary === 'basic' ? 'Базовый' :
          settings.dictionary === 'kids' ? 'Детский' :
          settings.dictionary === 'hard' ? 'Сложный' :
          settings.dictionary === 'it' ? 'IT-термины' : settings.dictionary}
      </div>
      <div className="text-sm text-gray-400">
        Всего слов: <strong>{totalWords}</strong>
      </div>
    </div>
  );

  return (
    <GameSettingsModal
      open={open}
      onClose={onClose}
      gameTitle="Alias"
      settings={settings}
      fields={fields}
      onSave={onSave}
      additionalContent={additionalContent}
    />
  );
};
