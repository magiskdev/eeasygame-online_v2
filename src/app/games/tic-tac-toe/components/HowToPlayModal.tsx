"use client";

import { Modal } from "shared/ui/Modal";

export function HowToPlayModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Как играть в Крестики-нолики">
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>Играют ✖ X и ◯ O поочерёдно.</li>
        <li>
          Цель — собрать линию из K символов (по
          горизонтали/вертикали/диагонали).
        </li>
        <li>
          Есть таймер на ход, Undo/Redo, режимы PvP и PvAI (несколько
          сложностей).
        </li>
        <li>
          Горячие клавиши: Z — Undo, Y — Redo, H — подсказка, N — новая партия.
        </li>
      </ul>
    </Modal>
  );
}
