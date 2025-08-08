"use client";

import React from "react";
import { Modal } from "shared/ui/Modal";
import { Settings } from "../lib/types";

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

  function apply() {
    onChange(draft);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Настройки">
      <div className="grid md:grid-cols-2 gap-3">
        <Select
          label="Режим"
          value={draft.mode}
          onChange={(v) => setDraft((s) => ({ ...s, mode: v as any }))}
          options={[
            ["pvp", "PvP"],
            ["pvai", "Игрок vs ИИ"],
          ]}
        />
        <Select
          label="Сложность ИИ"
          value={draft.ai}
          onChange={(v) => setDraft((s) => ({ ...s, ai: v as any }))}
          options={[
            ["easy", "Easy"],
            ["medium", "Medium"],
            ["hard", "Hard"],
          ]}
        />
        <Select
          label="Размер поля"
          value={String(draft.size)}
          onChange={(v) => setDraft((s) => ({ ...s, size: +v }))}
          options={[
            ["3", "3×3"],
            ["4", "4×4"],
            ["5", "5×5"],
          ]}
        />
        <Num
          label="Выигрышная длина"
          value={draft.winLength}
          min={3}
          max={5}
          onChange={(n) => setDraft((s) => ({ ...s, winLength: n }))}
        />
        <Num
          label="До побед в серии"
          value={draft.seriesTo}
          min={1}
          max={10}
          onChange={(n) => setDraft((s) => ({ ...s, seriesTo: n }))}
        />
        <Num
          label="Секунд на ход"
          value={draft.perMoveSeconds}
          min={3}
          max={60}
          onChange={(n) => setDraft((s) => ({ ...s, perMoveSeconds: n }))}
        />
        <Checkbox
          label="Включить подсказки"
          checked={draft.hints}
          onChange={(v) => setDraft((s) => ({ ...s, hints: v }))}
        />
      </div>

      <div className="text-right mt-4">
        <button className="btn" onClick={onClose}>
          Отмена
        </button>
        <button className="btn btn-primary ml-2" onClick={apply}>
          Сохранить
        </button>
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
  value: string;
  onChange: (v: string) => void;
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
