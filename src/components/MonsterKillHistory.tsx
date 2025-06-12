'use client';

import { FC, useEffect, useState } from 'react';
import { Skull } from 'lucide-react';
import MonsterKillModal from './MonsterKillModal';

interface PlayerDamage {
  walletAddress: string;
  damage: number;
  xpGained: number;
  coinsEarned: number;
}

interface SpawnRecord {
  spawnId: string;
  templateName: string;
  level: number;
  defeatedAt: string;
  damageByPlayer: PlayerDamage[];
}

interface MonsterKillHistoryProps {
  limit?: number;
}

const MonsterKillHistory: FC<MonsterKillHistoryProps> = ({ limit = 5 }) => {
  const [history, setHistory] = useState<SpawnRecord[]>([]);
  const [selected, setSelected] = useState<SpawnRecord | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/game/spawns?limit=${limit}`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error('Failed to fetch spawn history', err);
      }
    };
    fetchHistory();
  }, [limit]);

  return (
    <div className="bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border rounded-lg p-4 shadow-lg w-64">
      <h3 className="text-lg font-dungeon font-bold text-dungeon-gold mb-3 flex items-center space-x-2 glow-text">
        <Skull className="w-5 h-5" />
        <span>Recent Kills</span>
      </h3>
      {history.length === 0 ? (
        <div className="text-gray-400 text-center py-4 text-sm">No kills yet...</div>
      ) : (
        <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar text-sm">
          {history.map(entry => (
            <button
              key={entry.spawnId}
              onClick={() => setSelected(entry)}
              className="flex justify-between w-full hover:bg-dungeon-accent/40 rounded px-1"
            >
              <span className="text-gray-200 truncate">
                {entry.templateName} (Lv{entry.level})
              </span>
              <span className="text-gray-400 font-mono">
                {new Date(entry.defeatedAt).toLocaleTimeString()}
              </span>
            </button>
          ))}
        </div>
      )}
      {selected && (
        <MonsterKillModal spawn={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default MonsterKillHistory;
