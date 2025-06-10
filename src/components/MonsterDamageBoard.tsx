'use client';

import { FC } from 'react';

interface Entry {
  walletAddress: string;
  name: string;
  damage: number;
}

interface Props {
  entries: Entry[];
  selfWallet?: string;
  limit?: number;
}

const MonsterDamageBoard: FC<Props> = ({ entries, selfWallet, limit = 10 }) => {
  const format = (addr: string) =>
    addr.length <= 10 ? addr : `${addr.slice(0, 4)}…${addr.slice(-4)}`;

  return (
    <div className="bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border
                    rounded-lg p-4 shadow-lg max-h-[60vh] overflow-y-auto">
      <h3 className="text-lg font-dungeon font-bold text-dungeon-gold mb-3 glow-text">
        Boss Damage
      </h3>

      {entries.slice(0, limit).map((p, idx) => {
        const isSelf = p.walletAddress === selfWallet;
        return (
          <div key={p.walletAddress}
               className={`flex justify-between items-center mb-1 px-2 py-1 rounded
                          ${isSelf ? 'bg-dungeon-primary/20' : ''}`}>
            <span className="text-xs text-gray-300 w-6">{idx + 1}</span>
            <span className={`flex-1 truncate ${isSelf ? 'text-dungeon-gold' : 'text-gray-200'}`}>
              {p.name}
            </span>
            <span className="text-xs text-red-400 font-mono">{p.damage}</span>
          </div>
        );
      })}

      {/* highlight player position outside the top N */}
      {!entries.slice(0, limit).some(e => e.walletAddress === selfWallet) && (
        <div className="border-t border-dungeon-border my-1"></div>
      )}

      {entries.map((e, i) =>
        e.walletAddress === selfWallet && i >= limit ? (
          <div key={e.walletAddress}
               className="flex justify-between items-center px-2 py-1 rounded
                          bg-dungeon-primary/20">
            <span className="text-xs text-gray-300 w-6">{i + 1}</span>
            <span className="flex-1 truncate text-dungeon-gold">{e.name}</span>
            <span className="text-xs text-red-400 font-mono">{e.damage}</span>
          </div>
        ) : null
      )}
    </div>
  );
};

export default MonsterDamageBoard;
