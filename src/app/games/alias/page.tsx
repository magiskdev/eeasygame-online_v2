"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DICTIONARIES,
  type DictionaryKey,
  buildCustomDictionary,
} from "./components/lib/dictionaries";
import { HowToPlayModal } from "./components/HowToPlayModal";
import { SettingsModal } from "./components/SettingsModal";
import { Scoreboard } from "./components/Scoreboard";
import { TeamManager } from "./components/TeamManager";

type Team = { id: string; name: string; score: number };

type Settings = {
  roundSeconds: number; // длительность раунда
  goalPoints: number; // цель по очкам
  minusOnSkip: boolean; // штраф -1 за пропуск?
  skipLimit: number; // лимит пропусков за ход
  dictionary: DictionaryKey | "custom";
  customWordsRaw: string; // если выбирают 'custom'
};

function shuffle<T>(a: T[]): T[] {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function AliasGamePage() {
  // команды
  const [teams, setTeams] = useState<Team[]>([
    { id: crypto.randomUUID(), name: "Команда А", score: 0 },
    { id: crypto.randomUUID(), name: "Команда Б", score: 0 },
  ]);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);

  // настройки
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToOpen, setHowToOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => ({
    roundSeconds: 60,
    goalPoints: 30,
    minusOnSkip: false,
    skipLimit: 3,
    dictionary: "basic",
    customWordsRaw: "",
  }));

  // пул слов (перетасованный) + указатель текущего
  const wordsPool = useMemo(() => {
    const base =
      settings.dictionary === "custom"
        ? buildCustomDictionary(settings.customWordsRaw)
        : DICTIONARIES[settings.dictionary];
    return shuffle(base);
  }, [settings.dictionary, settings.customWordsRaw]);

  const [wordIdx, setWordIdx] = useState(0);
  const currentWord = wordsPool[wordIdx % wordsPool.length] ?? "—";

  // таймер и ход
  const [seconds, setSeconds] = useState(settings.roundSeconds);
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(1);

  // счёт за текущий ход + пропуски
  const [turnScore, setTurnScore] = useState(0);
  const [skipsLeft, setSkipsLeft] = useState(settings.skipLimit);

  // победитель
  const winner = teams.find((t) => t.score >= settings.goalPoints) ?? null;

  useEffect(() => {
    // при смене настроек обновляем зависимые вещи для следующего хода
    if (!running) {
      setSeconds(settings.roundSeconds);
      setSkipsLeft(settings.skipLimit);
    }
  }, [settings, running]);

  // тик таймера
  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      endTurn();
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, seconds]);

  function startTurn() {
    if (winner) return;
    setTurnScore(0);
    setSkipsLeft(settings.skipLimit);
    setWordIdx((i) => i + 1); // выдать первое слово «на ход» заранее
    setSeconds(settings.roundSeconds);
    setRunning(true);
  }

  function endTurn() {
    setRunning(false);
    setSeconds(settings.roundSeconds);
    setSkipsLeft(settings.skipLimit);
    // начисляем команде очки за ход
    setTeams((ts) =>
      ts.map((t, i) =>
        i === activeTeamIdx
          ? { ...t, score: Math.max(0, t.score + turnScore) }
          : t
      )
    );
    setTurnScore(0);
    // следующий ход -> следующая команда
    setActiveTeamIdx((i) => (i + 1) % teams.length);
    // новый раунд после того, как все сходили
    setRound((r) => (activeTeamIdx + 1 === teams.length ? r + 1 : r));
  }

  function onCorrect() {
    if (!running) return;
    setTurnScore((s) => s + 1);
    setWordIdx((i) => i + 1);
  }

  function onSkip() {
    if (!running) return;
    if (skipsLeft <= 0) return;
    setSkipsLeft((x) => x - 1);
    if (settings.minusOnSkip) setTurnScore((s) => Math.max(0, s - 1));
    setWordIdx((i) => i + 1);
  }

  function resetGame() {
    setTeams((ts) => ts.map((t) => ({ ...t, score: 0 })));
    setRound(1);
    setActiveTeamIdx(0);
    setTurnScore(0);
    setSkipsLeft(settings.skipLimit);
    setSeconds(settings.roundSeconds);
    setRunning(false);
  }

  // хоткеи: пробел = правильно; стрелка вправо = скип; Enter = старт/пауза
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        running ? onCorrect() : startTurn();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        onSkip();
      } else if (e.code === "Enter") {
        e.preventDefault();
        running ? endTurn() : startTurn();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, onCorrect, onSkip]);

  return (
    <section className="space-y-6">
      {/* Верхняя панель */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Alias</h1>
          <p className="text-gray-400 text-sm">
            Раунд: {round} · Сейчас ходит:{" "}
            <span className="text-blue-300">{teams[activeTeamIdx]?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => setHowToOpen(true)}>
            Как играть
          </button>
          <button className="btn" onClick={() => setSettingsOpen(true)}>
            Настройки
          </button>
          <button className="btn" onClick={resetGame}>
            Сброс игры
          </button>
        </div>
      </header>

      {/* Счёт и команды */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card">
          {/* Таймер / слово / управление ходом */}
          <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
            <span>
              Время: <b className="text-white">{seconds}s</b>
            </span>
            <span>
              Счёт за ход: <b className="text-white">+{turnScore}</b>
            </span>
            <span>
              Пропуски: <b className="text-white">{skipsLeft}</b> /{" "}
              {settings.skipLimit}
            </span>
          </div>

          <div className="h-[220px] grid place-items-center">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={running ? currentWord : `idle-${turnScore}-${seconds}`}
                initial={{ y: 18, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -18, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="text-4xl font-extrabold text-center leading-tight"
              >
                {running ? currentWord : "Нажми «Старт» или пробел"}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {running ? (
              <>
                <button
                  className="btn btn-primary"
                  onClick={onCorrect}
                  title="Пробел"
                >
                  Отгадали (+1)
                </button>
                <button
                  className="btn"
                  onClick={onSkip}
                  disabled={skipsLeft <= 0}
                  title="→"
                >
                  Пропуск{settings.minusOnSkip ? " (-1)" : ""} ({skipsLeft})
                </button>
                <button className="btn" onClick={endTurn} title="Enter">
                  Завершить ход
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={startTurn}
                title="Пробел / Enter"
              >
                Старт
              </button>
            )}
          </div>
        </div>

        <aside className="card space-y-4">
          <Scoreboard
            teams={teams}
            activeIdx={activeTeamIdx}
            goal={settings.goalPoints}
          />
          <TeamManager
            teams={teams}
            onAdd={(name) =>
              setTeams((ts) => [
                ...ts,
                { id: crypto.randomUUID(), name, score: 0 },
              ])
            }
            onRename={(id, name) =>
              setTeams((ts) =>
                ts.map((t) => (t.id === id ? { ...t, name } : t))
              )
            }
            onRemove={(id) => {
              setTeams((ts) => ts.filter((t) => t.id !== id));
              setActiveTeamIdx(0);
            }}
            disabledWhileRunning={running}
          />
        </aside>
      </div>

      {/* Победитель */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="card border-2 border-green-500/50"
          >
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">Победа!</div>
              <div className="text-gray-300">
                {winner.name} достигли цели в {settings.goalPoints} очков 🎉
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модалки */}
      <HowToPlayModal open={howToOpen} onClose={() => setHowToOpen(false)} />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        value={settings}
        onChange={setSettings}
      />
    </section>
  );
}
