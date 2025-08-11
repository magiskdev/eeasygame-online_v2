"use client";

import React, { useMemo, useState } from "react";
import { GameSettingsModal, type GameSettingsField } from "shared/ui";
import { DICTIONARIES, buildCustomDictionary, type DictionaryKey } from "./lib/dictionaries";
import type { AliasSettingsType } from "../lib/types";

export interface AliasSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AliasSettingsType;
  onSettingsChange: (settings: AliasSettingsType) => void;
}

export const AliasSettings: React.FC<AliasSettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  const fields: GameSettingsField[] = useMemo(() => {
    const baseFields: GameSettingsField[] = [
      {
        key: 'roundSeconds',
        label: 'Длительность раунда (сек.)',
        type: 'number' as const,
        min: 10,
        max: 300,
        step: 5,
      },
      {
        key: 'goalPoints',
        label: 'Цель по очкам',
        type: 'number' as const,
        min: 5,
        max: 100,
        step: 5,
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
        label: 'Штраф -1 за пропуск',
        type: 'boolean' as const,
      },
      {
        key: 'dictionary',
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
    ];
    
    const customField = settings.dictionary === 'custom' ? [{
      key: 'customWordsRaw' as const,
      label: 'Свои слова (через запятую)',
      type: 'textarea' as const,
      placeholder: 'кот, собака, дом, машина...',
    }] : [];
    
    return [...baseFields, ...customField];
  }, [settings.dictionary]);

  const wordsCount = useMemo(() => {
    if (settings.dictionary === 'custom') {
      return buildCustomDictionary(settings.customWordsRaw).length;
    }
    return DICTIONARIES[settings.dictionary]?.length ?? 0;
  }, [settings.dictionary, settings.customWordsRaw]);

  return (
    <GameSettingsModal
      open={isOpen}
      onClose={onClose}
      gameTitle="Alias"
      settings={settings}
      onSave={onSettingsChange}
      fields={fields}
      additionalContent={
        <div className="text-sm text-gray-400">
          Слов в словаре: <strong>{wordsCount}</strong>
        </div>
      }
    />
  );
};
