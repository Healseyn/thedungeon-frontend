'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { Skull } from 'lucide-react';
import MonsterKillModal from './MonsterKillModal';
import { useSocket } from '@/lib/useSocket';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

interface PlayerDamage {
  walletAddress: string;
  damage: number;
  xpGained: number;
  tokensEarned: number;
}

interface SpawnRecord {
  spawnId: string;
  templateName: string;
  level: number;
  maxHealth?: number;
  createdAt?: string;
  defeatedAt: string;
  damageByPlayer: PlayerDamage[];
}

interface MonsterKillHistoryProps {
  limit?: number;
}

const MonsterKillHistory: FC<MonsterKillHistoryProps> = ({ limit = 5 }) => {
  const { socket } = useSocket();
  const [history, setHistory] = useState<SpawnRecord[]>([]);
  const [selected, setSelected] = useState<SpawnRecord | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${SOCKET_URL}/api/game/spawns?limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch spawn history', err);
    }
  }, [limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    if (!socket) return;
    const handler = (resp: any) => {
      if (resp.monsterKilled) fetchHistory();
    };
    socket.on('attackResponse', handler);
    return () => {
      socket.off('attackResponse', handler);
    };
  }, [socket, fetchHistory]);

  return (
    <div className="bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border rounded-lg p-3 shadow-lg w-56 text-sm">
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
