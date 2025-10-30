import React from 'react';
import { GameSettingsModal } from 'shared/ui/GameSettingsModal';
import type { Settings } from '../lib/types';
import { SUGGESTED_TIMERS } from '../lib/constants';

const CATEGORIES = [
  { key: 'classic', label: 'Классика' },
  { key: 'travel', label: 'Путешествия' },
  { key: 'fun', label: 'Весёлые' },
] as const;

interface SpySettingsProps {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export const SpySettings: React.FC<SpySettingsProps> = ({
  open,
  onClose,
  settings,
  onSave,
}) => {
  const settingsContent = (
    <div className="space-y-6">
      {/* Время раунда */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Время раунда
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SUGGESTED_TIMERS.map((time) => (
            <button
              key={time}
              onClick={() => onSave({ ...settings, roundSeconds: time })}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                settings.roundSeconds === time
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <input
            type="range"
            min={60}
            max={1200}
            step={30}
            value={settings.roundSeconds}
            onChange={(e) => onSave({ ...settings, roundSeconds: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 мин</span>
            <span className="font-medium">
              {Math.floor(settings.roundSeconds / 60)}:{(settings.roundSeconds % 60).toString().padStart(2, '0')}
            </span>
            <span>20 мин</span>
          </div>
        </div>
      </div>

      {/* Количество шпионов */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Количество шпионов
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'auto', label: 'Автоматически' },
            { key: 'one', label: '1 шпион' },
            { key: 'two', label: '2 шпиона' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => onSave({ ...settings, spies: option.key as any })}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                settings.spies === option.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {settings.spies === 'auto' && (
          <div className="mt-3">
            <label className="block text-xs text-gray-400 mb-1">
              Порог для 2 шпионов (количество игроков): {settings.allowSecondSpyThreshold}
            </label>
            <input
              type="range"
              min={6}
              max={12}
              value={settings.allowSecondSpyThreshold}
              onChange={(e) => onSave({ ...settings, allowSecondSpyThreshold: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>6</span>
              <span>12</span>
            </div>
          </div>
        )}
      </div>

      {/* Режим раскрытия карт */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Режим раскрытия карт
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'private', label: 'Приватно', desc: 'Каждый видит только свою роль' },
            { key: 'public', label: 'Публично', desc: 'Локация видна всем на экране' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => onSave({ ...settings, revealMode: option.key as any })}
              className={`p-3 text-sm rounded-lg transition-colors text-left ${
                settings.revealMode === option.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs opacity-75 mt-1">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Категории локаций */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Категории локаций
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.key}
              onClick={() => {
                const newCategories = settings.includeCategories.includes(category.key as any)
                  ? settings.includeCategories.filter(c => c !== category.key)
                  : [...settings.includeCategories, category.key as any];
                onSave({ ...settings, includeCategories: newCategories });
              }}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                settings.includeCategories.includes(category.key as any)
                  ? 'bg-green-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Пользовательские локации */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Пользовательские локации
        </label>
        <textarea
          rows={4}
          value={settings.customLocationsRaw}
          onChange={(e) => onSave({ ...settings, customLocationsRaw: e.target.value })}
          placeholder="Введите локации по одной в строке:&#10;Караоке-бар&#10;Стройплощадка&#10;Киностудия"
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          Добавьте свои локации, по одной в строке
        </p>
      </div>

      {/* Дополнительные настройки */}
      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.allowSpyGuess}
            onChange={(e) => onSave({ ...settings, allowSpyGuess: e.target.checked })}
            className="w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
          />
          <div>
            <div className="text-sm font-medium text-gray-300">
              Разрешить шпионам угадывать локацию
            </div>
            <div className="text-xs text-gray-400">
              Шпионы смогут попытаться угадать локацию для мгновенной победы
            </div>
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <GameSettingsModal
      open={open}
      onClose={onClose}
      title="Настройки Spy"
      content={settingsContent}
    />
  );
};
