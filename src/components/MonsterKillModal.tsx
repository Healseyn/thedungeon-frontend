'use client';

import { FC } from 'react';
import { createPortal } from 'react-dom';
import { X, Skull } from 'lucide-react';

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
  defeatedAt: string;
  damageByPlayer: PlayerDamage[];
}

interface MonsterKillModalProps {
  spawn: SpawnRecord;
  onClose: () => void;
}

const MonsterKillModal: FC<MonsterKillModalProps> = ({ spawn, onClose }) => {
  const formatAddr = (a: string) =>
    a.length <= 10 ? a : `${a.slice(0, 4)}…${a.slice(-4)}`;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dungeon-surface/95 border-2 border-dungeon-border rounded-xl p-8 w-full max-w-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-dungeon font-bold text-dungeon-gold mb-4 flex items-center space-x-2 glow-text">
          <Skull className="w-5 h-5" />
          <span>
            {spawn.templateName} (Lv{spawn.level})
          </span>
        </h3>
        <div className="text-gray-300 text-sm mb-4">
          Defeated at {new Date(spawn.defeatedAt).toLocaleString()}
        </div>
        <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar text-sm">
          <div className="grid grid-cols-4 text-xs text-gray-400 font-semibold mb-1">
            <span>Player</span>
            <span className="text-right">DMG</span>
            <span className="text-right">Tokens</span>
            <span className="text-right">XP</span>
          </div>
          {spawn.damageByPlayer.map((p, idx) => (
            <div
              key={idx}
              className="grid grid-cols-4 gap-2 py-0.5 rounded hover:bg-dungeon-accent/20"
            >
              <span className="truncate text-gray-200">{formatAddr(p.walletAddress)}</span>
              <span className="text-red-400 font-mono text-right">{p.damage}</span>
              <span className="text-yellow-400 font-mono text-right">{p.tokensEarned}</span>
              <span className="text-green-400 font-mono text-right">{p.xpGained}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MonsterKillModal;
