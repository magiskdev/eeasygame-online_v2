"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PACKS,
  type PackKey,
  type CrocWord,
  buildCustomPack,
  pickWord,
  difficultyPoints,
} from "./lib/dictionaries";
import { HowToPlayModal } from "./components/HowToPlayModal";
import { SettingsModal } from "./components/SettingsModal";
import { Scoreboard } from "./components/Scoreboard";
import { TeamManager } from "./components/TeamManager";
import { PresenterQueue } from "./components/PresenterQueue";
import { RoundLogModal } from "./components/RoundLogModal";

type Team = { id: string; name: string; score: number; presenters: string[] }; // имена ведущих (ротация внутри команды)

type Settings = {
  roundSeconds: number; // длительность раунда
  goalPoints: number; // цель по очкам
  skipLimit: number; // пропусков на ход
  minusOnSkip: boolean; // штраф -1 очко за пропуск
  pack: PackKey | "custom"; // выбор словаря
  customRaw: string; // свои слова
  difficultyScoring: boolean; // очки по сложности (1/2/3) вместо фиксированного 1
  allowHints: boolean; // разрешить подсказку ведущему
  hintDelay: number; // через сколько секунд показать «намёк» ведущему
};

type TurnLogItem = {
  teamId: string;
  word: string;
  difficulty: "easy" | "medium" | "hard";
  category?: string;
  result: "correct" | "skip";
  points: number;
};

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CrocodileGamePage() {
  // Команды
  const [teams, setTeams] = useState<Team[]>([
    {
      id: crypto.randomUUID(),
      name: "Команда А",
      score: 0,
      presenters: ["Аня", "Иван"],
    },
    {
      id: crypto.randomUUID(),
      name: "Команда Б",
      score: 0,
      presenters: ["Оля", "Сергей"],
    },
  ]);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);

  // Настройки / модалки
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToOpen, setHowToOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => ({
    roundSeconds: 90,
    goalPoints: 20,
    skipLimit: 3,
    minusOnSkip: false,
    pack: "basic",
    customRaw: "",
    difficultyScoring: true,
    allowHints: true,
    hintDelay: 20,
  }));

  // Пул слов (перетасованный)
  const pool = useMemo<CrocWord[]>(() => {
    const base =
      settings.pack === "custom"
        ? buildCustomPack(settings.customRaw)
        : PACKS[settings.pack];
    return shuffle(base);
  }, [settings.pack, settings.customRaw]);

  // Текущее слово + скрыто/показано
  const [wordIdx, setWordIdx] = useState(0);
  const current = pool.length ? pool[wordIdx % pool.length] : undefined;
  const [hidden, setHidden] = useState(true); // чтобы смотреть только ведущему
  const [hintVisible, setHintVisible] = useState(false);

  // Таймер/ход
  const [seconds, setSeconds] = useState(settings.roundSeconds);
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(1);

  // Счёты
  const [skipsLeft, setSkipsLeft] = useState(settings.skipLimit);
  const [turnScore, setTurnScore] = useState(0);

  // Лог
  const [turnLog, setTurnLog] = useState<TurnLogItem[]>([]);

  // Победитель?
  const winner = teams.find((t) => t.score >= settings.goalPoints) ?? null;

  // Обновление зависимых значений при изменении настроек
  useEffect(() => {
    if (!running) {
      setSeconds(settings.roundSeconds);
      setSkipsLeft(settings.skipLimit);
    }
  }, [settings, running]);

  // Таймер
  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      endTurn();
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, seconds]);

  // Подсказка ведущему через N сек.
  useEffect(() => {
    if (!running || !settings.allowHints) {
      setHintVisible(false);
      return;
    }
    setHintVisible(false);
    const id = setTimeout(
      () => setHintVisible(true),
      Math.max(3, settings.hintDelay) * 1000
    );
    return () => clearTimeout(id);
  }, [running, wordIdx, settings.allowHints, settings.hintDelay]);

  // Хоткеи
  const hotkeysInit = useRef(false);
  useEffect(() => {
    if (hotkeysInit.current) return;
    hotkeysInit.current = true;
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
      } else if (e.key.toLowerCase() === "h") {
        e.preventDefault();
        setHidden((h) => !h);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function nextWord() {
    setWordIdx((i) => i + 1);
    setHidden(true);
    setHintVisible(false);
  }

  function currentPoints(w: CrocWord) {
    if (!settings.difficultyScoring) return 1;
    return difficultyPoints[w.difficulty];
  }

  function startTurn() {
    if (winner) return;
    setTurnScore(0);
    setSkipsLeft(settings.skipLimit);
    setSeconds(settings.roundSeconds);
    setHidden(true);
    setHintVisible(false);
    // выдаём слово
    setWordIdx((i) => i + 1);
    setRunning(true);
  }

  function endTurn() {
    setRunning(false);
    setSeconds(settings.roundSeconds);
    setSkipsLeft(settings.skipLimit);
    setHidden(true);
    setHintVisible(false);
    // начислить очки команде
    setTeams((ts) =>
      ts.map((t, i) =>
        i === activeTeamIdx
          ? { ...t, score: Math.max(0, t.score + turnScore) }
          : t
      )
    );
    setTurnScore(0);
    // ротация ведущего внутри команды
    setTeams((ts) =>
      ts.map((t, i) => {
        if (i !== activeTeamIdx) return t;
        if (t.presenters.length <= 1) return t;
        const [first, ...rest] = t.presenters;
        return { ...t, presenters: [...rest, first] };
      })
    );
    // переход хода
    setActiveTeamIdx((i) => (i + 1) % teams.length);
    setRound((r) => (activeTeamIdx + 1 === teams.length ? r + 1 : r));
  }

  function onCorrect() {
    if (!running || !current) return;
    const pts = currentPoints(current);
    setTurnScore((s) => s + pts);
    setTurnLog((log) => [
      {
        teamId: teams[activeTeamIdx].id,
        word: current.text,
        difficulty: current.difficulty,
        category: current.category,
        result: "correct",
        points: pts,
      },
      ...log,
    ]);
    nextWord();
  }

  function onSkip() {
    if (!running || !current) return;
    if (skipsLeft <= 0) return;
    setSkipsLeft((x) => x - 1);
    if (settings.minusOnSkip) setTurnScore((s) => Math.max(0, s - 1));
    setTurnLog((log) => [
      {
        teamId: teams[activeTeamIdx].id,
        word: current.text,
        difficulty: current.difficulty,
        category: current.category,
        result: "skip",
        points: settings.minusOnSkip ? -1 : 0,
      },
      ...log,
    ]);
    nextWord();
  }

  function resetGame() {
    setTeams((ts) => ts.map((t) => ({ ...t, score: 0 })));
    setTurnLog([]);
    setRound(1);
    setActiveTeamIdx(0);
    setSeconds(settings.roundSeconds);
    setTurnScore(0);
    setSkipsLeft(settings.skipLimit);
    setRunning(false);
    setHidden(true);
    setHintVisible(false);
  }

  const activeTeam = teams[activeTeamIdx];
  const presenter = activeTeam?.presenters?.[0];

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Крокодил</h1>
          <p className="text-gray-400 text-sm">
            Раунд: {round} · Сейчас ходит:{" "}
            <span className="text-blue-300">{activeTeam?.name}</span>
            {presenter ? (
              <>
                {" "}
                · Ведущий: <span className="text-blue-300">{presenter}</span>
              </>
            ) : null}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={() => setHowToOpen(true)}>
            Как играть
          </button>
          <button className="btn" onClick={() => setSettingsOpen(true)}>
            Настройки
          </button>
          <button className="btn" onClick={() => setLogOpen(true)}>
            Лог
          </button>
          <button className="btn" onClick={resetGame}>
            Сброс игры
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Игровая зона */}
        <div className="lg:col-span-2 card">
          {/* Панель статусов */}
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

          {/* Слово / скрытое слово */}
          <div className="min-h-[220px] grid place-items-center relative">
            <AnimatePresence mode="wait">
              {hidden ? (
                <motion.button
                  key="hidden"
                  className="btn"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={() => setHidden(false)}
                  title="Нажми, чтобы показать слово ведущему (H)"
                >
                  Показать слово ведущему
                </motion.button>
              ) : (
                <motion.div
                  key={current?.text || "word"}
                  initial={{ y: 18, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -18, opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="text-center"
                >
                  <div className="text-xs text-gray-400 mb-1">
                    {current?.category
                      ? `Категория: ${current.category} · `
                      : ""}
                    Сложность: {current?.difficulty}
                    {settings.difficultyScoring
                      ? ` · +${currentPoints(current!)} очк.`
                      : null}
                  </div>
                  <div className="text-4xl font-extrabold">
                    {current?.text ?? "—"}
                  </div>

                  {/* Ненавязчивая подсказка ведущему */}
                  {settings.allowHints && hintVisible && current?.hint && (
                    <div className="mt-3 text-sm text-amber-300 opacity-80">
                      Намёк: {current.hint}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Полупрозрачная шторка для приватности, если скрыто */}
            {hidden && (
              <div className="absolute inset-0 bg-black/40 rounded-xl pointer-events-none" />
            )}
          </div>

          {/* Управление */}
          <div className="flex flex-wrap gap-3 justify-center mt-3">
            {running ? (
              <>
                <button
                  className="btn btn-primary"
                  onClick={onCorrect}
                  title="Пробел"
                >
                  Отгадали
                </button>
                <button
                  className="btn"
                  onClick={onSkip}
                  disabled={skipsLeft <= 0}
                  title="→"
                >
                  Пропуск{settings.minusOnSkip ? " (-1)" : ""} ({skipsLeft})
                </button>
                <button
                  className="btn"
                  onClick={() => setHidden((h) => !h)}
                  title="H"
                >
                  {hidden ? "Показать" : "Скрыть"} слово (H)
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

        {/* Правый сайдбар: счёт + управление командами + очередь ведущих */}
        <aside className="space-y-6">
          <div className="card">
            <Scoreboard
              teams={teams}
              activeIdx={activeTeamIdx}
              goal={settings.goalPoints}
            />
          </div>
          <div className="card">
            <PresenterQueue
              team={teams[activeTeamIdx]}
              onUpdate={(newPresenters) =>
                setTeams((ts) =>
                  ts.map((t, i) =>
                    i === activeTeamIdx
                      ? { ...t, presenters: newPresenters }
                      : t
                  )
                )
              }
              disabled={running}
            />
          </div>
          <div className="card">
            <TeamManager
              teams={teams}
              onAdd={(name) =>
                setTeams((ts) => [
                  ...ts,
                  { id: crypto.randomUUID(), name, score: 0, presenters: [] },
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
          </div>
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
      <RoundLogModal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        items={turnLog}
        teams={teams}
      />
    </section>
  );
}
