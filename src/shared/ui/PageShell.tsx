'use client';
import React from "react";
import { Header } from "widgets/header/Header";
import { Footer } from "widgets/footer/Footer";

export const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 container py-8">{children}</main>
    <Footer />
  </div>
);
