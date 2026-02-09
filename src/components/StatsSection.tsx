'use client';

import { useState, useEffect } from 'react';

type Stats = {
  games_count: number;
  users_count: number;
  tags_count: number;
};

export function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  return (
    <section className="border-y-4 border-black bg-[#e45c10] py-16 relative font-pixel">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <StatCard number={stats?.games_count ?? '-'} label="投稿作品" />
          <StatCard number={stats?.users_count ?? '-'} label="開発者" />
          <StatCard number={stats?.tags_count ?? '-'} label="技術タグ" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ number, label }: { number: string | number; label: string }) {
  return (
    <div className="bg-[#c46237] border-4 border-black p-8 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
      <div className="text-5xl font-bold text-white mb-2 drop-shadow-[4px_4px_0_#000]">
        {number}
      </div>
      <div className="text-[#fbad08] text-xl font-bold drop-shadow-[2px_2px_0_#000]">{label}</div>
    </div>
  );
}
