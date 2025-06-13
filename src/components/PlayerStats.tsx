'use client';

import { FC } from 'react';
import { HelpCircle } from 'lucide-react';

interface PlayerData {
  walletAddress: string;
  name: string;
  level: number;
  experience: number;
  totalDamage: number;
  tokenBalance: number;
  damage: number;
  attackCount: number;
  isOnline: boolean;
}

interface PlayerStatsProps {
  player?: PlayerData | null;
}

const PlayerStats: FC<PlayerStatsProps> = ({ player }) => {
  /* ─────────────────── helpers ─────────────────── */

  const formatWalletAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  /** Floor balance and format:
   *  0-99 999  →  “12,345”
   *  100 000-999 999 → “123k”
   *  ≥ 1 000 000 → “1m”, “4m” …
   */
  const formatTokenBalance = (balance: number): string => {
    const floored = Math.floor(balance);          // ensure integer
    if (floored >= 1_000_000) return `${Math.floor(floored / 1_000_000)}m`;
    if (floored >= 100_000)   return `${Math.floor(floored / 1_000)}k`;
    return floored.toLocaleString();
  };

  /* ─────────────────── loading skeleton ─────────────────── */

  if (!player) {
    return (
      <div className="stat-box bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-dungeon font-bold text-dungeon-gold mb-3 glow-text">
          Your Stats
        </h3>
        <div className="text-gray-400 text-center py-4">
          <div className="text-2xl mb-2">⚔️</div>
          <div>Preparing for battle...</div>
        </div>
      </div>
    );
  }

  /* ─────────────────── derived values ─────────────────── */

  const experienceForNextLevel = player.level * 1000;
  const experienceProgress = (player.experience / experienceForNextLevel) * 100;

  /* ─────────────────── markup ─────────────────── */

  return (
    <div className="stat-box bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-dungeon font-bold text-dungeon-gold mb-3 glow-text">
        Your Stats
      </h3>

      <div className="space-y-3">
        {/* Warrior Identity */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Warrior:</span>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                player.isOnline ? 'bg-green-400' : 'bg-gray-500'
              }`}
            />
            <span className="text-white font-mono text-xs">
              {formatWalletAddress(player.walletAddress)}
            </span>
          </div>
        </div>

        {/* Level and Experience */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Level:</span>
            <span className="text-dungeon-gold font-bold">{player.level}</span>
          </div>

          <div className="w-full bg-dungeon-accent rounded-full stat-bar h-2">
            <div
              className="bg-dungeon-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(experienceProgress, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-400">
            <span>{player.experience.toLocaleString()} XP</span>
            <span>{experienceForNextLevel.toLocaleString()} XP</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
          {/* Damage per click */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-gray-300 text-sm">Damage/Click:</span>
              <div className="relative group">
                <HelpCircle className="w-3 h-3 text-gray-400 hover:text-white" />
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-dungeon-surface border border-dungeon-border text-gray-300 text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition">
                  damage = (token balance / 1000) × lvl bonus (min 1)
                </div>
              </div>
            </div>
            <span className="text-red-400 font-bold">
              {player.damage.toLocaleString()}
            </span>
          </div>

          {/* Total Damage */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Total Damage:</span>
            <span className="text-dungeon-gold font-bold">
              {player.totalDamage.toLocaleString()}
            </span>
          </div>

          {/* Token Balance */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Token Balance:</span>
            <span className="text-yellow-400 font-bold">
              {formatTokenBalance(player.tokenBalance)}
            </span>
          </div>

          {/* Attacks */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Attacks:</span>
            <span className="text-blue-400 font-bold">
              {player.attackCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Level Bonus */}
        <div className="border-t border-dungeon-border pt-2 mt-2">
          <div className="text-xs text-gray-400 text-center">
            Level {player.level} Bonus: +{(player.level - 1) * 10}% damage
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
