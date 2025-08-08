"use client";

import React from "react";

export function Controls({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onHint,
}: {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onHint?: () => void;
}) {
  return (
    <div className="flex gap-2 justify-center mt-3">
      <button className="btn" onClick={onUndo} disabled={!canUndo} title="Z">
        Undo
      </button>
      <button className="btn" onClick={onRedo} disabled={!canRedo} title="Y">
        Redo
      </button>
      {onHint && (
        <button className="btn" onClick={onHint} title="H">
          Подсказка
        </button>
      )}
    </div>
  );
}
