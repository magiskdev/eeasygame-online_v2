// app/(public)/spy/page.tsx или pages/spy.tsx
'use client';
import React from 'react';
import { SpyGame } from './components';

export default function Page() {
  return <div className="container py-8"><SpyGame /></div>;
}
