import React, { useState } from 'react';
import type { Player } from '../lib/types';

interface PlayerManagerProps {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
  suggestedTimers: number[];
}

export const PlayerManager: React.FC<PlayerManagerProps> = ({
  players,
  onAddPlayer,
  onRemovePlayer,
  suggestedTimers,
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddPlayer(name.trim());
      setName('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Игроки ({players.length})</h3>
        
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя игрока"
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={20}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Добавить
          </button>
        </form>
      </div>

      {players.length > 0 && (
        <div className="space-y-2">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <span className="font-medium">{player.name}</span>
              <button
                onClick={() => onRemovePlayer(player.id)}
                className="px-2 py-1 text-xs bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded transition-colors"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}

      {players.length < 3 && (
        <div className="text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
          <strong>Минимум 3 игрока</strong> для начала игры
        </div>
      )}

      {players.length >= 3 && (
        <div className="text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-3">
          <strong>Готово к игре!</strong> Нажмите пробел для старта
        </div>
      )}
    </div>
  );
};
