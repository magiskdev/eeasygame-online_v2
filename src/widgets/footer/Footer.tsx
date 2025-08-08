import React from "react";
export const Footer: React.FC = () => (
  <footer className="border-t border-white/5 mt-12">
    <div className="container py-6 text-sm text-gray-400 flex items-center justify-between">
      <p>© {new Date().getFullYear()} eeasygame.online</p>
      <p>Сделано с ❤️ на Next.js + TS (FSD)</p>
    </div>
  </footer>
);
