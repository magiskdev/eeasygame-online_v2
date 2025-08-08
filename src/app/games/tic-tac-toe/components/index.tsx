'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Board } from './Board';
import { Controls } from './Controls';
import { Scoreboard } from './Scoreboard';
import { Challenges } from './Challenges';
import { HowToPlayModal } from './HowToPlayModal';
import { SettingsModal } from './SettingsModal';
import { usePerMoveTimer } from '../lib/usePerMoveTimer';
import { aiBestMove } from '../lib/ai';
import { buildEmpty, checkState, coordsToIndex, indexToCoords, nextPlayer } from '../lib/rules';
import type { Cell, GameMode, Player, State, Settings, ChallengeKey, Move } from '../lib/types';

export const TicTacToe: React.FC = () => {
  // настройки (можно вынести в zustand при желании)
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howtoOpen, setHowtoOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    mode: 'pvai',
    ai: 'medium',
    size: 3,
    winLength: 3,
    seriesTo: 3,
    perMoveSeconds: 10,
    hints: true,
  });

  // поле и состояние партии
  const [board, setBoard] = useState<Cell[]>(() => buildEmpty(settings.size));
  const [xIsNext, setXIsNext] = useState(true);
  const [moves, setMoves] = useState<Move[]>([]);   // стек ходов
  const [redoStack, setRedo] = useState<Move[]>([]);

  // серия
  const [scores, setScores] = useState<{ X: number; O: number; draw: number }>({ X: 0, O: 0, draw: 0 });

  // таймер хода
  const { seconds, start, stop, resetTo } = usePerMoveTimer(settings.perMoveSeconds);
  const lockedRef = useRef(false); // чтобы не ловить двойных кликов
  const current: Player = xIsNext ? 'X' : 'O';

  // пересчёт состояния
  const state: State = useMemo(
    () => checkState(board, settings.size, settings.winLength),
    [board, settings.size, settings.winLength]
  );

  // авто-ход ИИ
  useEffect(() => {
    const isAI = settings.mode === 'pvai' && current === 'O' && !state.winner;
    if (!isAI) return;
    lockedRef.current = true;
    const id = setTimeout(() => {
      const idx = aiBestMove(board, settings.size, settings.winLength, 'O', settings.ai);
      if (idx != null) applyMove(idx, 'O');
      lockedRef.current = false;
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line
  }, [state, current, board, settings.mode, settings.ai]);

  // инициализация таймера на каждый ход
  useEffect(() => {
    if (state.winner) {
      stop();
      return;
    }
    resetTo(settings.perMoveSeconds);
    start();
  }, [xIsNext, settings.perMoveSeconds, start, resetTo, stop, state.winner]);

  // истёк таймер — пропустить ход
  useEffect(() => {
    if (seconds <= 0 && !state.winner) {
      // пропуск: ставим «пустой» ход и меняем игрока
      setMoves(prev => [...prev, { index: -1, player: current, skip: true }]);
      setRedo([]);
      setXIsNext(x => !x);
      resetTo(settings.perMoveSeconds);
    }
  }, [seconds, state.winner, current, resetTo, settings.perMoveSeconds]);

  // когда партия закончилась — апдейт серии и новая партия
  useEffect(() => {
    if (!state.winner) return;
    const id = setTimeout(() => {
      if (state.winner === 'draw') {
        setScores(s => ({ ...s, draw: s.draw + 1 }));
      } else {
        setScores(s => ({ ...s, [state.winner!]: (s as any)[state.winner!] + 1 }));
      }
      newRound();
    }, 900);
    return () => clearTimeout(id);
    // eslint-disable-next-line
  }, [state.winner]);

  const seriesWinner = useMemo(() => {
    if (scores.X >= settings.seriesTo) return 'X';
    if (scores.O >= settings.seriesTo) return 'O';
    return null;
  }, [scores, settings.seriesTo]);

  // хоткеи
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'z') undo();
      if (e.key.toLowerCase() === 'y') redo();
      if (e.key.toLowerCase() === 'h') tryHint();
      if (e.key.toLowerCase() === 'n') newRound(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line
  }, [board, moves, redoStack, settings, xIsNext]);

  function applyMove(index: number, p: Player) {
    if (index < 0) return;
    setBoard(b => {
      if (b[index]) return b;
      const next = b.slice();
      next[index] = p;
      return next;
    });
    setMoves(prev => [...prev, { index, player: p }]);
    setRedo([]);
    setXIsNext(x => !x);
  }

  function onCellClick(index: number) {
    if (lockedRef.current) return;
    if (state.winner || board[index]) return;
    if (settings.mode === 'pvai' && current === 'O') return;
    applyMove(index, current);
  }

  function undo() {
    if (!moves.length || state.winner) return;
    const last = moves[moves.length - 1];
    setMoves(prev => prev.slice(0, -1));
    setRedo(prev => [last, ...prev]);
    if (!last.skip) {
      setBoard(b => {
        const n = b.slice();
        n[last.index] = null;
        return n;
      });
    }
    setXIsNext(x => !x);
  }

  function redo() {
    const [first, ...rest] = redoStack;
    if (!first) return;
    if (!first.skip) {
      setBoard(b => {
        if (b[first.index]) return b;
        const n = b.slice();
        n[first.index] = first.player;
        return n;
      });
    }
    setMoves(prev => [...prev, first]);
    setRedo(rest);
    setXIsNext(x => !x);
  }

  function newRound(resetStarter = false) {
    setBoard(buildEmpty(settings.size));
    setMoves([]);
    setRedo([]);
    setXIsNext(resetStarter ? true : !xIsNext); // меняем стартующего
  }

  function hardReset() {
    setScores({ X: 0, O: 0, draw: 0 });
    setBoard(buildEmpty(settings.size));
    setMoves([]);
    setRedo([]);
    setXIsNext(true);
  }

  function tryHint() {
    if (!settings.hints || state.winner) return;
    // простая эвристика подсказки — используем тот же эвристический скоуп ИИ для текущего игрока
    const idx = aiBestMove(board, settings.size, settings.winLength, current, 'medium', { forHint: true });
    if (idx != null) {
      // «подсветка»: запишем маркер на 700мс; Board подсветит
      highlightCell(idx);
    }
  }

  // подсветка ячейки-подсказки
  const [hintIndex, setHintIndex] = useState<number | null>(null);
  function highlightCell(i: number) {
    setHintIndex(i);
    setTimeout(() => setHintIndex(null), 700);
  }

  // динамический пересчёт winLength по size, если надо
  useEffect(() => {
    if (settings.size === 3 && settings.winLength !== 3) setSettings(s => ({ ...s, winLength: 3 }));
    if (settings.size === 4 && settings.winLength !== 4) setSettings(s => ({ ...s, winLength: 4 }));
    if (settings.size === 5 && settings.winLength < 4) setSettings(s => ({ ...s, winLength: 4 }));
  }, [settings.size]);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Крестики-нолики</h1>
          <p className="text-gray-400 text-sm">
            Режим: {settings.mode === 'pvai' ? 'Игрок vs ИИ' : 'Игрок vs Игрок'} · Поле: {settings.size}×{settings.size} · Выигрыш: {settings.winLength} подряд
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={() => setHowtoOpen(true)}>Как играть</button>
          <button className="btn" onClick={() => setSettingsOpen(true)}>Настройки</button>
          <button className="btn" onClick={newRound}>Новая партия (N)</button>
          <button className="btn" onClick={hardReset}>Сброс серии</button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
            <span>Ход: <b className="text-white">{current}</b></span>
            <span>Время на ход: <b className="text-white">{seconds}s</b></span>
            <span>Результат: <b className="text-white">{state.winner ?? '—'}</b></span>
          </div>

          <Board
            size={settings.size}
            board={board}
            winLine={state.line}
            hintIndex={hintIndex}
            onClick={onCellClick}
          />

          <Controls
            canUndo={moves.length > 0}
            canRedo={redoStack.length > 0}
            onUndo={undo}
            onRedo={redo}
            onHint={settings.hints ? tryHint : undefined}
          />

          <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-gray-300">
            <div className="font-semibold mb-1">Ходы:</div>
            {moves.length === 0 ? (
              <div className="text-gray-400">Пока нет ходов</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {moves.map((m, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg bg-white/10 border border-white/10">
                    {m.skip ? `${m.player}: пропуск` : `${m.player}: ${indexToCoords(m.index, settings.size)}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card">
            <Scoreboard scores={scores} target={settings.seriesTo} seriesWinner={seriesWinner} />
          </div>
          <div className="card">
            <Challenges moves={moves} board={board} size={settings.size} current={current} />
          </div>
        </aside>
      </div>

      <HowToPlayModal open={howtoOpen} onClose={() => setHowtoOpen(false)} />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        value={settings}
        onChange={(s) => {
          // при изменении размера — сброс текущей партии
          const sizeChanged = s.size !== settings.size || s.winLength !== settings.winLength;
          setSettings(s);
          if (sizeChanged) {
            setBoard(buildEmpty(s.size));
            setMoves([]); setRedo([]);
            setXIsNext(true);
          }
        }}
      />
    </section>
  );
};
