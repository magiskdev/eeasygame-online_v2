import React from "react";
import Link from "next/link";
import type { Game } from "entities/game/types";

const games: Game[] = [
  {
    id: "flappy",
    title: "Flappy Bird",
    slug: "/games/flappy-bird",
    description: "Классика на реакцию. Набери максимум очков!",
    status: "available",
  },
  {
    id: "alias",
    title: "Alias (объясни слово)",
    slug: "/games/alias",
    description: "Командная игра на объяснение слов. Отлично для 5+ игроков.",
    status: "available",
  },
  {
    id: "crocodile",
    title: "Крокодил",
    slug: "/games/crocodile",
    description:
      "Показывай жестами — команда угадывает. Идеально для вечеринок.",
    status: "available",
  },
  {
    id: "tictactoe",
    title: "Крестики-нолики",
    slug: "/games/tic-tac-toe",
    description: "Дуэль 1 на 1. Базовая логика и анимации.",
    status: "available",
  },
  {
    id: "spy",
    title: "Шпион",
    slug: "/games/spy",
    description:
      "Один шпион не знает место, остальные вычисляют его. 5+ игроков.",
    status: "available",
  },
  {
    id: "whoami",
    title: "Кто я?",
    slug: "/games/whoami",
    description: "Игроки угадывают свою роль вопросами «да/нет». 5+ игроков.",
    status: "available",
  },
];
export const GamesList: React.FC = () => (
  <div className="grid md:grid-cols-3 gap-6">
    {games.map((g) => (
      <article
        key={g.id}
        className="card flex flex-col transition hover:translate-y-[-2px] hover:shadow-xl"
      >
        <header className="mb-3">
          <h3 className="text-lg font-semibold">{g.title}</h3>
        </header>

        <p className="text-gray-400 flex-1">{g.description}</p>
        
        <div className="mt-4">
          {g.status === "available" ? (
            <Link href={g.slug as any} className="btn btn-primary">
              Играть
            </Link>
          ) : (
            <span className="btn opacity-60 cursor-not-allowed">Скоро</span>
          )}
        </div>
      </article>
    ))}
  </div>
);
