'use client';

import React, { useState, useEffect, Suspense } from 'react';
import NavLinks from './NavLinks';

export default function Header() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const formattedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formattedDate);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sacrament Meeting Planner</h1>
          <p className="text-sm text-gray-500">{currentDate || 'Loading...'}</p>
        </div>
        <Suspense fallback={<div className="text-sm text-gray-400">Loading navigation...</div>}>
          <NavLinks />
        </Suspense>
      </div>
    </header>
  );
}