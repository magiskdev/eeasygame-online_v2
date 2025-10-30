import React, { useState } from 'react';
import { useSpyGame } from '../hooks/useSpyGame';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { GameHeader } from './GameHeader';
import { PlayerManager } from './PlayerManager';
import { GameBoard } from './GameBoard';
import { PlayerCard } from './PlayerCard';
import { SpyGuess } from './SpyGuess';
import { RoundLogModal } from './RoundLogModal';
import { SpyHowToPlay } from './SpyHowToPlay';
import { SpySettings } from './SpySettings';
import { SUGGESTED_TIMERS } from '../lib/constants';

export const SpyGame: React.FC = () => {
  const { settings, setSettings, gameState, gameActions, isSpy } = useSpyGame();
  
  // Модальные окна
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  // Имя для добавления игрока
  const [playerName, setPlayerName] = useState('');

  // Горячие клавиши
  useKeyboardControls({
    phase: gameState.phase,
    running: gameState.running,
    onStartRound: gameActions.startRound,
    onStopTimer: gameActions.stopTimer,
    onResetAll: gameActions.resetAll,
    onToggleHowToPlay: () => setHowToPlayOpen(prev => !prev),
    onToggleSettings: () => setSettingsOpen(prev => !prev),
    onToggleLog: () => setLogOpen(prev => !prev),
  });

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      gameActions.addPlayer(playerName.trim());
      setPlayerName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPlayer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Заголовок игры */}
        <GameHeader
          phase={gameState.phase}
          seconds={gameState.seconds}
          playersCount={gameState.players.length}
          spiesCount={gameState.spyIds.length}
          onHowToPlay={() => setHowToPlayOpen(true)}
          onSettings={() => setSettingsOpen(true)}
          onLog={() => setLogOpen(true)}
          onReset={gameActions.resetAll}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Основная область игры */}
          <div className="lg:col-span-3 space-y-6">
            <GameBoard
              phase={gameState.phase}
              players={gameState.players}
              location={gameState.location}
              vote={gameState.vote}
              result={gameState.result}
              revealMode={settings.revealMode}
              onAccuse={gameActions.setAccused}
              onCastVote={gameActions.castVote}
              onResolveVote={gameActions.resolveVote}
              onStartRound={gameActions.startRound}
              onResetAll={gameActions.resetAll}
              isSpy={isSpy}
            />

            {/* Угадывание локации шпионом */}
            {gameState.phase === 'playing' && 
             settings.allowSpyGuess && 
             gameState.players.some(p => isSpy(p.id) && gameState.revealed[p.id]) && (
              <SpyGuess onSubmit={gameActions.spyGuessLocation} />
            )}
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Управление игроками */}
            {gameState.phase === 'lobby' && (
              <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                <PlayerManager
                  players={gameState.players}
                  onAddPlayer={gameActions.addPlayer}
                  onRemovePlayer={gameActions.removePlayer}
                  suggestedTimers={SUGGESTED_TIMERS}
                />
              </div>
            )}

            {/* Карточки игроков */}
            {gameState.phase !== 'lobby' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Игроки</h3>
                {gameState.players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    role={isSpy(player.id) ? 'spy' : 'civil'}
                    location={gameState.location}
                    revealed={gameState.revealed[player.id] || false}
                    onToggle={() => gameActions.toggleReveal(player.id)}
                    revealMode={settings.revealMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Модальные окна */}
        <SpyHowToPlay
          open={howToPlayOpen}
          onClose={() => setHowToPlayOpen(false)}
        />

        <SpySettings
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          onSave={setSettings}
        />

        <RoundLogModal
          open={logOpen}
          onClose={() => setLogOpen(false)}
          items={gameState.roundLog}
        />
      </div>
    </div>
  );
};
