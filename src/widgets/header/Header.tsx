'use client';
import Link from "next/link"; import React from "react"; import { useUserStore } from "entities/user/model";
export const Header: React.FC = () => {
  const { current } = useUserStore();
  return (
    <header className="border-b border-white/5 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold">eeasygame<span className="text-blue-400">.online</span></Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className="hover:text-blue-300" href="/">Главная</Link>
          <Link className="hover:text-blue-300" href="/games/flappy-bird">Flappy Bird</Link>
          {/* <Link className="hover:text-blue-300" href="/(auth)/login">Вход</Link> */}
          {current && <span className="text-gray-400">👋 {current.name}</span>}
        </nav>
      </div>
    </header>
  );
};
