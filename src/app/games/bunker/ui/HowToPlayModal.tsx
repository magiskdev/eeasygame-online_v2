"use client";
import React from "react";
import { Modal } from "shared/ui/Modal";

export function HowToPlayModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Как играть в «Бункер»">
      <ol className="list-decimal pl-6 space-y-2 text-sm">
        <li>Создаётся партия с персонажами и скрытыми атрибутами.</li>
        <li>
          Каждый раунд раскрывается один тип атрибута у всех выживших (порядок
          настраивается).
        </li>
        <li>
          Обсуждение по таймеру, затем — голосование за одного игрока на вылет.
        </li>
        <li>
          Некоторые игроки могут один раз за игру перекинуть один атрибут (кроме
          спец-условия).
        </li>
        <li>
          Игра длится, пока живых не останется столько, сколько вмещает бункер —
          они «выжили».
        </li>
      </ol>
      <div className="text-xs text-gray-400 mt-2">
        Совет: ведите краткие заметки или используйте «Лог» справа вверху.
      </div>
    </Modal>
  );
}
