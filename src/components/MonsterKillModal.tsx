'use client';

import { FC } from 'react';
import { X, Skull } from 'lucide-react';

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

interface MonsterKillModalProps {
  spawn: SpawnRecord;
  onClose: () => void;
}

const MonsterKillModal: FC<MonsterKillModalProps> = ({ spawn, onClose }) => {
  const formatAddr = (a: string) =>
    a.length <= 10 ? a : `${a.slice(0, 4)}…${a.slice(-4)}`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-dungeon-surface/95 border-2 border-dungeon-border rounded-xl p-6 w-full max-w-md mx-4 relative shadow-2xl">
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
          {spawn.damageByPlayer.map((p, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="text-gray-200 truncate">
                {formatAddr(p.walletAddress)}
              </span>
              <span className="text-red-400 font-mono">{p.damage}</span>
              <span className="text-yellow-400 font-mono">+{p.coinsEarned}</span>
              <span className="text-green-400 font-mono">+{p.xpGained}xp</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonsterKillModal;
