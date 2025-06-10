'use client';

import { FC, useEffect, useState } from 'react';
import { Skull, Timer, Trophy } from 'lucide-react';

interface BossRespawnOverlayProps {
  isVisible: boolean;
  respawnTimeSeconds?: number;
  lastBossName?: string;
  lastBossLevel?: number;
}

const BossRespawnOverlay: FC<BossRespawnOverlayProps> = ({
  isVisible,
  respawnTimeSeconds = 30,
  lastBossName = "Ancient Dragon",
  lastBossLevel = 1
}) => {
  const [timeLeft, setTimeLeft] = useState(respawnTimeSeconds);
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      setTimeLeft(respawnTimeSeconds);
      setShowCelebration(true);
      return;
    }

    // Hide the celebration after 3 seconds
    const celebrationTimer = setTimeout(() => {
      setShowCelebration(false);
    }, 3000);

    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(celebrationTimer);
      clearInterval(interval);
    };
  }, [isVisible, respawnTimeSeconds]);

  if (!isVisible) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-dungeon-surface/95 backdrop-blur-sm border-2 border-dungeon-border rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
        
        {/* Victory celebration */}
        {showCelebration ? (
          <div className="animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-dungeon font-bold text-yellow-400 mb-2 glow-text">
              BOSS DEFEATED!
            </h2>
            <div className="text-xl text-dungeon-gold mb-4">
              {lastBossName} (Level {lastBossLevel})
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <Trophy className="w-5 h-5" />
              <span className="text-lg font-bold">Victory!</span>
              <Trophy className="w-5 h-5" />
            </div>
          </div>
        ) : (
          /* Respawn screen */
          <div>
            <div className="text-6xl mb-4 animate-pulse">
              <Skull className="w-16 h-16 mx-auto text-gray-400" />
            </div>
            
            <h2 className="text-2xl font-dungeon font-bold text-dungeon-gold mb-4 glow-text">
              Boss Respawning...
            </h2>
            
            <div className="text-gray-300 mb-6">
              A new challenger approaches the dungeon
            </div>

            {/* Timer */}
            <div className="bg-dungeon-accent/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Timer className="w-5 h-5 text-dungeon-primary" />
                <span className="text-sm text-gray-400">Next Boss In:</span>
              </div>
              
              <div className="text-3xl font-bold text-dungeon-primary">
                {minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-dungeon-accent rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-dungeon-primary to-dungeon-secondary h-3 rounded-full transition-all duration-1000 ease-linear"
                style={{ 
                  width: `${((respawnTimeSeconds - timeLeft) / respawnTimeSeconds) * 100}%` 
                }}
              />
            </div>

            {/* Tips */}
            <div className="text-xs text-gray-400 space-y-1">
              <div>💡 Use this time to check your stats</div>
              <div>⚔️ Prepare for the next battle</div>
              <div>🏆 Review the leaderboard</div>
            </div>
          </div>
        )}

        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-dungeon-gold/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BossRespawnOverlay;