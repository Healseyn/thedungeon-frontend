'use client';

import { FC, useState } from 'react';
import { X, Menu, BarChart3, Users, Sword, PackageOpen, Skull } from 'lucide-react';
import PlayerStats from './PlayerStats';
import Leaderboard from './Leaderboard';
import MonsterDamageBoard from './MonsterDamageBoard';
import TreasureBox from './TreasureBox';
import MonsterKillHistory from './MonsterKillHistory';
import Image from "next/image";


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

interface LeaderboardPlayer {
  walletAddress: string;
  name: string;
  totalDamage: number;
  isOnline: boolean;
}

interface MobileMenuProps {
  playerStats?: PlayerData | null;
  players: LeaderboardPlayer[];
  bossDamageEntries: Array<{
    walletAddress: string;
    name: string;
    damage: number;
  }>;
  selfWallet?: string;
  xp: number;
  tokens: number;
}

const MobileMenu: FC<MobileMenuProps> = ({
  playerStats,
  players,
  bossDamageEntries,
  selfWallet,
  xp,
  tokens
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'leaderboard' | 'damage' | 'loot' | 'history'>('stats');

  const toggleMenu = () => setIsOpen(!isOpen);

  const tabs = [
    { id: 'stats' as const, label: 'Stats', icon: BarChart3 },
    { id: 'leaderboard' as const, label: 'Ranking', icon: Users },
    { id: 'damage' as const, label: 'Boss DMG', icon: Sword },
    { id: 'loot' as const, label: 'Loot', icon: PackageOpen },
    { id: 'history' as const, label: 'Kills', icon: Skull },
  ];

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-4 left-4 z-50 bg-dungeon-surface/90 backdrop-blur-sm border border-dungeon-border rounded-lg p-3 shadow-lg hover:bg-dungeon-surface transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-dungeon-gold" />
        ) : (
          <Menu className="w-6 h-6 text-dungeon-gold" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Side Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-dungeon-surface/95 backdrop-blur-md border-r border-dungeon-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-dungeon-border">
          <h2 className="text-xl font-dungeon font-bold text-dungeon-gold glow-text">
            Game Stats
          </h2>
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-dungeon-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dungeon-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 text-sm font-medium transition-colors ${activeTab === tab.id
                    ? 'text-dungeon-gold border-b-2 border-dungeon-gold bg-dungeon-accent/30'
                    : 'text-gray-400 hover:text-white hover:bg-dungeon-accent/20'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <PlayerStats player={playerStats} />
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              <Leaderboard players={players} selfWallet={selfWallet} />
            </div>
          )}

          {activeTab === 'damage' && (
            <div className="space-y-4">
              <MonsterDamageBoard
                entries={bossDamageEntries}
                selfWallet={selfWallet}
              />
            </div>
          )}

          {activeTab === 'loot' && (
            <div className="space-y-4">
              <TreasureBox xp={xp} tokens={tokens} />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <MonsterKillHistory />
            </div>
          )}
        </div>

        {/* Menu Footer */}
        <div className="border-t border-dungeon-border p-4">
          <div className="flex flex-col items-center">
            <Image
              src="/images/logo.png"
              alt="The Dungeon"
              width={36}
              height={36}
              className="mb-1"
              draggable={false}
              priority
            />
            <span className="text-xs text-gray-400 font-semibold tracking-wide">
              THE DUNGEON
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
