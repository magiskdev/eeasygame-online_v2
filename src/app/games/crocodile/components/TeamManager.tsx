"use client";

import React, { useState } from "react";
import { Team } from "../lib/types";

export function TeamManager({
  teams,
  activeTeamIdx,
  onUpdateTeams,
  disabledWhileRunning,
}: {
  teams: Team[];
  activeTeamIdx: number;
  onUpdateTeams: (teams: Team[]) => void;
  disabledWhileRunning?: boolean;
}) {
  const [newTeamName, setNewTeamName] = useState("");
  const [newPlayerNames, setNewPlayerNames] = useState<Record<string, string>>({});

  const addTeam = () => {
    if (!newTeamName.trim()) return;
    const newTeam: Team = {
      id: crypto.randomUUID(),
      name: newTeamName.trim(),
      score: 0,
      presenters: [],
      currentPresenterIndex: 0,
    };
    onUpdateTeams([...teams, newTeam]);
    setNewTeamName("");
  };

  const removeTeam = (teamId: string) => {
    if (teams.length <= 2) return;
    onUpdateTeams(teams.filter(t => t.id !== teamId));
  };

  const updateTeamName = (teamId: string, name: string) => {
    onUpdateTeams(teams.map(t => t.id === teamId ? { ...t, name } : t));
  };

  const addPlayer = (teamId: string) => {
    const playerName = newPlayerNames[teamId]?.trim();
    if (!playerName) return;
    
    onUpdateTeams(teams.map(t => 
      t.id === teamId 
        ? { ...t, presenters: [...t.presenters, playerName] }
        : t
    ));
    setNewPlayerNames(prev => ({ ...prev, [teamId]: "" }));
  };

  const removePlayer = (teamId: string, playerIndex: number) => {
    onUpdateTeams(teams.map(t => {
      if (t.id === teamId) {
        const newPresenters = t.presenters.filter((_, i) => i !== playerIndex);
        const newCurrentIndex = t.currentPresenterIndex >= newPresenters.length 
          ? Math.max(0, newPresenters.length - 1)
          : t.currentPresenterIndex;
        return { 
          ...t, 
          presenters: newPresenters,
          currentPresenterIndex: newCurrentIndex
        };
      }
      return t;
    }));
  };

  const getCurrentPresenter = (team: Team) => {
    if (team.presenters.length === 0) return "Нет игроков";
    return team.presenters[team.currentPresenterIndex] || "Не выбран";
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Команды</h3>
        <div className="flex gap-2 mb-3">
          <input
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2"
            placeholder="Название команды"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            disabled={!!disabledWhileRunning}
            onKeyDown={(e) => e.key === 'Enter' && addTeam()}
          />
          <button
            className="btn px-3"
            onClick={addTeam}
            disabled={!!disabledWhileRunning}
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {teams.map((team, teamIdx) => (
          <div 
            key={team.id} 
            className={`p-3 rounded-lg border ${
              teamIdx === activeTeamIdx 
                ? 'border-blue-400 bg-blue-500/10' 
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="flex gap-2 mb-3">
              <input
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2"
                value={team.name}
                onChange={(e) => updateTeamName(team.id, e.target.value)}
                disabled={!!disabledWhileRunning}
              />
              <button
                className="btn px-2 text-red-400 hover:text-red-300"
                onClick={() => removeTeam(team.id)}
                disabled={teams.length <= 2 || !!disabledWhileRunning}
                title={teams.length <= 2 ? "Нужно минимум 2 команды" : "Удалить команду"}
              >
                ✕
              </button>
            </div>

            <div className="mb-2">
              <div className="text-sm text-gray-400 mb-1">
                Текущий ведущий: <span className="text-white font-medium">{getCurrentPresenter(team)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-1 text-sm"
                  placeholder="Имя игрока"
                  value={newPlayerNames[team.id] || ""}
                  onChange={(e) => setNewPlayerNames(prev => ({ ...prev, [team.id]: e.target.value }))}
                  disabled={!!disabledWhileRunning}
                  onKeyDown={(e) => e.key === 'Enter' && addPlayer(team.id)}
                />
                <button
                  className="btn px-2 text-sm"
                  onClick={() => addPlayer(team.id)}
                  disabled={!!disabledWhileRunning}
                >
                  +
                </button>
              </div>

              <div className="space-y-1">
                {team.presenters.map((presenter, presenterIdx) => (
                  <div 
                    key={presenterIdx} 
                    className={`flex justify-between items-center px-2 py-1 rounded text-sm ${
                      presenterIdx === team.currentPresenterIndex
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-white/5 text-gray-300'
                    }`}
                  >
                    <span>{presenter}</span>
                    <button
                      className="text-red-400 hover:text-red-300 px-1"
                      onClick={() => removePlayer(team.id, presenterIdx)}
                      disabled={!!disabledWhileRunning}
                      title="Удалить игрока"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
