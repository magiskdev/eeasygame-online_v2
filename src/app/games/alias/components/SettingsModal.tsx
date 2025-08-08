"use client";

import React, { useMemo, useState } from "react";
import {
  DICTIONARIES,
  type DictionaryKey,
} from "../components/lib/dictionaries";
import { Modal } from "shared/ui/Modal";

type Settings = {
  roundSeconds: number;
  goalPoints: number;
  minusOnSkip: boolean;
  skipLimit: number;
  dictionary: DictionaryKey | "custom";
  customWordsRaw: string;
};

export function SettingsModal(props: {
  open: boolean;
  onClose: () => void;
  value: Settings;
  onChange: (s: Settings) => void;
}) {
  const [draft, setDraft] = useState<Settings>(props.value);

  React.useEffect(() => setDraft(props.value), [props.value, props.open]);

  const totalWords = useMemo(() => {
    if (draft.dictionary === "custom") {
      return draft.customWordsRaw
        .split(/\r?\n|,/)
        .map((w) => w.trim())
        .filter(Boolean).length;
    }
    return DICTIONARIES[draft.dictionary].length;
  }, [draft]);

  function apply() {
    props.onChange(draft);
    props.onClose();
  }

  return (
    <Modal open={props.open} onClose={props.onClose} title="Настройки игры">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-gray-300">
              Длительность раунда (сек.)
            </span>
            <input
              type="number"
              min={15}
              max={300}
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
              value={draft.roundSeconds}
              onChange={(e) =>
                setDraft((s) => ({
                  ...s,
                  roundSeconds: Math.max(15, +e.target.value || 60),
                }))
              }
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-300">Цель по очкам</span>
            <input
              type="number"
              min={5}
              max={200}
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
              value={draft.goalPoints}
              onChange={(e) =>
                setDraft((s) => ({
                  ...s,
                  goalPoints: Math.max(1, +e.target.value || 30),
                }))
              }
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-300">
              Лимит пропусков за ход
            </span>
            <input
              type="number"
              min={0}
              max={20}
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
              value={draft.skipLimit}
              onChange={(e) =>
                setDraft((s) => ({
                  ...s,
                  skipLimit: Math.max(0, +e.target.value || 3),
                }))
              }
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-300">Штраф за пропуск</span>
            <select
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
              value={draft.minusOnSkip ? "yes" : "no"}
              onChange={(e) =>
                setDraft((s) => ({
                  ...s,
                  minusOnSkip: e.target.value === "yes",
                }))
              }
            >
              <option value="no">Нет</option>
              <option value="yes">Да (-1)</option>
            </select>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-gray-300">Словарь</span>
            <select
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
              value={draft.dictionary}
              onChange={(e) =>
                setDraft((s) => ({ ...s, dictionary: e.target.value as any }))
              }
            >
              <option value="basic">Базовый</option>
              <option value="kids">Детский</option>
              <option value="hard">Сложный</option>
              <option value="it">IT</option>
              <option value="custom">Пользовательский…</option>
            </select>
            <div className="text-xs text-gray-400 mt-1">
              Слов в текущем словаре: {totalWords}
            </div>
          </label>

          {draft.dictionary === "custom" && (
            <label className="block md:col-span-1">
              <span className="text-sm text-gray-300">
                Свои слова (по одному в строке или через запятую)
              </span>
              <textarea
                rows={6}
                className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
                placeholder="пример: Слон, Телевизор, Программист…"
                value={draft.customWordsRaw}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, customWordsRaw: e.target.value }))
                }
              />
            </label>
          )}
        </div>

        <div className="text-right">
          <button className="btn" onClick={props.onClose}>
            Отмена
          </button>
          <button className="btn btn-primary ml-2" onClick={apply}>
            Сохранить
          </button>
        </div>
      </div>
    </Modal>
  );
}
