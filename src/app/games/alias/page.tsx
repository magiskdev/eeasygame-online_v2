"use client";

import { useState } from "react";
import { PageShell } from "shared/ui";
import { useAliasGame } from "./hooks/useAliasGame";
import { useTimer } from "./hooks/useTimer";
import { useKeyboardControls } from "./hooks/useKeyboardControls";
import { GameHeader } from "./components/GameHeader";
import { GameBoard } from "./components/GameBoard";
import { GameControls } from "./components/GameControls";
import { WinnerDisplay } from "./components/WinnerDisplay";
import { Scoreboard } from "./components/Scoreboard";
import { TeamManager } from "./components/TeamManager";
import { AliasSettings } from "./components/AliasSettings";
import { AliasHowToPlay } from "./components/AliasHowToPlay";

export default function AliasGamePage() {
  // Модальные окна
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Основная логика игры
  const {
    gameState,
    settings,
    currentWord,
    gameActions,
    setSettings,
    setSeconds,
    addTeam,
    renameTeam,
    removeTeam,
  } = useAliasGame();

  const {
    teams,
    activeTeamIdx,
    round,
    seconds,
    running,
    turnScore,
    skipsLeft,
    winner,
  } = gameState;

  const { startTurn, endTurn, onCorrect, onSkip, resetGame, pauseGame, resumeGame } = gameActions;

  // Таймер
  useTimer({
    seconds,
    running,
    onTimeUp: endTurn,
    onTick: setSeconds,
  });

  // Горячие клавиши
  useKeyboardControls({
    running,
    onCorrect,
    onSkip,
    onStartPause: running ? endTurn : startTurn,
    onPause: pauseGame,
  });

  const activeTeam = teams[activeTeamIdx];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Заголовок */}
      <GameHeader
        round={round}
        activeTeam={activeTeam}
        onHowToPlay={() => setShowHowToPlay(true)}
        onSettings={() => setShowSettings(true)}
        onReset={resetGame}
      />

      {/* Основной лайаут: игра слева, боковая панель справа */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Левая часть: игровое поле и управление */}
        <div className="lg:col-span-2 space-y-6">
          {/* Игровое поле */}
          <GameBoard
            currentWord={currentWord}
            seconds={seconds}
            turnScore={turnScore}
            skipsLeft={skipsLeft}
            running={running}
            onPause={pauseGame}
            onResume={resumeGame}
          />

          {/* Управление игрой */}
          {winner ? (
            <WinnerDisplay winner={winner} />
          ) : (
            <GameControls
              running={running}
              canSkip={skipsLeft > 0}
              winner={!!winner}
              seconds={seconds}
              onStart={startTurn}
              onCorrect={onCorrect}
              onSkip={onSkip}
              onEnd={endTurn}
              onResume={resumeGame}
            />
          )}
        </div>

        {/* Правая часть: боковая панель */}
        <div className="space-y-6">
          <Scoreboard
            teams={teams}
            activeTeamIdx={activeTeamIdx}
            goalPoints={settings.goalPoints}
          />

          <TeamManager
            teams={teams}
            disabled={running}
            onAddTeam={addTeam}
            onRenameTeam={renameTeam}
            onRemoveTeam={removeTeam}
          />
        </div>
      </div>

      {/* Модальные окна */}
      <AliasSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      <AliasHowToPlay
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </div>
  );
}
