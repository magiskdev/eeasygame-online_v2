import React from 'react';
import { Modal } from 'shared/ui/Modal';

interface RoundLogModalProps {
  open: boolean;
  onClose: () => void;
  items: string[];
}

export const RoundLogModal: React.FC<RoundLogModalProps> = ({
  open,
  onClose,
  items,
}) => {
  return (
    <Modal open={open} onClose={onClose} title="Лог раунда">
      {items.length === 0 ? (
        <div className="text-sm text-gray-400 text-center py-8">
          Лог пуст. События появятся здесь во время игры.
        </div>
      ) : (
        <div className="max-h-80 overflow-auto">
          <ul className="text-sm space-y-2">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 p-2 rounded bg-white/5"
              >
                <span className="text-gray-400 text-xs mt-0.5 font-mono">
                  {String(index + 1).padStart(2, '0')}.
                </span>
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
};
