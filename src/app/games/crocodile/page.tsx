"use client";

import React, { useState } from "react";
import { useCrocodileGame } from "./hooks/useCrocodileGame";
import { useKeyboardControls } from "./hooks/useKeyboardControls";
import { GameHeader } from "./components/GameHeader";
import { GameBoard } from "./components/GameBoard";
import { GameControls } from "./components/GameControls";
import { WinnerDisplay } from "./components/WinnerDisplay";
import { Scoreboard } from "./components/Scoreboard";
import { TeamManager } from "./components/TeamManager";

import { RoundLogModal } from "./components/RoundLogModal";
import { CrocodileSettings } from "./components/CrocodileSettings";
import { CrocodileHowToPlay } from "./components/CrocodileHowToPlay";

export default function CrocodileGamePage() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToOpen, setHowToOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const {
    settings,
    setSettings,
    gameState,
    gameActions,
    current,
    winner,
    currentPoints,
  } = useCrocodileGame();

  useKeyboardControls({ gameState, gameActions });

  const activeTeam = gameState.teams[gameState.activeTeamIdx];

  return (
    <section className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Заголовок */}
      <GameHeader
        round={gameState.round}
        activeTeam={activeTeam}
        seconds={gameState.seconds}
        running={gameState.running}
        onHowToPlay={() => setHowToOpen(true)}
        onSettings={() => setSettingsOpen(true)}
        onReset={gameActions.resetGame}
        onLog={() => setLogOpen(true)}
      />

      {/* Основной контент */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-6 mb-6">
        {/* Левая колонка: игровое поле */}
        <div className="space-y-6">
          {/* Игровое поле */}
          <GameBoard
            current={current}
            hidden={gameState.hidden}
            hintVisible={gameState.hintVisible}
            turnScore={gameState.turnScore}
            allowHints={settings.allowHints}
            difficultyScoring={settings.difficultyScoring}
            currentPoints={currentPoints}
          />

          {/* Управление */}
          <div className="card">
            <GameControls
              gameState={gameState}
              gameActions={gameActions}
              minusOnSkip={settings.minusOnSkip}
            />
          </div>


        </div>

        {/* Правая колонка: счет и управление командами */}
        <aside className="space-y-6">
          <div className="card">
            <Scoreboard
              teams={gameState.teams}
              activeIdx={gameState.activeTeamIdx}
              goal={settings.goalPoints}
            />
          </div>
          
          <div className="card">
            <TeamManager
              teams={gameState.teams}
              activeTeamIdx={gameState.activeTeamIdx}
              onUpdateTeams={gameActions.updateTeams}
              disabledWhileRunning={gameState.running}
            />
          </div>
        </aside>
      </div>

      {/* Победитель */}
      <WinnerDisplay winner={winner} goalPoints={settings.goalPoints} />

      {/* Модальные окна */}
      <CrocodileHowToPlay 
        open={howToOpen} 
        onClose={() => setHowToOpen(false)} 
      />
      
      <CrocodileSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />
      
      <RoundLogModal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        items={gameState.turnLog}
        teams={gameState.teams}
      />
    </section>
  );
}
