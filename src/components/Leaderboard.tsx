'use client';

import { FC } from 'react';

interface Player {
  walletAddress: string;
  name: string;
  totalDamage: number;
  isOnline: boolean;
}

interface LeaderboardProps {
  players: Player[];
  selfWallet?: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────── */
/** Ex.: 1 250 → 1.25k  315 000 000 → 315m */
const formatDamage = (value: number) => {
  if (value < 1_000) return value.toString();

  const UNITS = ['k', 'm', 'b', 't']; // up to trillions if needed
  let unitIdx = -1;
  let scaled = value;

  while (scaled >= 1_000 && unitIdx < UNITS.length - 1) {
    scaled /= 1_000;
    unitIdx++;
  }

  // keep at most 3 significant digits
  const intDigits = Math.floor(scaled).toString().length;
  const decimals = intDigits >= 3 ? 0 : 3 - intDigits;
  return `${Number(scaled.toFixed(decimals))}${UNITS[unitIdx]}`;
};

/** 0x4fa1…3bE9 */
const formatWalletAddress = (address: string) =>
  address.length <= 12 ? address : `${address.slice(0, 6)}…${address.slice(-4)}`;
/* ───────────────────────────────────────────────────────────────────── */

const Leaderboard: FC<LeaderboardProps> = ({ players, selfWallet }) => {
  const sortedPlayers = [...players]
    .sort((a, b) => b.totalDamage - a.totalDamage)
    .slice(0, 10);

  return (
    <div className="bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-dungeon font-bold text-dungeon-gold mb-3 glow-text">
        🏆 Top Warriors
      </h3>

      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
        {sortedPlayers.length === 0 ? (
          <div className="text-gray-400 text-center py-4">
            <div className="text-2xl mb-2">⚔️</div>
            <div className="text-sm">No warriors yet...</div>
          </div>
        ) : (
          sortedPlayers.map((player, index) => (
            <div
              key={player.walletAddress}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-200 ${
                index === 0
                  ? 'bg-yellow-900/30 border border-yellow-600/30'
                  : index === 1
                  ? 'bg-gray-700/30 border border-gray-500/30'
                  : index === 2
                  ? 'bg-orange-900/30 border border-orange-600/30'
                  : player.walletAddress === selfWallet
                  ? 'bg-dungeon-primary/20'
                  : 'bg-dungeon-accent/30 hover:bg-dungeon-accent/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 text-center text-sm font-bold ${
                    index === 0
                      ? 'text-yellow-400'
                      : index === 1
                      ? 'text-gray-300'
                      : index === 2
                      ? 'text-orange-400'
                      : 'text-gray-400'
                  }`}
                >
                  {index === 0
                    ? '🥇'
                    : index === 1
                    ? '🥈'
                    : index === 2
                    ? '🥉'
                    : `${index + 1}.`}
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      player.isOnline ? 'bg-green-400' : 'bg-gray-500'
                    }`}
                  ></div>
                  {/* shorter wallet */}
                  <span className="text-white text-xs font-mono break-all">
                    {formatWalletAddress(player.walletAddress)}
                  </span>
                </div>
              </div>
              
              <span
                className={`font-bold ${
                  index === 0
                    ? 'text-yellow-400'
                    : index === 1
                    ? 'text-gray-300'
                    : index === 2
                    ? 'text-orange-400'
                    : 'text-dungeon-gold'
                }`}
              >
                {formatDamage(player.totalDamage)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
