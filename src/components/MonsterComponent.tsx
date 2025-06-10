'use client';

import { FC, useState, useEffect } from 'react';
import { getMonsterImage } from '@/lib/monsterImages';
import { useAudio } from '@/lib/AudioProvider';

/* ---------- Types ---------- */

interface Monster {
  id: string;
  name: string;
  /** Path to monster image */
  image: string;
  maxHealth: number;
  currentHealth: number;
  level: number;
  createdAt: number;
}

interface DamageEvent {
  playerId: string;
  playerName: string;
  walletAddress: string;
  damage: number;
  timestamp: number;
  x: number;
  y: number;
  id: string;
}

interface MonsterComponentProps {
  monster: Monster;
  damageEvents: DamageEvent[];
  onAttack: (x: number, y: number) => void;
  selfWallet?: string;
  xpGain?: number | null;
  onFirstAttack?: () => void;
}

interface FloatingDamage {
  id: string;
  damage: number;
  x: number;
  y: number;
  timestamp: number;
  isSelf: boolean;
}

/* ---------- Component ---------- */

const MonsterComponent: FC<MonsterComponentProps> = ({
  monster,
  damageEvents,
  onAttack,
  selfWallet,
  xpGain,
  onFirstAttack
}) => {
  const [floating, setFloating] = useState<FloatingDamage[]>([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [lastClickPos, setLastClickPos] = useState({ x: 0, y: 0 });
  const [showSkull, setShowSkull] = useState(false);
  const [fadeInstructions, setFadeInstructions] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const { playEffect } = useAudio();

  // Only add floating damage if the id is new
  useEffect(() => {
    if (!damageEvents.length) return;

    const latest = damageEvents[damageEvents.length - 1];
    const newFloatingDamage: FloatingDamage = {
      id: latest.id,
      damage: latest.damage,
      x: latest.x,
      y: latest.y,
      timestamp: latest.timestamp,
      isSelf: latest.walletAddress === selfWallet
    };

    setFloating(prev =>
      prev.some(fd => fd.id === latest.id) ? prev : [...prev, newFloatingDamage]
    );

    // Remove after 2s
    const timer = setTimeout(() => {
      setFloating(prev => prev.filter(f => f.id !== latest.id));
    }, 2000);
    return () => clearTimeout(timer);
  }, [damageEvents, selfWallet]);

  // Clean up old floating damages
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setFloating(prev => prev.filter(f => now - f.timestamp < 2000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle monster click
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLastClickPos({ x, y });
    setIsAttacking(true);
    setTimeout(() => setIsAttacking(false), 200);
    playEffect();
    onAttack(x, y);
    if (showInstructions && !fadeInstructions) {
      setFadeInstructions(true);
      onFirstAttack?.();
      setTimeout(() => setShowInstructions(false), 500);
    }
  };

  const hpPct = (monster.currentHealth / monster.maxHealth) * 100;
  const isDead = monster.currentHealth <= 0;
  const monsterImage = monster.image || getMonsterImage(monster.name);

  // Show the skull after the death animation
  useEffect(() => {
    if (isDead) {
      const timer = setTimeout(() => setShowSkull(true), 1000);
      return () => clearTimeout(timer);
    }
    setShowSkull(false);
  }, [isDead]);

  return (
    <div className="flex flex-col items-center justify-start md:justify-center h-full p-4 pb-20">
      {/* name and level */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-6xl font-dungeon font-bold text-dungeon-gold mb-2 glow-text">
          {monster.name}
        </h1>
        <div className="text-xl text-gray-300">Level {monster.level}</div>
      </div>

      {/* HP bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>HP</span>
          <span>
            {monster.currentHealth.toLocaleString()} /{' '}
            {monster.maxHealth.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-dungeon-accent rounded-full h-6 border-2 border-dungeon-border">
          <div
            className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${hpPct}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-1">
          {hpPct.toFixed(1)}% remaining
        </div>
      </div>

      {/* monster image */}
      <div className="relative">
        <div
          className={`relative cursor-pointer select-none transition-all duration-200 ${
            isDead
              ? 'pointer-events-none grayscale'
              : isAttacking
              ? 'scale-95 brightness-125'
              : 'hover:scale-105'
          }`}
          onClick={isDead ? undefined : handleClick}
        >
        <div
          className={`text-8xl md:text-9xl filter drop-shadow-2xl ${
            isDead && !showSkull ? 'monster-death' : ''
          } ${showSkull ? 'fade-in' : ''}`}
        >
          {showSkull ? (
            '💀'
          ) : (
            <img
              src={monsterImage}
              alt={monster.name}
              className="w-64 md:w-96 drop-shadow-2xl select-none"
            />
          )}
        </div>

          {/* attack flash */}
          {isAttacking && (
            <div className="absolute inset-0 bg-red-500/30 rounded-full animate-pulse" />
          )}

          {/* click point */}
          {isAttacking && (
            <div
              className="absolute pointer-events-none"
              style={{ left: lastClickPos.x - 10, top: lastClickPos.y - 10 }}
            >
              <div className="w-5 h-5 bg-yellow-400 rounded-full animate-ping" />
            </div>
          )}
        </div>

        {/* damage numbers */}
        {floating.map(fd => (
          <div
            key={fd.id}
            className={`absolute pointer-events-none z-50 animate-bounce-up ${
              fd.isSelf ? '' : 'opacity-70 scale-75'
            }`}
            style={{
              left: fd.x - 20,
              top: fd.y - 40,
              animation: 'floatUp 2s ease-out forwards'
            }}
          >
            <div className="text-2xl font-bold text-red-400 drop-shadow-lg">
              -{fd.damage}
            </div>
          </div>
        ))}

        {isDead && xpGain !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-3xl font-bold text-yellow-400 animate-bounce">
              +{xpGain} XP!
            </div>
          </div>
        )}
      </div>

      {/* instructions */}
      {!isDead && showInstructions && (
        <div
          className={`text-center mt-8 text-gray-400 transition-opacity duration-500 ${
            fadeInstructions ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="text-lg mb-2">⚔️ Click to Attack ⚔️</div>
          <div className="text-sm">Deal damage and earn experience!</div>
        </div>
      )}

      {/* keyframes */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-30px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(0.8);
          }
        }
        .animate-bounce-up {
          animation: floatUp 2s ease-out forwards;
        }

        @keyframes monsterDeath {
          0% {
            opacity: 1;
            transform: rotate(0deg) scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: rotate(-90deg) scale(0.7) translateY(80px);
          }
        }
        .monster-death {
          animation: monsterDeath 1s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MonsterComponent;
