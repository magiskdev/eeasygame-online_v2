import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { Player, Settings, GameState, GameActions, Phase, Vote, RoundResult, LocationCard } from '../lib/types';
import { DEFAULT_SETTINGS } from '../lib/constants';
import { shuffle, generateId } from '../lib/utils';
import { LOCATIONS, buildCustomLocations } from '../data/locations';

export function useSpyGame() {
  // Настройки
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Состояние игры
  const [players, setPlayers] = useState<Player[]>([]);
  const [phase, setPhase] = useState<Phase>('lobby');
  const [seconds, setSeconds] = useState(settings.roundSeconds);
  const [running, setRunning] = useState(false);
  const [location, setLocation] = useState<LocationCard | null>(null);
  const [spyIds, setSpyIds] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [vote, setVote] = useState<Vote>({ accusedId: null, votes: {} });
  const [result, setResult] = useState<RoundResult | null>(null);
  const [roundLog, setRoundLog] = useState<string[]>([]);

  // Таймер
  const timerRef = useRef<number | null>(null);

  // Пул локаций
  const locationDeck = useMemo(() => {
    const base = Object.values(LOCATIONS)
      .filter((l) => settings.includeCategories.includes(l.category));
    const custom = buildCustomLocations(settings.customLocationsRaw);
    return shuffle([...base, ...custom]);
  }, [settings.includeCategories, settings.customLocationsRaw]);

  // Обновление времени при изменении настроек
  useEffect(() => {
    if (!running) {
      setSeconds(settings.roundSeconds);
    }
  }, [settings.roundSeconds, running]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Таймер обратного отсчета
  useEffect(() => {
    if (running && phase === 'playing') {
      timerRef.current = window.setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setRunning(false);
            setPhase('ended');
            const newResult: RoundResult = { winner: 'spies', reason: 'time' };
            setResult(newResult);
            setRoundLog(prev => [...prev, 'Время вышло! Победили шпионы.']);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [running, phase]);

  const calcSpyCount = useCallback((count: number) => {
    if (settings.spies === 'one') return 1;
    if (settings.spies === 'two') return 2;
    // auto
    return count >= settings.allowSecondSpyThreshold ? 2 : 1;
  }, [settings.spies, settings.allowSecondSpyThreshold]);

  const addPlayer = useCallback((name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    
    const newPlayer: Player = {
      id: generateId(),
      name: trimmedName,
    };
    setPlayers(prev => [...prev, newPlayer]);
  }, []);

  const removePlayer = useCallback((id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  }, []);

  const startRound = useCallback(() => {
    if (players.length < 3) return;
    
    const deck = locationDeck.length ? locationDeck : Object.values(LOCATIONS);
    const selectedLocation = deck[Math.floor(Math.random() * deck.length)];
    const spyCount = calcSpyCount(players.length);

    const shuffledPlayers = shuffle(players);
    const selectedSpyIds = shuffledPlayers.slice(0, spyCount).map(p => p.id);

    setLocation(selectedLocation);
    setSpyIds(selectedSpyIds);
    setPhase('playing');
    setRunning(true);
    setSeconds(settings.roundSeconds);
    setRevealed({});
    setVote({ accusedId: null, votes: {} });
    setResult(null);
    setRoundLog([
      `Раунд начался! Локация: ${selectedLocation.name}`,
      `Шпионов: ${spyCount} из ${players.length} игроков`
    ]);
  }, [players, locationDeck, calcSpyCount, settings.roundSeconds]);

  const stopTimer = useCallback(() => {
    setRunning(false);
  }, []);

  const endRound = useCallback((roundResult: RoundResult) => {
    setRunning(false);
    setPhase('ended');
    setResult(roundResult);
    
    const winnerText = roundResult.winner === 'spies' ? 'Шпионы' : 'Горожане';
    let reasonText = '';
    
    switch (roundResult.reason) {
      case 'time':
        reasonText = 'время вышло';
        break;
      case 'spy_guess':
        reasonText = 'шпион угадал локацию';
        break;
      case 'accused_spy':
        reasonText = 'шпиона обвинили и исключили';
        break;
      case 'accused_civil':
        reasonText = 'горожанина обвинили и исключили';
        break;
    }
    
    setRoundLog(prev => [...prev, `Игра окончена! Победили ${winnerText} (${reasonText}).`]);
  }, []);

  const resetAll = useCallback(() => {
    setPhase('lobby');
    setRunning(false);
    setSeconds(settings.roundSeconds);
    setLocation(null);
    setSpyIds([]);
    setRevealed({});
    setVote({ accusedId: null, votes: {} });
    setResult(null);
    setRoundLog([]);
  }, [settings.roundSeconds]);

  const toggleReveal = useCallback((id: string) => {
    setRevealed(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const isSpy = useCallback((id: string) => {
    return spyIds.includes(id);
  }, [spyIds]);

  const setAccused = useCallback((id: string) => {
    setPhase('voting');
    setVote({ accusedId: id, votes: {} });
    const playerName = players.find(p => p.id === id)?.name || 'Неизвестный';
    setRoundLog(prev => [...prev, `${playerName} обвинен в шпионаже. Начинается голосование.`]);
  }, [players]);

  const castVote = useCallback((voterId: string, up: boolean) => {
    setVote(prev => ({
      ...prev,
      votes: { ...prev.votes, [voterId]: up }
    }));
  }, []);

  const resolveVote = useCallback(() => {
    if (!vote.accusedId) return;
    
    const accusedPlayer = players.find(p => p.id === vote.accusedId);
    if (!accusedPlayer) return;

    const votingPlayers = players.filter(p => p.id !== vote.accusedId);
    const yesVotes = Object.values(vote.votes).filter(v => v).length;
    const totalVotes = votingPlayers.length;
    const majority = Math.ceil(totalVotes / 2);
    
    const accusedIsSpy = isSpy(vote.accusedId);
    
    if (yesVotes >= majority) {
      // Большинство проголосовало "за" исключение
      if (accusedIsSpy) {
        // Исключили шпиона - горожане побеждают
        endRound({ winner: 'civilians', reason: 'accused_spy' });
      } else {
        // Исключили горожанина - шпионы побеждают
        endRound({ winner: 'spies', reason: 'accused_civil' });
      }
    } else {
      // Большинство против исключения - игра продолжается
      setPhase('playing');
      setVote({ accusedId: null, votes: {} });
      setRoundLog(prev => [...prev, `${accusedPlayer.name} оправдан. Игра продолжается.`]);
    }
  }, [vote, players, isSpy, endRound]);

  const spyGuessLocation = useCallback((guess: string) => {
    if (!location || !settings.allowSpyGuess) return;
    
    const guessNormalized = guess.toLowerCase().trim();
    const locationNormalized = location.name.toLowerCase().trim();
    
    if (guessNormalized === locationNormalized) {
      // Шпион угадал - шпионы побеждают
      endRound({ winner: 'spies', reason: 'spy_guess' });
    } else {
      // Шпион не угадал - горожане побеждают
      endRound({ winner: 'civilians', reason: 'spy_guess' });
    }
    
    setRoundLog(prev => [...prev, `Шпион попытался угадать локацию: "${guess}"`]);
  }, [location, settings.allowSpyGuess, endRound]);

  const gameState: GameState = {
    players,
    phase,
    seconds,
    running,
    location,
    spyIds,
    revealed,
    vote,
    result,
    roundLog,
  };

  const gameActions: GameActions = {
    addPlayer,
    removePlayer,
    startRound,
    stopTimer,
    endRound,
    resetAll,
    toggleReveal,
    setAccused,
    castVote,
    resolveVote,
    spyGuessLocation,
  };

  return {
    settings,
    setSettings,
    gameState,
    gameActions,
    locationDeck,
    isSpy,
  };
}
