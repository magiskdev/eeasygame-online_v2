import React from "react"; import { FlappyGame } from "./ui/FlappyGame";
export const metadata = { title: "Flappy Bird — eeasygame.online", description: "Аркада на реакцию — играй прямо в браузере." };
export default function FlappyBirdPage(){ return (<section className="space-y-6"><header className="flex items-end justify-between"><div><h1 className="text-3xl font-bold">Flappy Bird</h1><p className="text-gray-400">Кликни или нажми пробел, чтобы взмахнуть. Избегай труб!</p></div><a href="/" className="link">← На главную</a></header><div className="card"><FlappyGame /></div></section>); }
