"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { CrocodileSettings, GameState, GameActions, Team, TurnLogItem } from '../lib/types';
import { DEFAULT_SETTINGS, DEFAULT_TEAMS } from '../lib/constants';
import { shuffle } from '../lib/utils';
import { PACKS, type CrocWord, buildCustomPack, difficultyPoints } from '../lib/dictionaries';

export function useCrocodileGame() {
  // Настройки
  const [settings, setSettings] = useState<CrocodileSettings>(DEFAULT_SETTINGS);
  
  // Состояние игры
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [hidden, setHidden] = useState(true);
  const [hintVisible, setHintVisible] = useState(false);
  const [seconds, setSeconds] = useState(settings.roundSeconds);
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(1);
  const [skipsLeft, setSkipsLeft] = useState(settings.skipLimit);
  const [turnScore, setTurnScore] = useState(0);
  const [turnLog, setTurnLog] = useState<TurnLogItem[]>([]);

  // Пул слов
  const pool = useMemo<CrocWord[]>(() => {
    const base = settings.pack === "custom"
      ? buildCustomPack(settings.customRaw)
      : PACKS[settings.pack as keyof typeof PACKS];
    return shuffle(base);
  }, [settings.pack, settings.customRaw]);

  // Текущее слово
  const current = pool.length ? pool[wordIdx % pool.length] : undefined;

  // Победитель
  const winner = teams.find((t) => t.score >= settings.goalPoints) ?? null;

  // Обновление зависимых значений при изменении настроек
  useEffect(() => {
    if (!running) {
      setSeconds(settings.roundSeconds);
      setSkipsLeft(settings.skipLimit);
    }
  }, [settings.roundSeconds, settings.skipLimit, running]);

  // Таймер
  useEffect(() => {
    if (!running || seconds <= 0) return;
    
    const timer = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, seconds]);

  // Показ подсказки
  useEffect(() => {
    if (!running || !settings.allowHints || hintVisible) return;
    
    const hintTimer = setTimeout(() => {
      setHintVisible(true);
    }, (settings.roundSeconds - settings.hintDelay) * 1000);

    return () => clearTimeout(hintTimer);
  }, [running, settings.allowHints, settings.hintDelay, settings.roundSeconds, hintVisible]);

  // Функции управления игрой
  const nextWord = useCallback(() => {
    setWordIdx(prev => prev + 1);
    setHidden(true);
    setHintVisible(false);
  }, []);

  const currentPoints = useCallback((w: CrocWord) => {
    return settings.difficultyScoring ? difficultyPoints[w.difficulty] : 1;
  }, [settings.difficultyScoring]);

  const startTurn = useCallback(() => {
    setRunning(true);
    setSeconds(settings.roundSeconds);
    setSkipsLeft(settings.skipLimit);
    setTurnScore(0);
    setHidden(true);
    setHintVisible(false);
  }, [settings.roundSeconds, settings.skipLimit]);

  const endTurn = useCallback(() => {
    setRunning(false);
    
    // Добавляем очки команде
    setTeams(prev => prev.map((t, i) => 
      i === activeTeamIdx 
        ? { ...t, score: t.score + turnScore }
        : t
    ));

    // Переходим к следующей команде
    setActiveTeamIdx(prev => (prev + 1) % teams.length);
    
    // Увеличиваем раунд если прошли полный круг команд
    if ((activeTeamIdx + 1) % teams.length === 0) {
      setRound(prev => prev + 1);
    }

    setTurnScore(0);
    setHidden(true);
    setHintVisible(false);
  }, [activeTeamIdx, teams.length, turnScore]);

  const onCorrect = useCallback(() => {
    if (!current) return;

    const points = currentPoints(current);
    setTurnScore(prev => prev + points);
    
    // Добавляем в лог
    setTurnLog(prev => [...prev, {
      teamId: teams[activeTeamIdx].id,
      word: current.word,
      difficulty: current.difficulty,
      category: current.category,
      result: "correct",
      points,
    }]);

    nextWord();
  }, [current, currentPoints, teams, activeTeamIdx, nextWord]);

  const onSkip = useCallback(() => {
    if (!current || skipsLeft <= 0) return;

    setSkipsLeft(prev => prev - 1);
    
    let points = 0;
    if (settings.minusOnSkip) {
      points = -1;
      setTurnScore(prev => prev - 1);
    }

    // Добавляем в лог
    setTurnLog(prev => [...prev, {
      teamId: teams[activeTeamIdx].id,
      word: current.word,
      difficulty: current.difficulty,
      category: current.category,
      result: "skip",
      points,
    }]);

    nextWord();
  }, [current, skipsLeft, settings.minusOnSkip, teams, activeTeamIdx, nextWord]);

  const resetGame = useCallback(() => {
    setTeams(prev => prev.map(t => ({ ...t, score: 0 })));
    setActiveTeamIdx(0);
    setWordIdx(0);
    setHidden(true);
    setHintVisible(false);
    setSeconds(settings.roundSeconds);
    setRunning(false);
    setRound(1);
    setSkipsLeft(settings.skipLimit);
    setTurnScore(0);
    setTurnLog([]);
  }, [settings.roundSeconds, settings.skipLimit]);

  const toggleWordVisibility = useCallback(() => {
    setHidden(prev => !prev);
  }, []);

  const updateTeams = useCallback((newTeams: Team[]) => {
    setTeams(newTeams);
  }, []);

  const setActiveTeam = useCallback((idx: number) => {
    setActiveTeamIdx(idx);
  }, []);

  const gameState: GameState = {
    teams,
    activeTeamIdx,
    wordIdx,
    hidden,
    hintVisible,
    seconds,
    running,
    round,
    skipsLeft,
    turnScore,
    turnLog,
  };

  const gameActions: GameActions = {
    startTurn,
    endTurn,
    onCorrect,
    onSkip,
    resetGame,
    nextWord,
    toggleWordVisibility,
    updateTeams,
    setActiveTeam,
  };

  return {
    settings,
    setSettings,
    gameState,
    gameActions,
    current,
    pool,
    winner,
    currentPoints,
  };
}
