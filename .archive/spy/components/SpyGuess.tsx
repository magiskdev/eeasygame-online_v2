import React, { useState } from 'react';

interface SpyGuessProps {
  onSubmit: (guess: string) => void;
}

export const SpyGuess: React.FC<SpyGuessProps> = ({ onSubmit }) => {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedGuess = guess.trim();
    if (trimmedGuess) {
      onSubmit(trimmedGuess);
      setGuess('');
    }
  };

  return (
    <div className="p-6 bg-red-600/10 border border-red-600/20 rounded-xl">
      <h3 className="text-lg font-semibold mb-4 text-red-300">
        🕵️ Ход шпиона — угадайте локацию
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Введите название локации"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          maxLength={50}
        />
        
        <button
          type="submit"
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
        >
          Угадать локацию
        </button>
      </form>
      
      <p className="text-xs text-gray-400 mt-3">
        ⚠️ Внимание: если угадаете правильно — шпионы побеждают, если нет — горожане!
      </p>
    </div>
  );
};
