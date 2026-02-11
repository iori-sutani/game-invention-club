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
    <section className="border-y-[3px] border-black bg-[#e45c10] py-12 relative font-pixel">
      <div className="container mx-auto px-3">
        <div className="grid md:grid-cols-3 gap-6 text-center">
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
    <div className="bg-[#c46237] border-[3px] border-black p-6 shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
      <div className="text-4xl font-bold text-white mb-1.5 drop-shadow-[3px_3px_0_#000]">
        {number}
      </div>
      <div className="text-[#fbad08] text-lg font-bold drop-shadow-[1.5px_1.5px_0_#000]">{label}</div>
    </div>
  );
}
