"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export interface GameSettingsField {
  key: string;
  label: string;
  type: 'number' | 'boolean' | 'select' | 'textarea';
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  description?: string;
}

export interface GameSettingsModalProps<T extends Record<string, any>> {
  open: boolean;
  onClose: () => void;
  gameTitle: string;
  settings: T;
  fields: GameSettingsField[];
  onSave: (settings: T) => void;
  additionalContent?: React.ReactNode;
}

export function GameSettingsModal<T extends Record<string, any>>({
  open,
  onClose,
  gameTitle,
  settings,
  fields,
  onSave,
  additionalContent,
}: GameSettingsModalProps<T>) {
  const [draft, setDraft] = useState<T>(settings);

  useEffect(() => {
    if (open) {
      setDraft(settings);
    }
  }, [settings, open]);

  const handleFieldChange = (key: string, value: any) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  const renderField = (field: GameSettingsField) => {
    const value = draft[field.key];

    switch (field.type) {
      case 'number':
        return (
          <input
            type="number"
            value={value}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-blue-400 focus:outline-none"
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 rounded focus:ring-blue-500"
            />
            <span className="text-sm">{field.label}</span>
          </label>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-blue-400 focus:outline-none"
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-blue-400 focus:outline-none resize-none"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Настройки — ${gameTitle}`}>
      <div className="space-y-4">
        <div className="grid gap-4">
          {fields.map((field) => (
            <div key={field.key}>
              {field.type !== 'boolean' && (
                <label className="block text-sm text-gray-300 mb-1">
                  {field.label}
                </label>
              )}
              {renderField(field)}
              {field.description && (
                <p className="text-xs text-gray-400 mt-1">{field.description}</p>
              )}
            </div>
          ))}
        </div>

        {additionalContent}

        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </div>
    </Modal>
  );
}
