export interface Player {
  walletAddress: string;
  name: string;
  level: number;
  tokenBalance: number;
  experience: number;
  totalDamage: number;
  attackCount: number;
  isOnline: boolean;
  damage: number;
  joinedAt?: number;
  lastSeen?: number;
}

export interface Monster {
  id: string;
  spawnId: string;
  name: string;
  /** Path to the monster image under `/public` */
  image: string;
  maxHealth: number;
  currentHealth: number;
  level: number;
  createdAt?: number;
  healthPercentage?: number;
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