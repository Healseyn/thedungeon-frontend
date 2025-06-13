'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useSocket } from '@/lib/useSocket';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

interface SpellMeta {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
}

interface SpellRecord {
  id: number;
  spellId: string;
  wallet: string;
  spawnId: string;
  createdAt: string;
}

interface SpellHistoryProps {
  limit?: number;
}

const SpellHistory: FC<SpellHistoryProps> = ({ limit = 5 }) => {
  const { socket } = useSocket();
  const [history, setHistory] = useState<SpellRecord[]>([]);
  const [spells, setSpells] = useState<Record<string, SpellMeta>>({});

  const fetchSpells = useCallback(async () => {
    try {
      const res = await fetch(`${SOCKET_URL}/api/game/spells`);
      if (res.ok) {
        const data: SpellMeta[] = await res.json();
        const map: Record<string, SpellMeta> = {};
        data.forEach(s => {
          map[s.id] = s;
        });
        setSpells(map);
      }
    } catch (err) {
      console.error('Failed to fetch spells list', err);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${SOCKET_URL}/api/game/spells/history?limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch spell history', err);
    }
  }, [limit]);

  useEffect(() => {
    fetchSpells();
    fetchHistory();
  }, [fetchSpells, fetchHistory]);

  useEffect(() => {
    if (!socket) return;
    const handler = () => fetchHistory();
    socket.on('spellCast', handler);
    return () => {
      socket.off('spellCast', handler);
    };
  }, [socket, fetchHistory]);

  const formatAddr = (addr: string) =>
    addr.length <= 10 ? addr : `${addr.slice(0, 4)}…${addr.slice(-4)}`;

  return (
    <div className="bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border rounded-lg p-3 shadow-lg w-56 text-sm">
      <h3 className="text-lg font-dungeon font-bold text-dungeon-gold mb-3 flex items-center space-x-2 glow-text">
        <Sparkles className="w-5 h-5" />
        <span>Recent Spells</span>
      </h3>
      {history.length === 0 ? (
        <div className="text-gray-400 text-center py-4 text-sm">No spells cast yet...</div>
      ) : (
        <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar text-sm">
          {history.map(entry => {
            const meta = spells[entry.spellId];
            const label = meta ? `${meta.emoji} ${meta.name}` : entry.spellId;
            return (
              <div key={entry.id} className="flex justify-between w-full px-1">
                <span className="text-gray-200 truncate">{label}</span>
                <span className="text-gray-400 font-mono" title={entry.wallet}>{formatAddr(entry.wallet)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SpellHistory;
