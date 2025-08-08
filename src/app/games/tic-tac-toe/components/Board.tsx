"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cell } from "../lib/types";

export function Board({
  size,
  board,
  winLine,
  hintIndex,
  onClick,
}: {
  size: number;
  board: Cell[];
  winLine: number[] | null;
  hintIndex: number | null;
  onClick: (i: number) => void;
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(56px, 1fr))` }}
    >
      {board.map((c, i) => {
        const isWin = winLine?.includes(i);
        const hinted = hintIndex === i;
        return (
          <motion.button
            key={i}
            className={`relative aspect-square rounded-xl border text-3xl font-bold
            ${
              isWin
                ? "border-emerald-400 bg-emerald-500/10"
                : "border-white/10 bg-white/5"
            }
            ${!c ? "hover:bg-white/10" : ""}`}
            onClick={() => onClick(i)}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="popLayout">
              {c && (
                <motion.span
                  key={c}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="select-none"
                >
                  {c}
                </motion.span>
              )}
            </AnimatePresence>
            {hinted && !c && (
              <span className="absolute inset-0 rounded-xl ring-2 ring-amber-300 pointer-events-none" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
