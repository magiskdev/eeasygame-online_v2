"use client";

import React from "react";
import { Modal } from "./Modal";

export interface GameHowToPlayModalProps {
  open: boolean;
  onClose: () => void;
  gameTitle: string;
  rules: React.ReactNode;
  hotkeys?: React.ReactNode;
}

export const GameHowToPlayModal: React.FC<GameHowToPlayModalProps> = ({
  open,
  onClose,
  gameTitle,
  rules,
  hotkeys,
}) => {
  return (
    <Modal open={open} onClose={onClose} title={`Как играть в ${gameTitle}`}>
      <div className="space-y-4">
        <div className="text-sm">
          {rules}
        </div>
        
        {hotkeys && (
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Горячие клавиши:
            </h4>
            <div className="text-sm text-gray-400">
              {hotkeys}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
