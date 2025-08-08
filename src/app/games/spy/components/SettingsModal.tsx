"use client";

import React from "react";
import { Modal } from "shared/ui/Modal";
import { Settings } from "../lib/types";

const CATS = [
  ["classic", "Классика"],
  ["travel", "Путешествия"],
  ["fun", "Весёлые"],
] as const;

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
  const [draft, setDraft] = React.useState<Settings>(value);
  React.useEffect(() => setDraft(value), [value, open]);

  function toggleCategory(cat: "classic" | "travel" | "fun") {
    setDraft((s) => {
      const set = new Set(s.includeCategories);
      set.has(cat) ? set.delete(cat) : set.add(cat);
      return { ...s, includeCategories: Array.from(set) as any };
    });
  }

  function apply() {
    onChange(draft);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Настройки раунда">
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <Num
            label="Длительность (сек.)"
            value={draft.roundSeconds}
            min={60}
            max={1200}
            onChange={(n) => setDraft((s) => ({ ...s, roundSeconds: n }))}
          />
          <Select
            label="Число шпионов"
            value={draft.spies}
            options={[
              ["auto", "Авто"],
              ["one", "1 шпион"],
              ["two", "2 шпиона"],
            ]}
            onChange={(v) => setDraft((s) => ({ ...s, spies: v as any }))}
          />
          {draft.spies === "auto" && (
            <Num
              label="Порог 2 шпионов (игроков)"
              value={draft.allowSecondSpyThreshold}
              min={6}
              max={12}
              onChange={(n) =>
                setDraft((s) => ({ ...s, allowSecondSpyThreshold: n }))
              }
            />
          )}
          <Select
            label="Режим карточек"
            value={draft.revealMode}
            options={[
              ["private", "Приватно"],
              ["public", "Публично"],
            ]}
            onChange={(v) => setDraft((s) => ({ ...s, revealMode: v as any }))}
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-300">Категории локаций</div>
          <div className="flex flex-wrap gap-2">
            {CATS.map(([k, title]) => {
              const active = draft.includeCategories.includes(k as any);
              return (
                <button
                  key={k}
                  className={"btn " + (active ? "btn-primary" : "")}
                  onClick={() => toggleCategory(k)}
                >
                  {title}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="text-sm text-gray-300">
            Свои локации (по одной в строке)
          </span>
          <textarea
            rows={5}
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
            placeholder="Караоке-бар\nСтройплощадка\nКиностудия"
            value={draft.customLocationsRaw}
            onChange={(e) =>
              setDraft((s) => ({ ...s, customLocationsRaw: e.target.value }))
            }
          />
        </label>

        <div className="grid md:grid-cols-2 gap-3">
          <Checkbox
            label="Разрешить угадывать локацию шпионом"
            checked={draft.allowSpyGuess}
            onChange={(v) => setDraft((s) => ({ ...s, allowSpyGuess: v }))}
          />
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

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="text-sm text-gray-300">{label}</span>
      <select
        className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
function Num({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <label className="block">
      <span className="text-sm text-gray-300">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
        value={value}
        onChange={(e) =>
          onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))
        }
      />
    </label>
  );
}
function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm text-gray-300">{label}</span>
    </label>
  );
}
