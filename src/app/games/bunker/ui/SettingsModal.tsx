"use client";
import React from "react";
import type { BunkerSettings, RevealKey, Catastrophe } from "../lib/types";
import { Modal } from "shared/ui/Modal";

const ORDER_LABEL: Record<RevealKey, string> = {
  profession: "Профессия",
  health: "Здоровье",
  biology: "Биология",
  hobby: "Хобби",
  fact: "Факт",
  baggage: "Багаж",
  special: "Спец-условие",
};

export function SettingsModal({
  open,
  onClose,
  value,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  value: BunkerSettings;
  onChange: (v: BunkerSettings) => void;
}) {
  const [draft, setDraft] = React.useState<BunkerSettings>(value);
  React.useEffect(() => setDraft(value), [value, open]);

  function move(key: RevealKey, dir: -1 | 1) {
    const i = draft.revealOrder.indexOf(key);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= draft.revealOrder.length) return;
    const arr = draft.revealOrder.slice();
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setDraft((s) => ({ ...s, revealOrder: arr }));
  }

  function save() {
    onChange(draft);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Настройки">
      <div className="grid md:grid-cols-2 gap-3">
        <Num
          label="Игроков"
          min={4}
          max={16}
          value={draft.playersCount}
          onChange={(n) => setDraft((s) => ({ ...s, playersCount: n }))}
        />
        <Num
          label="Вместимость бункера"
          min={2}
          max={12}
          value={draft.bunkerCapacity}
          onChange={(n) => setDraft((s) => ({ ...s, bunkerCapacity: n }))}
        />
        <Num
          label="Время обсуждения (сек.)"
          min={30}
          max={300}
          value={draft.discussionSeconds}
          onChange={(n) => setDraft((s) => ({ ...s, discussionSeconds: n }))}
        />
        <Select
          label="Катастрофа"
          value={draft.catastrophe}
          onChange={(v) =>
            setDraft((s) => ({ ...s, catastrophe: v as Catastrophe }))
          }
          options={[
            ["nuclear", "Ядерная зима"],
            ["pandemic", "Суперинфекция"],
            ["asteroid", "Астероид"],
            ["ai", "Восстание ИИ"],
            ["climate", "Климатический коллапс"],
          ]}
        />
        <Select
          label="Размер бункера"
          value={draft.bunker.size}
          onChange={(v) =>
            setDraft((s) => ({ ...s, bunker: { ...s.bunker, size: v as any } }))
          }
          options={[
            ["малый", "малый"],
            ["средний", "средний"],
            ["большой", "большой"],
          ]}
        />
        <Select
          label="Запасы"
          value={draft.bunker.supplies}
          onChange={(v) =>
            setDraft((s) => ({
              ...s,
              bunker: { ...s.bunker, supplies: v as any },
            }))
          }
          options={[
            ["на 3 месяца", "на 3 месяца"],
            ["на 6 месяцев", "на 6 месяцев"],
            ["на 9 месяцев", "на 9 месяцев"],
            ["на 12 месяцев", "на 12 месяцев"],
          ]}
        />
      </div>

      <div className="mt-3">
        <div className="text-sm text-gray-300 mb-1">Доп. оборудование</div>
        <div className="flex flex-wrap gap-2">
          {[
            "генератор",
            "медблок",
            "мастерская",
            "гидропоника",
            "серверная",
            "оружейная",
          ].map((x) => {
            const on = draft.bunker.extras.includes(x);
            return (
              <button
                key={x}
                className={"btn " + (on ? "btn-primary" : "")}
                onClick={() => {
                  setDraft((s) => {
                    const set = new Set(s.bunker.extras);
                    on ? set.delete(x) : set.add(x);
                    return {
                      ...s,
                      bunker: { ...s.bunker, extras: Array.from(set) },
                    };
                  });
                }}
              >
                {x}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-sm text-gray-300 mb-1">Порядок раскрытия</div>
        <ul className="space-y-2">
          {draft.revealOrder.map((k) => (
            <li key={k} className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-sm w-48">
                {ORDER_LABEL[k]}
              </span>
              <button className="btn" onClick={() => move(k, -1)}>
                ↑
              </button>
              <button className="btn" onClick={() => move(k, 1)}>
                ↓
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3">
        <Checkbox
          label="Разрешить каждому 1 перекидывание (кроме спец-условий)"
          checked={draft.allowRerollOnce}
          onChange={(v) => setDraft((s) => ({ ...s, allowRerollOnce: v }))}
        />
      </div>

      <div className="text-right mt-4">
        <button className="btn" onClick={onClose}>
          Отмена
        </button>
        <button className="btn btn-primary ml-2" onClick={save}>
          Сохранить
        </button>
      </div>
    </Modal>
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
