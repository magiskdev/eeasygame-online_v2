'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOCATIONS, type LocationCard, buildCustomLocations, SUGGESTED_TIMERS } from '../data/locations';
import type { Player, Settings, Vote, Phase, RoundResult } from '../lib/types';
import { Modal } from 'shared/ui/Modal';
import { HowToPlayModal } from './HowToPlayModal';
import { SettingsModal } from './SettingsModal';

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const SpyGame: React.FC = () => {
  // Лобби: список игроков
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [name, setName] = React.useState('');

  // Настройки / модалки
  const [howtoOpen, setHowtoOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [logOpen, setLogOpen] = React.useState(false);

  const [settings, setSettings] = React.useState<Settings>({
    roundSeconds: 480, // 8 минут по дефолту
    spies: 'auto',     // auto = 1 шпион до 7 игроков, 2 — от 8+
    allowSecondSpyThreshold: 8,
    includeCategories: ['classic', 'travel', 'fun'],
    customLocationsRaw: '',
    revealMode: 'private', // приватное раскрытие карты каждому
    allowSpyGuess: true,   // шпион может угадать локацию
  });

  // Состояние раунда
  const [phase, setPhase] = React.useState<Phase>('lobby'); // 'lobby' | 'playing' | 'voting' | 'ended'
  const [seconds, setSeconds] = React.useState(settings.roundSeconds);
  const [running, setRunning] = React.useState(false);

  const timerRef = React.useRef<number | null>(null);
  React.useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // Роли / локация / приватные раскрытия
  const [locationDeck, setLocationDeck] = React.useState<LocationCard[]>([]);
  const [location, setLocation] = React.useState<LocationCard | null>(null);
  const [spyIds, setSpyIds] = React.useState<string[]>([]);
  const [revealed, setRevealed] = React.useState<Record<string, boolean>>({}); // кто раскрыл свою карту (на своём устройстве)
  const [vote, setVote] = React.useState<Vote>({ accusedId: null, votes: {} });

  const [result, setResult] = React.useState<RoundResult | null>(null);
  const [roundLog, setRoundLog] = React.useState<Array<string>>([]);

  // Пересчитать пул локаций по настройкам
  React.useEffect(() => {
    const base = Object.values(LOCATIONS)
      .filter((l) => settings.includeCategories.includes(l.category));
    const custom = buildCustomLocations(settings.customLocationsRaw);
    setLocationDeck(shuffle([...base, ...custom]));
  }, [settings.includeCategories, settings.customLocationsRaw]);

  // При смене настроек времени — применяем для следующего раунда (если сейчас не идёт)
  React.useEffect(() => { if (!running) setSeconds(settings.roundSeconds); }, [settings.roundSeconds, running]);

  function addPlayer() {
    const n = name.trim();
    if (!n) return;
    const id = crypto.randomUUID();
    setPlayers((p) => [...p, { id, name: n }]);
    setName('');
  }
  function removePlayer(id: string) {
    setPlayers((p) => p.filter((x) => x.id !== id));
  }

  function calcSpyCount(count: number) {
    if (settings.spies === 'one') return 1;
    if (settings.spies === 'two') return 2;
    // auto
    return count >= settings.allowSecondSpyThreshold ? 2 : 1;
  }

  function startRound() {
    if (players.length < 3) return;
    const deck = locationDeck.length ? locationDeck : Object.values(LOCATIONS);
    const loc = deck[Math.floor(Math.random() * deck.length)];
    const spyCount = calcSpyCount(players.length);

    const shuffledPlayers = shuffle(players);
    const spies = shuffledPlayers.slice(0, spyCount).map((p) => p.id);

    setLocation(loc);
    setSpyIds(spies);
    setRevealed({});
    setVote({ accusedId: null, votes: {} });
    setResult(null);
    setRoundLog([]);
    setPhase('playing');
    setSeconds(settings.roundSeconds);
    setRunning(true);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          // время вышло — городские (не шпионы) выигрывают, если шпионы не угадали
          endRound({ winner: 'civilians', reason: 'time' });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function stopTimer() {
    setRunning(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }

  function endRound(res: RoundResult) {
    stopTimer();
    setResult(res);
    setPhase('ended');
    setRoundLog((log) => [`Итог: ${res.winner === 'spies' ? 'Шпионы' : 'Горожане'} (${res.reason})`, ...log]);
  }

  function resetAll() {
    stopTimer();
    setPhase('lobby');
    setSpyIds([]);
    setLocation(null);
    setVote({ accusedId: null, votes: {} });
    setResult(null);
    setSeconds(settings.roundSeconds);
    setRevealed({});
    setRoundLog([]);
  }

  // Приватное раскрытие роли игроку (на его устройстве)
  function toggleReveal(id: string) {
    setRevealed((r) => ({ ...r, [id]: !r[id] }));
  }

  function isSpy(id: string) {
    return spyIds.includes(id);
  }

  // Голосование: выбор обвиняемого и голоса «за»
  function setAccused(id: string) {
    if (phase !== 'playing') return;
    setVote({ accusedId: id, votes: {} });
    setPhase('voting');
  }

  function castVote(voterId: string, up: boolean) {
    if (phase !== 'voting' || !vote.accusedId) return;
    setVote((v) => ({ ...v, votes: { ...v.votes, [voterId]: up } }));
  }

  function resolveVote() {
    if (!vote.accusedId) return;
    const voters = players.filter((p) => p.id !== vote.accusedId); // обвиняемый не голосует
    const approvals = voters.reduce((acc, p) => acc + (vote.votes[p.id] ? 1 : 0), 0);
    const needed = Math.ceil(voters.length * 0.5); // простое большинство
    const approved = approvals >= needed;

    // лог
    setRoundLog((log) => [
      `Голосование: против ${getName(vote.accusedId || '')} — за ${approvals}/${voters.length} (${approved ? 'принято' : 'отклонено'})`,
      ...log,
    ]);

    if (!approved) {
      // возврат к игре
      setPhase('playing');
      return;
    }
    // принято: проверяем, шпион ли обвинённый
    const accusedIsSpy = isSpy(vote.accusedId);
    if (accusedIsSpy) {
      endRound({ winner: 'civilians', reason: 'accused_spy' });
    } else {
      endRound({ winner: 'spies', reason: 'accused_civil' });
    }
  }

  // Угадать локацию (шпионы)
  function spyGuessLocation(guess: string) {
    if (!settings.allowSpyGuess || phase === 'ended' || !location) return;
    const ok = guess.trim().toLowerCase() === location.name.trim().toLowerCase();
    setRoundLog((log) => [`Шпион попытался угадать: «${guess}» — ${ok ? 'верно' : 'мимо'}`, ...log]);
    if (ok) endRound({ winner: 'spies', reason: 'spy_guess' });
  }

  function getName(id: string) {
    return players.find((p) => p.id === id)?.name ?? '—';
  }

  const spiesNames = spyIds.map(getName).join(', ');

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Шпион</h1>
          <p className="text-gray-400 text-sm">
            Фаза: <span className="text-blue-300">{phase}</span>
            {phase !== 'lobby' && location ? <> · Локаций в пуле: {locationDeck.length}</> : null}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={() => setHowtoOpen(true)}>Как играть</button>
          <button className="btn" onClick={() => setSettingsOpen(true)}>Настройки</button>
          <button className="btn" onClick={() => setLogOpen(true)}>Лог</button>
          {phase !== 'lobby'
            ? <button className="btn" onClick={resetAll}>Новый матч</button>
            : <button className="btn btn-primary" onClick={startRound} disabled={players.length < 3}>Начать</button>}
        </div>
      </header>

      {/* Основной блок */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Левая/центральная колонка */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            {phase === 'lobby' ? (
              <Lobby
                players={players}
                name={name}
                setName={setName}
                addPlayer={addPlayer}
                removePlayer={removePlayer}
                suggestedTimers={SUGGESTED_TIMERS}
              />
            ) : (
              <RoundPanel
                phase={phase}
                seconds={seconds}
                players={players}
                location={settings.revealMode === 'public' ? location : null}
                onAccuse={setAccused}
                vote={vote}
                castVote={castVote}
                resolveVote={resolveVote}
                isSpy={isSpy}
              />
            )}
          </div>

          {/* Приватные карты игроков */}
          {phase !== 'lobby' && (
            <div className="card">
              <h3 className="font-semibold mb-3">Карты игроков</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {players.map((p) => {
                  const role = isSpy(p.id) ? 'spy' : 'civil';
                  return (
                    <PlayerCard
                      key={p.id}
                      player={p}
                      role={role}
                      location={location}
                      revealed={!!revealed[p.id]}
                      onToggle={() => toggleReveal(p.id)}
                      revealMode={settings.revealMode}
                    />
                  );
                })}
              </div>
              {settings.revealMode === 'private' && (
                <p className="text-xs text-gray-400 mt-2">
                  Режим приватный: показывайте карту только владельцу телефона.
                </p>
              )}
            </div>
          )}

          {/* Ход шпиона: угадать локацию */}
          {phase === 'playing' && settings.allowSpyGuess && (
            <SpyGuess onSubmit={spyGuessLocation} />
          )}
        </div>

        {/* Правый сайдбар */}
        <aside className="space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-2">Таймер</h3>
            <div className="text-4xl font-extrabold">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</div>
            <div className="mt-2 text-sm text-gray-400">Раунд: {settings.roundSeconds / 60} мин.</div>
            {phase === 'playing' && <button className="btn mt-3" onClick={stopTimer}>Пауза</button>}
            {phase !== 'playing' && <button className="btn mt-3" onClick={startRound} disabled={players.length < 3}>Перезапустить</button>}
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">Итог</h3>
            {result ? (
              <div className="text-sm">
                Победили: <b>{result.winner === 'spies' ? 'Шпионы' : 'Горожане'}</b> <br />
                Причина: {result.reason}
                {result.winner === 'spies' && settings.revealMode !== 'public' && (
                  <div className="mt-2 text-gray-300">
                    Шпионы: {spiesNames || '—'}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">Пока идёт игра…</div>
            )}
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">Лог</h3>
            {roundLog.length === 0 ? (
              <div className="text-sm text-gray-400">Пусто</div>
            ) : (
              <ul className="text-sm space-y-1">
                {roundLog.map((l, i) => (<li key={i} className="opacity-90">• {l}</li>))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      <HowToPlayModal open={howtoOpen} onClose={() => setHowtoOpen(false)} />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        value={settings}
        onChange={setSettings}
      />

      <LogModal open={logOpen} onClose={() => setLogOpen(false)} items={roundLog} />
    </section>
  );
};

/* ---------- Подкомпоненты экрана ---------- */

function Lobby({
  players, name, setName, addPlayer, removePlayer, suggestedTimers
}: {
  players: Player[]; name: string; setName: (v: string) => void;
  addPlayer: () => void; removePlayer: (id: string) => void;
  suggestedTimers: number[];
}) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Лобби</h3>
      <div className="flex gap-2">
        <input className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2"
               placeholder="Имя игрока" value={name} onChange={(e)=>setName(e.target.value)} />
        <button className="btn" onClick={addPlayer}>Добавить</button>
      </div>
      <div className="text-sm text-gray-400 mt-2">Игроков: {players.length} (рекомендуется 5+)</div>
      <ul className="flex flex-wrap gap-2 mt-2">
        {players.map(p => (
          <li key={p.id} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
            <span>{p.name}</span>
            <button className="btn" onClick={()=>removePlayer(p.id)}>✕</button>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-xs text-gray-500">
        Подсказка: время раунда часто ставят {suggestedTimers.map(s => `${s/60}м`).join(', ')}.
      </div>
    </div>
  );
}

function RoundPanel({
  phase, seconds, players, location, onAccuse, vote, castVote, resolveVote, isSpy
}: {
  phase: Phase; seconds: number; players: Player[];
  location: LocationCard | null;
  onAccuse: (id: string) => void;
  vote: Vote; castVote: (voterId: string, up: boolean) => void; resolveVote: () => void;
  isSpy: (id: string) => boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Раунд</h3>
        <div className="text-sm text-gray-400">Осталось: {Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</div>
      </div>

      {location && (
        <div className="mt-2 rounded-xl bg-white/5 border border-white/10 p-3">
          <div className="text-sm text-gray-300">Локация (видна всем в публичном режиме):</div>
          <div className="text-xl font-bold">{location.name}</div>
          <div className="text-xs text-gray-400 mt-1">{location.categoryTitle}</div>
        </div>
      )}

      {phase === 'playing' && (
        <>
          <div className="mt-3 text-sm text-gray-300">Обвинение:</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {players.map(p => (
              <button key={p.id} className="btn" onClick={()=>onAccuse(p.id)}>Обвинить {p.name}</button>
            ))}
          </div>
        </>
      )}

      {phase === 'voting' && vote.accusedId && (
        <div className="mt-3">
          <div className="font-medium">Голосование: обвиняется {players.find(p=>p.id===vote.accusedId)?.name}</div>
          <ul className="mt-2 space-y-2">
            {players.filter(p=>p.id!==vote.accusedId).map(p => (
              <li key={p.id} className="flex items-center gap-2">
                <span className="w-32 truncate">{p.name}</span>
                <button className="btn" onClick={()=>castVote(p.id, true)}>За</button>
                <button className="btn" onClick={()=>castVote(p.id, false)}>Против</button>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <button className="btn btn-primary" onClick={resolveVote}>Завершить голосование</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerCard({
  player, role, location, revealed, onToggle, revealMode
}: {
  player: Player; role: 'spy'|'civil'; location: LocationCard | null;
  revealed: boolean; onToggle: () => void; revealMode: 'private'|'public';
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{player.name}</div>
        <button className="btn" onClick={onToggle}>{revealed ? 'Скрыть' : 'Показать'}</button>
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 p-3 rounded-xl bg-black/30 border border-white/10 text-sm"
          >
            {role === 'spy'
              ? <div>Вы — <b>ШПИОН</b>{revealMode==='private' && location ? <>. Локацию не знаешь.</> : null}</div>
              : <div>Вы — <b>ГОРОЖАНИН</b>. Локация: <b>{location?.name ?? '—'}</b></div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpyGuess({ onSubmit }: { onSubmit: (guess: string) => void }) {
  const [val, setVal] = React.useState('');
  return (
    <div className="card">
      <h3 className="font-semibold mb-2">Ход шпиона — угадай локацию</h3>
      <div className="flex gap-2">
        <input className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2"
               placeholder="Введите название локации" value={val} onChange={(e)=>setVal(e.target.value)} />
        <button className="btn btn-primary" onClick={()=>{ if(val.trim()) onSubmit(val.trim()); setVal(''); }}>Угадать</button>
      </div>
      <p className="text-xs text-gray-400 mt-1">Совпадает по точному названию.</p>
    </div>
  );
}

function LogModal({ open, onClose, items }: { open: boolean; onClose:()=>void; items:string[] }) {
  return (
    <Modal open={open} onClose={onClose} title="Лог раунда">
      {items.length===0 ? <div className="text-sm text-gray-400">Пока пусто</div> : (
        <ul className="text-sm space-y-1 max-h-80 overflow-auto">
          {items.map((l,i)=><li key={i}>• {l}</li>)}
        </ul>
      )}
    </Modal>
  );
}
