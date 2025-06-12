'use client';

import { FC } from 'react';
import { Skull } from 'lucide-react';

interface KillEntry {
  monsterName: string;
  level: number;
  xp: number;
  tokens: number;
  killedAt: number;
}

interface MonsterKillHistoryProps {
  history: KillEntry[];
  limit?: number;
}

const MonsterKillHistory: FC<MonsterKillHistoryProps> = ({ history, limit = 5 }) => {
  const entries = [...history]
    .sort((a, b) => b.killedAt - a.killedAt)
    .slice(0, limit);

  return (
    <div className="bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border rounded-lg p-4 shadow-lg w-64">
      <h3 className="text-lg font-dungeon font-bold text-dungeon-gold mb-3 flex items-center space-x-2 glow-text">
        <Skull className="w-5 h-5" />
        <span>Recent Kills</span>
      </h3>
      {entries.length === 0 ? (
        <div className="text-gray-400 text-center py-4 text-sm">No kills yet...</div>
      ) : (
        <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar text-sm">
          {entries.map((e, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="text-gray-200 truncate">
                {e.monsterName} (Lv{e.level})
              </span>
              <span className="text-yellow-400 font-mono">+{e.tokens}</span>
              <span className="text-green-400 font-mono">+{e.xp}xp</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonsterKillHistory;
