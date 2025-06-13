'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getMonsterImage } from './monsterImages';

/* ──────────────── Tipos ──────────────── */

interface DamageEvent {
  playerId: string;
  playerName: string;
  walletAddress: string;
  damage: number;
  timestamp: number;
  x: number;
  y: number;
}

interface Monster {
  id: string;
  spawnId: string;
  name: string;
  /** Path to monster image */
  image: string;
  maxHealth: number;
  currentHealth: number;
  level: number;
  createdAt: number;
  healthPercentage: number;
}

interface Player {
  name: string;
  damage: number;
  isOnline: boolean;
  level: number;
  walletAddress: string;
  tokenBalance: number;
  totalDamage: number;
  attackCount: number;
}

interface PlayerStats {
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

interface GameState {
  monster: Monster;
  players: Player[];
  damageEvents: DamageEvent[];
  serverTime: number;
}

interface AttackResponse {
  success: boolean;
  attacker?: {
    damage: number;
    playerUpdate: {
      level: number;
      experience: number;
      tokenBalance: number;
      totalDamage: number;
      damage: number;
    };
  };
  damageEvent?: DamageEvent;
  monster?: Monster;
  monsterKilled?: boolean;
  killer?: {
    walletAddress: string;
    name: string;
  };
  newMonster?: Monster;
  timestamp?: number;
  reason?: string;
}

/* ──────────────── Constantes ──────────────── */

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

/* ──────────────── Hook ──────────────── */

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const playerStatsRef = useRef<PlayerStats | null>(null);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const walletRef = useRef<string | null>(null); // always points to the current value

  const [isRegistered, setIsRegistered] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [lastAttackTime, setLastAttackTime] = useState(0);
  const [damageEvents, setDamageEvents] = useState<(DamageEvent & { id: string })[]>([]);

  // Damage accumulated per boss/player
  const [bossDamage, setBossDamage] = useState<Record<string, number>>({});
  const [currentMonsterId, setCurrentMonsterId] = useState<string | null>(null);
  const [nextMonster, setNextMonster] = useState<Monster | null>(null);
  const [xpGain, setXpGain] = useState<number | null>(null);
  const [spellCast, setSpellCast] = useState<string | null>(null);

  /* ---------- Clean up old floating damages ---------- */

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setDamageEvents(prev => prev.filter(e => now - e.timestamp < 3000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ---------- Create connection ---------- */

  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 5000
    });
    setSocket(s);

    const applyGameState = (state: GameState) => {
      const monsterWithImage = {
        ...state.monster,
        image: getMonsterImage(state.monster.name)
      };
      setGameState({ ...state, monster: monsterWithImage });

      if (state.damageEvents?.length) {
        setDamageEvents(prev => {
          const seen = new Set(prev.map(e => `${e.timestamp}-${e.walletAddress}`));
          const merged = [...prev];
          for (const ev of state.damageEvents) {
            const key = `${ev.timestamp}-${ev.walletAddress}`;
            if (!seen.has(key)) {
              merged.push({ ...ev, id: key });
              seen.add(key);
            }
          }
          return merged;
        });
      }

      setCurrentMonsterId(state.monster.spawnId);
      const tally: Record<string, number> = {};
      state.damageEvents.forEach(ev => {
        tally[ev.walletAddress] = (tally[ev.walletAddress] || 0) + ev.damage;
      });
      setBossDamage(tally);
    };

    /* connection established */
    s.on('connect', () => {
      console.log('✅ Connected to server');
      setIsConnected(true);
      setConnectionError(null);
    });

    /* handshake error */
    s.on('connect_error', err => {
      console.error('❌ connect_error:', err.message);
      setConnectionError(err.message);
    });

    /* disconnected */
    s.on('disconnect', () => {
      console.log('🔌 Disconnected');
      setIsConnected(false);
      setIsRegistered(false);
    });

    /* initial or full state */
    s.on('gameState', (state: GameState) => {
      applyGameState(state);
    });

    /* player join/leave updates game state */
    s.on('playerJoined', (data: { gameState: GameState }) => {
      applyGameState(data.gameState);
    });

    s.on('playerLeft', (data: { gameState: GameState }) => {
      applyGameState(data.gameState);
    });

    /* received registration confirmation */
    s.on('playerRegistered', data => {
      setPlayerStats(data.player);
      setIsRegistered(true);
    });

    /* manual stats update */
    s.on('playerData', (data: PlayerStats) => {
      setPlayerStats(data);
    });

    /* spell effects */
    s.on('spellCast', (data: { spell: string }) => {
      setSpellCast(`${data.spell}-${Date.now()}`);
    });

    /* attack response */
    s.on('attackResponse', response => {
      console.log('Attack response:', response);
      if (!response.success) return;
      let gainedXP = 0;


      /* atualiza HP do monstro */
      if (response.monster) {
        const monsterWithImage = {
          ...response.monster,
          image: getMonsterImage(response.monster.name)
        };
        setGameState(prev => (prev ? { ...prev, monster: monsterWithImage } : null));
      }

      /* DEDUP damage events */
      if (response.damageEvent) {
        const id = `${response.damageEvent.timestamp}-${response.damageEvent.walletAddress}`;
        setDamageEvents(prev => (prev.some(e => e.id === id) ? prev : [
          ...prev,
          { ...response.damageEvent, id }
        ]));
      }

      // accumulate damage from the event
      if (response.damageEvent) {
        setBossDamage(prev => ({
          ...prev,
          [response.damageEvent.walletAddress]:
            (prev[response.damageEvent.walletAddress] || 0) +
            response.damageEvent.damage
        }));
      }

      /* update your stats */
      if (
        response.attacker &&
        response.damageEvent?.walletAddress === walletRef.current
      ) {
        gainedXP =
          response.attacker.playerUpdate.experience -
          (playerStatsRef.current?.experience || 0);
        setPlayerStats(prev =>
          prev ? { ...prev, ...response.attacker!.playerUpdate } : null
        );
      }

      /* update players list (leaderboard) */
      if (response.damageEvent) {
        setGameState(prev => {
          if (!prev) return prev;
          const players = [...prev.players];
          const idx = players.findIndex(
            p => p.walletAddress === response.damageEvent!.walletAddress
          );
          if (idx !== -1) {
            players[idx] = {
              ...players[idx],
              damage: players[idx].damage + response.damageEvent.damage,
              level: response.attacker?.playerUpdate.level ?? players[idx].level,
              isOnline: true
            };
          } else {
            players.push({
              name: response.damageEvent.playerName,
              walletAddress: response.damageEvent.walletAddress,
              damage: response.damageEvent.damage,
              level: response.attacker?.playerUpdate.level ?? 1,
              isOnline: true
            });
          }
          players.sort((a, b) => b.damage - a.damage);
          return { ...prev, players };
        });
      }

      // if the monster died, reset for the next one
      if (response.monsterKilled && response.newMonster) {
        setBossDamage({});
        setCurrentMonsterId(response.newMonster.spawnId);
        setDamageEvents([]);
        const monsterWithImage = {
          ...response.newMonster,
          image: getMonsterImage(response.newMonster.name)
        };
        setNextMonster(monsterWithImage);
        if (gainedXP > 0) setXpGain(gainedXP);
      }
    });

    /* generic errors */
    s.on('error', err => console.error('Socket error:', err));

    /* auto-register if a wallet is stored */
    const saved = localStorage.getItem('walletAddress');
    if (saved) {
      setWalletAddress(saved);
      walletRef.current = saved;
      s.emit('registerPlayer', { walletAddress: saved });
    }

    return () => {
      s.disconnect();
    };
  }, []);

  /* keep ref always up to date */
  useEffect(() => {
    walletRef.current = walletAddress;
  }, [walletAddress]);

  useEffect(() => {
    playerStatsRef.current = playerStats;
  }, [playerStats]);

  // When there is a new monster, switch after a few seconds
  useEffect(() => {
    if (!nextMonster) return;
    const timer = setTimeout(() => {
      if (nextMonster) {
        setGameState(prev => (prev ? { ...prev, monster: nextMonster } : null));
      }
      setNextMonster(null);
      setXpGain(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [nextMonster]);

  /* ---------- Public helpers ---------- */

  const connectWallet = useCallback(
    (address: string) => {
      setWalletAddress(address);
      walletRef.current = address;
      localStorage.setItem('walletAddress', address);
      if (socket && isConnected) {
        socket.emit('registerPlayer', { walletAddress: address });
      }
    },
    [socket, isConnected]
  );

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    walletRef.current = null;
    localStorage.removeItem('walletAddress');
    setPlayerStats(null);
    setIsRegistered(false);
  }, []);

  /* Rate-limit: max 10 clicks/s */
  const attack = useCallback(
    (x: number, y: number) => {
      if (!socket || !isConnected || !walletAddress || !isRegistered) return;
      const now = Date.now();
      if (now - lastAttackTime < 100) return; // 10 cps
      setLastAttackTime(now);
      socket.emit('attack', { x, y });
    },
    [socket, isConnected, walletAddress, isRegistered, lastAttackTime]
  );

  return {
    /* connections / state */
    socket,
    isConnected,
    connectionError,
    isRegistered,

    /* game */
    gameState,
    playerStats,
    damageEvents,
    bossDamage,
    currentMonsterId,
    xpGain,
    spellCast,

    /* wallet helpers */
    walletAddress,
    connectWallet,
    disconnectWallet,

    /* actions */
    attack
  };
};
