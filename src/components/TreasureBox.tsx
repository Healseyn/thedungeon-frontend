'use client';

import { FC } from 'react';
import { PackageOpen } from 'lucide-react';

interface TreasureBoxProps {
  xp: number;
  tokens: number;
}

const TreasureBox: FC<TreasureBoxProps> = ({ xp, tokens }) => {
  return (
    <div className="bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border rounded-lg p-4 shadow-lg w-48 text-center space-y-2">
      <div className="flex justify-center">
        <PackageOpen className="w-8 h-8 text-yellow-400" />
      </div>
      <div className="text-sm text-gray-300">Monster Loot</div>
      <div className="text-sm text-dungeon-gold font-bold">{xp.toLocaleString()} XP</div>
      <div className="text-sm text-yellow-400 font-bold">{tokens.toLocaleString(undefined, { maximumFractionDigits: 2 })} Tokens</div>
    </div>
  );
};

export default TreasureBox;
