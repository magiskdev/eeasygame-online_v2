'use client';
import React, { useState } from "react";
import { Button } from "shared/ui/Button";
import { useUserStore } from "entities/user/model";
export const LoginForm: React.FC = () => {
  const { setUser } = useUserStore();
  const [email, setEmail] = useState(""); const [name, setName] = useState("");
  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); setUser({ id: crypto.randomUUID(), name: name || "Игрок", email }); };
  return (
    <form onSubmit={onSubmit} className="card max-w-md mx-auto space-y-4">
      <div><h1 className="text-2xl font-semibold">Вход в аккаунт</h1><p className="text-sm text-gray-400 mt-1">Пока что без пароля — укажите имя и email.</p></div>
      <label className="block space-y-1"><span className="text-sm text-gray-300">Имя</span>
        <input className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-blue-400" value={name} onChange={(e)=>setName(e.target.value)} required />
      </label>
      <label className="block space-y-1"><span className="text-sm text-gray-300">Email</span>
        <input type="email" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-blue-400" value={email} onChange={(e)=>setEmail(e.target.value)} required />
      </label>
      <div className="flex gap-2 justify-end"><Button type="submit">Войти</Button></div>
    </form>
  );
};
