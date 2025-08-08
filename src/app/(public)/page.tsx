import React from "react"; import Link from "next/link"; import { GamesList } from "widgets/games-list/GamesList";
export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">eeasygame.online</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">Добро пожаловать! Выбирай игру и зови друзей. Всё в браузере.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/games/flappy-bird" className="btn btn-primary">Начать с Flappy Bird</Link>
          {/* <Link href="/(auth)/login" className="btn">Войти</Link> */}
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Доступные игры</h2>
        <GamesList />
      </div>
    </section>
  );
}
