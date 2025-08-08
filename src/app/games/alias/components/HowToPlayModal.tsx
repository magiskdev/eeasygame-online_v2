"use client";

import { Modal } from "shared/ui/Modal";

export function HowToPlayModal(props: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={props.open} onClose={props.onClose} title="Как играть в Alias">
      <ol className="list-decimal pl-6 space-y-2 text-sm">
        <li>
          Разделитесь на 2+ команд. В свой ход один игрок объясняет слова своей
          команде.
        </li>
        <li>Запрещены однокоренные слова, переводы и прямые подсказки.</li>
        <li>За каждое отгаданное слово — +1 очко команде.</li>
        <li>
          Можно пропускать слова (лимит на ход). При включённом штрафе — пропуск
          даёт -1.
        </li>
        <li>Раунд длится N секунд. Ход переходит следующей команде.</li>
        <li>Побеждает команда, достигшая цели по очкам.</li>
        <li>
          Горячие клавиши: пробел — «Отгадали», → — «Пропуск», Enter —
          старт/стоп.
        </li>
      </ol>
    </Modal>
  );
}
