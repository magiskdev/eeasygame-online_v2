"use client";

import React, { useMemo, useState } from "react";
import { PackKey, PACKS } from "../lib/dictionaries";
import { Modal } from "shared/ui/Modal";

type Settings = {
  roundSeconds: number;
  goalPoints: number;
  skipLimit: number;
  minusOnSkip: boolean;
  pack: PackKey | "custom";
  customRaw: string;
  difficultyScoring: boolean;
  allowHints: boolean;
  hintDelay: number;
};

export function SettingsModal({
  open,
  onClose,
  value,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  value: Settings;
  onChange: (s: Settings) => void;
}) {
  const [draft, setDraft] = useState<Settings>(value);
  React.useEffect(() => setDraft(value), [value, open]);

  const totalWords = useMemo(() => {
    if (draft.pack === "custom") {
      return draft.customRaw
        .split(/\r?\n|,/)
        .map((w) => w.trim())
        .filter(Boolean).length;
    }
    return PACKS[draft.pack].length;
  }, [draft]);

  function apply() {
    onChange(draft);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Настройки игры">
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
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
                  roundSeconds: Math.max(15, +e.target.value || 90),
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
                  goalPoints: Math.max(5, +e.target.value || 20),
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
            <span className="text-sm text-gray-300">Пак слов</span>
            <select
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
              value={draft.pack}
              onChange={(e) =>
                setDraft((s) => ({ ...s, pack: e.target.value as any }))
              }
            >
              <option value="basic">Базовый</option>
              <option value="actions">Действия</option>
              <option value="animals">Животные</option>
              <option value="movies">Кино</option>
              <option value="hard">Сложный</option>
              <option value="custom">Пользовательский…</option>
            </select>
            <div className="text-xs text-gray-400 mt-1">
              Слов в текущем паке: {totalWords}
            </div>
          </label>

          {draft.pack === "custom" && (
            <label className="block">
              <span className="text-sm text-gray-300">
                Свои слова (один в строке или через запятую)
              </span>
              <textarea
                rows={6}
                className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
                placeholder="пример: Кофеварка, Фейерверк, Скейтборд…"
                value={draft.customRaw}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, customRaw: e.target.value }))
                }
              />
            </label>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.difficultyScoring}
              onChange={(e) =>
                setDraft((s) => ({ ...s, difficultyScoring: e.target.checked }))
              }
            />
            <span className="text-sm text-gray-300">
              Очки по сложности (1/2/3)
            </span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 col-span-2 md:col-span-1">
              <input
                type="checkbox"
                checked={draft.allowHints}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, allowHints: e.target.checked }))
                }
              />
              <span className="text-sm text-gray-300">
                Разрешить намёки ведущему
              </span>
            </label>
            <label className="block">
              <span className="text-sm text-gray-300">
                Задержка намёка (сек.)
              </span>
              <input
                type="number"
                min={3}
                max={120}
                className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
                value={draft.hintDelay}
                onChange={(e) =>
                  setDraft((s) => ({
                    ...s,
                    hintDelay: Math.max(3, +e.target.value || 20),
                  }))
                }
              />
            </label>
          </div>
        </div>

        <div className="text-right">
          <button className="btn" onClick={onClose}>
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
