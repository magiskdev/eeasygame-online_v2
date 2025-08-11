"use client";

import { Modal } from "shared/ui/Modal";

type Item = {
  teamId: string;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  category?: string;
  result: "correct" | "skip";
  points: number;
};

export function RoundLogModal({
  open,
  onClose,
  items,
  teams,
}: {
  open: boolean;
  onClose: () => void;
  items: Item[];
  teams: { id: string; name: string }[];
}) {
  const byTeam = new Map(teams.map((t) => [t.id, t.name]));
  const json = JSON.stringify(items, null, 2);

  return (
    <Modal open={open} onClose={onClose} title="Лог текущей игры">
      <div className="space-y-3">
        {!items.length && (
          <p className="text-gray-400 text-sm">
            Пока пусто. Лог будет пополняться по мере игры.
          </p>
        )}
        {!!items.length && (
          <div className="max-h-64 overflow-auto rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="py-1 pr-2">Команда</th>
                  <th className="py-1 pr-2">Слово</th>
                  <th className="py-1 pr-2">Категория</th>
                  <th className="py-1 pr-2">Сложность</th>
                  <th className="py-1 pr-2">Результат</th>
                  <th className="py-1 pr-2">Очки</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-1 pr-2">
                      {byTeam.get(it.teamId) || "—"}
                    </td>
                    <td className="py-1 pr-2">{it.text}</td>
                    <td className="py-1 pr-2">{it.category || "—"}</td>
                    <td className="py-1 pr-2">{it.difficulty}</td>
                    <td className="py-1 pr-2">
                      {it.result === "correct" ? "Отгадано" : "Пропуск"}
                    </td>
                    <td className="py-1 pr-2">
                      {it.points >= 0 ? `+${it.points}` : it.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!!items.length && (
          <>
            <p className="text-xs text-gray-400">
              Ниже — JSON лога (можно скопировать).
            </p>
            <pre className="max-h-48 overflow-auto text-xs rounded-xl border border-white/10 bg-white/5 p-3">
              {json}
            </pre>
          </>
        )}
      </div>
    </Modal>
  );
}
