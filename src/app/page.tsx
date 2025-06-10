'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/lib/useSocket';
import { useSolanaWallet } from '@/lib/useSolanaWallet';
import { SolanaConnect } from '@/components/SolanaConnect';
import PlayerStats from '@/components/PlayerStats';
import Leaderboard from '@/components/Leaderboard';
import MonsterComponent from '@/components/MonsterComponent';
import SpellSelector from '@/components/SpellSelector';
import MonsterDamageBoard from '@/components/MonsterDamageBoard';
import TreasureBox from '@/components/TreasureBox';
import MobileMenu from '@/components/MobileMenu';
import Footer from '@/components/Footer';
import { devLog } from '@/lib/devLog';

export default function Home() {
  const {
    isConnected,
    connectionError,
    isRegistered,
    gameState,
    playerStats,
    damageEvents,
    bossDamage,
    xpGain,
    attack,
    connectWallet
  } = useSocket();

  const onlineCount = gameState?.players.filter(p => p.isOnline).length || 0;

  const {
    connected: walletConnected,
    address: walletAddress,
    shortAddress
  } = useSolanaWallet();

  const [showSpells, setShowSpells] = useState(false);

  // Initial mount log
  useEffect(() => {
    devLog('Home page mounted');
    return () => devLog('Home page unmounted');
  }, []);

  // Wallet connection log
  useEffect(() => {
    devLog('Wallet connection status changed', { walletConnected, walletAddress });
    if (walletConnected && walletAddress) {
      devLog('Wallet connected, registering player', { walletAddress });
      connectWallet(walletAddress);
    }
  }, [walletConnected, walletAddress, connectWallet]);

  // Socket connection log
  useEffect(() => {
    devLog('Socket connection status', { isConnected, connectionError });
  }, [isConnected, connectionError]);

  // Game state or registration change log
  useEffect(() => {
    devLog('Game state or registration status changed', { isRegistered, gameState });
  }, [isRegistered, gameState]);

  // Loading screen
  if (!isConnected && !connectionError) {
    devLog('Rendering: loading screen, not connected yet');
    return (
      <div className="min-h-screen bg-dungeon-bg dungeon-atmosphere flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">🏰</div>
          <h1 className="text-4xl font-dungeon font-bold text-dungeon-gold mb-4 glow-text">
            THE DUNGEON
          </h1>
          <div className="text-xl text-white mb-2">Entering the dungeon...</div>
          <div className="text-sm text-gray-400">Connecting to server</div>
          <div className="mt-6">
            <div className="w-64 bg-dungeon-surface rounded-full h-2 mx-auto">
              <div className="bg-dungeon-primary h-2 rounded-full animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
        <Footer
          isConnected={isConnected}
          connectionError={connectionError}
          onlineCount={onlineCount}
        />
      </div>
    );
  }

  // Connection error screen
  if (connectionError) {
    devLog('Rendering: connection error screen', { connectionError });
    return (
      <div className="min-h-screen bg-dungeon-bg dungeon-atmosphere flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">💀</div>
          <h1 className="text-3xl font-dungeon font-bold text-red-400 mb-4">
            Connection Failed
          </h1>
          <div className="text-gray-300 mb-6 bg-dungeon-surface p-4 rounded-lg border border-dungeon-border">
            {connectionError}
          </div>
          <button
            onClick={() => {
              devLog('User clicked Try Again (reload)');
              window.location.reload();
            }}
            className="bg-dungeon-primary hover:bg-dungeon-secondary text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 border border-dungeon-border"
          >
            Try Again
          </button>
        </div>
        <Footer
          isConnected={isConnected}
          connectionError={connectionError}
          onlineCount={onlineCount}
        />
      </div>
    );
  }

  // Wallet connection required screen
  if (!walletConnected) {
    devLog('Rendering: wallet connection required screen');
    return (
      <div className="min-h-screen bg-dungeon-bg dungeon-atmosphere flex items-center justify-center">
        <div className="absolute top-4 right-4 z-50">
          <SolanaConnect />
        </div>
        <div className="bg-dungeon-surface/90 backdrop-blur-sm p-8 rounded-lg border-2 border-dungeon-border shadow-2xl max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🏰</div>
            <h1 className="text-3xl font-dungeon font-bold text-dungeon-gold mb-2 glow-text">
              THE DUNGEON
            </h1>
            <p className="text-gray-300 mb-4">Connect your Solana wallet to enter</p>
            <p className="text-sm text-gray-400">
              Your wallet address will be your warrior identity
            </p>
          </div>
          <div className="text-center">
            <SolanaConnect className="w-full justify-center" />
          </div>
        </div>
        <Footer
          isConnected={isConnected}
          connectionError={connectionError}
          onlineCount={onlineCount}
        />
      </div>
    );
  }

  // Game loading or registration in progress
  if (!gameState || !isRegistered) {
    devLog('Rendering: game loading or registration screen', { gameState, isRegistered, playerStats });
    return (
      <div className="min-h-screen bg-dungeon-bg dungeon-atmosphere flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🎮</div>
          <div className="text-xl text-white mb-2">
            {!isRegistered ? 'Registering warrior...' : 'Loading game...'}
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Warrior: {shortAddress}
          </div>
          {playerStats && (
            <div className="text-sm text-green-400 mt-2">
              Level {playerStats.level} • {playerStats.totalDamage.toLocaleString()} total damage
            </div>
          )}
        </div>
        <Footer
          isConnected={isConnected}
          connectionError={connectionError}
          onlineCount={onlineCount}
        />
      </div>
    );
  }

  // Prepare data for the mobile menu
  const bossDamageEntries = Object.entries(bossDamage)
    .map(([wallet, dmg]) => ({
      walletAddress: wallet,
      name: gameState.players.find(p => p.walletAddress === wallet)?.name ?? '???',
      damage: dmg,
    }))
    .sort((a, b) => b.damage - a.damage);

  devLog('Rendering: main game screen', {
    playerStats,
    walletAddress,
    bossDamageEntries,
    monster: gameState.monster,
    playersCount: gameState.players?.length,
  });

  // Players list formatted for leaderboard components
  const leaderboardPlayers = gameState.players.map(p => ({
    walletAddress: p.walletAddress,
    name: p.name,
    totalDamage: (p as any).totalDamage ?? p.damage,
    isOnline: p.isOnline,
  }));

  const lootXp = gameState.monster.level * 100;
  const lootTokens = gameState.monster.level * 100;

  // Main game screen
  return (
    <div className="h-screen bg-dungeon-bg dungeon-atmosphere relative overflow-hidden">
      {/* Mobile Menu */}
      <MobileMenu
        playerStats={playerStats}
        players={leaderboardPlayers}
        bossDamageEntries={bossDamageEntries}
        selfWallet={walletAddress ?? undefined}
        xp={lootXp}
        tokens={lootTokens}
      />

      {/* Wallet button - always top right */}
      <div className="absolute top-4 right-4 z-50">
        <SolanaConnect />
      </div>

      {/* Loot chest - desktop only */}
      <div className="hidden md:block absolute bottom-28 right-4 z-40">
        <TreasureBox xp={lootXp} tokens={lootTokens} />
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block desktop-stats-container space-y-4">
        <PlayerStats player={playerStats} />
        <Leaderboard
          players={leaderboardPlayers}
          selfWallet={walletAddress ?? undefined}
        />
        <MonsterDamageBoard
          entries={bossDamageEntries}
          selfWallet={walletAddress ?? undefined}
        />
      </div>

      {/* Monster with mobile spacing */}
      <div className="relative z-10 mobile-monster-container md:pt-4 h-full">
        <MonsterComponent
          monster={gameState.monster}
          damageEvents={damageEvents}
          selfWallet={walletAddress ?? undefined}
          xpGain={xpGain}
          onFirstAttack={() => setShowSpells(true)}
          onAttack={(...params) => {
            devLog('Attack triggered from UI', params);
            attack(...params);
          }}
        />
        <SpellSelector visible={showSpells} />
      </div>

      {/* Footer */}
      <Footer
        isConnected={isConnected}
        connectionError={connectionError}
        onlineCount={onlineCount}
      />
    </div>
  );
}
