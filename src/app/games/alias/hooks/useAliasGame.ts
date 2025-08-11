import { useState, useMemo, useCallback } from 'react';
import { DICTIONARIES, buildCustomDictionary } from '../components/lib/dictionaries';
import { shuffle, generateId } from '../lib/utils';
import { DEFAULT_SETTINGS, DEFAULT_TEAMS } from '../lib/constants';
import type { Team, AliasSettingsType, GameState, GameActions } from '../lib/types';

export function useAliasGame() {
  // Состояние команд
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);

  // Настройки игры
  const [settings, setSettings] = useState<AliasSettingsType>(DEFAULT_SETTINGS);

  // Состояние игры
  const [round, setRound] = useState(1);
  const [seconds, setSeconds] = useState(settings.roundSeconds);
  const [running, setRunning] = useState(false);
  const [turnScore, setTurnScore] = useState(0);
  const [skipsLeft, setSkipsLeft] = useState(settings.skipLimit);
  const [wordIdx, setWordIdx] = useState(0);

  // Пул слов (перетасованный)
  const wordsPool = useMemo(() => {
    const base = settings.dictionary === "custom"
      ? buildCustomDictionary(settings.customWordsRaw)
      : DICTIONARIES[settings.dictionary];
    return shuffle(base);
  }, [settings.dictionary, settings.customWordsRaw]);

  // Текущее слово
  const currentWord = wordsPool[wordIdx % wordsPool.length] ?? "—";

  // Победитель
  const winner = teams.find((t) => t.score >= settings.goalPoints) ?? null;

  // Действия игры
  const startTurn = useCallback(() => {
    if (winner) return;
    setTurnScore(0);
    setSkipsLeft(settings.skipLimit);
    setWordIdx((i) => i + 1); // выдать первое слово «на ход» заранее
    setSeconds(settings.roundSeconds);
    setRunning(true);
  }, [winner, settings.skipLimit, settings.roundSeconds]);

  const endTurn = useCallback(() => {
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
    
    // если прошли полный круг команд, увеличиваем раунд
    if ((activeTeamIdx + 1) % teams.length === 0) {
      setRound((r) => r + 1);
    }
  }, [activeTeamIdx, teams.length, turnScore, settings.roundSeconds, settings.skipLimit]);

  const onCorrect = useCallback(() => {
    if (!running) return;
    setTurnScore((s) => s + 1);
    setWordIdx((i) => i + 1);
  }, [running]);

  const onSkip = useCallback(() => {
    if (!running || skipsLeft <= 0) return;
    setSkipsLeft((s) => s - 1);
    if (settings.minusOnSkip) {
      setTurnScore((s) => s - 1);
    }
    setWordIdx((i) => i + 1);
  }, [running, skipsLeft, settings.minusOnSkip]);

  const resetGame = useCallback(() => {
    setTeams((ts) => ts.map((t) => ({ ...t, score: 0 })));
    setRound(1);
    setActiveTeamIdx(0);
    setTurnScore(0);
    setSkipsLeft(settings.skipLimit);
    setSeconds(settings.roundSeconds);
    setRunning(false);
  }, [settings.skipLimit, settings.roundSeconds]);

  const updateTeams = useCallback((newTeams: Team[]) => {
    setTeams(newTeams);
  }, []);

  // Управление командами
  const addTeam = useCallback((name: string) => {
    const newTeam: Team = {
      id: generateId(),
      name,
      score: 0,
    };
    setTeams((ts) => [...ts, newTeam]);
  }, []);

  const renameTeam = useCallback((id: string, name: string) => {
    setTeams((ts) => ts.map((t) => (t.id === id ? { ...t, name } : t)));
  }, []);

  const removeTeam = useCallback((id: string) => {
    setTeams((ts) => ts.filter((t) => t.id !== id));
    setActiveTeamIdx(0);
  }, []);

  // Состояние игры
  const gameState: GameState = {
    teams,
    activeTeamIdx,
    round,
    seconds,
    running,
    turnScore,
    skipsLeft,
    wordIdx,
    winner,
  };

  // Функции паузы
  const pauseGame = () => {
    setRunning(false);
  };

  const resumeGame = () => {
    if (seconds > 0) {
      setRunning(true);
    }
  };

  // Действия игры
  const gameActions: GameActions = {
    startTurn,
    endTurn,
    onCorrect,
    onSkip,
    resetGame,
    updateTeams,
    setActiveTeamIdx,
    pauseGame,
    resumeGame,
  };

  return {
    // Состояние
    gameState,
    settings,
    currentWord,
    wordsPool,
    
    // Действия
    gameActions,
    setSettings,
    setSeconds,
    setRunning,
    
    // Управление командами
    addTeam,
    renameTeam,
    removeTeam,
  };
}
