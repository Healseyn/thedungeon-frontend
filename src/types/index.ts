export interface Player {
  id: string;
  name: string;
  damage: number;
  totalDamage: number;
  coins: number;
  isOnline: boolean;
  attackCount?: number;
  joinedAt?: number;
  lastSeen?: number;
}

export interface Monster {
  id: string;
  name: string;
  /** Path to the monster image under `/public` */
  image: string;
  maxHealth: number;
  currentHealth: number;
  level: number;
  createdAt?: number;
}

export interface DamageEvent {
  playerId: string;
  playerName: string;
  damage: number;
  timestamp: number;
  x: number;
  y: number;
}

export interface GameState {
  monster: Monster;
  players: Player[];
  damageEvents: DamageEvent[];
  serverTime?: number;
}