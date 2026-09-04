// src/ts/types.ts — Tipos centrales del proyecto

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'CONTINUE' | 'WIN';
export type GameMode = 'progressive' | 'solo_boss' | 'custom';

export interface Vec2 { x: number; y: number; }
export interface Size { w: number; h: number; }

export interface GameConfig { w: number; h: number; diff: number; }

export interface PlatformState {
  isMobile: boolean;
  isForcedMobile: boolean;
  isTouchUIHidden: boolean;
  usingGamepad: boolean;
  touchMoveX: number;
  touchMoveY: number;
  rightJoyActive: boolean;
}

export interface InputState {
  moveX: number; moveY: number;
  aimX: number; aimY: number;
  shoot: boolean; triple: boolean; bomb: boolean; parry: boolean; pause: boolean; dash: boolean;
}

export interface Nave extends Vec2 {
  vx: number; vy: number;
  accel: number; fric: number;
  inmune: boolean;
  color: string;
}

export type EnemyType = 'common' | 'special' | 'elite' | 'kamikaze' | 'kamikaze_bomb' | 'life';
export interface Enemy extends Vec2 {
  type: EnemyType;
  hp: number;
  vx: number; vy: number;
  shield: boolean;
  lastShot: number;
  suicidal?: boolean;
  formation?: string;
  zigzag?: boolean;
  zigzagPhase?: number;
  dodgeCooldown?: boolean;
  isBombKamikaze?: boolean;
  bombRadius?: number;
}

export type BossType = 'static' | 'moving' | 'hunter' | 'berserker' | 'doppel' | 'doppel_y' | 'doppel_o';
export interface Boss extends Vec2 {
  id: string;
  type: BossType;
  targetY: number;
  hp: number; maxHp: number;
  dir: number;
  lastShot: number;
  parryCooldown: boolean; parryActive: boolean;
  bombs: number;
  vx?: number; vy?: number;
  lastLaser?: number; laserCooldown?: boolean; dodgeCooldown?: boolean;
  dashState?: string; dashTimer?: number; dashInterval?: number; lastDashTime?: number;
  dashVx?: number; dashVy?: number; dashCount?: number; maxDashes?: number;
  exhaustedTimer?: number; lastBreath?: boolean; lastBreathTimer?: number;
  lastBreathCount?: number; lastBreathInterval?: number | ReturnType<typeof setInterval>;
  immune?: boolean; transformed?: boolean; transformPhase?: string; spinAngle?: number;
  telegraphActive?: boolean; enraged?: boolean;
  spiralActive?: boolean; spiralStart?: number; spiralCount?: number; lastMissile?: number; lastSpiral?: number;
  lastExplosion?: number; explodeCooldown?: boolean; centerTimer?: number | ReturnType<typeof setTimeout>;
  countInterval?: number | ReturnType<typeof setInterval>;
}

export interface Bullet extends Vec2 {
  vx: number; vy: number;
  color: string; dmg: number;
  isHoming?: boolean; life?: number;
  isDrone?: boolean; isSuperGreen?: boolean;
}
export interface EnemyBullet extends Vec2 {
  vx: number; vy: number; color: string;
  isMissile?: boolean; hp?: number; life?: number;
  isLaser?: boolean; isBerserkerSpike?: boolean;
}
export interface PickUp extends Vec2 { type: 'bomb' | 'revive'; }
export interface WeaponPowerUp extends Vec2 {
  letter: 'S' | 'L' | 'R' | 'D';
  vy: number; life: number;
}
export interface Particle extends Vec2 {
  vx: number; vy: number; life: number; color: string; type: 'spark' | 'bomb_ring';
}
export interface FloatingText extends Vec2 { text: string; life: number; color: string; }
export interface DebrisChunk extends Vec2 {
  pts: [number, number][]; vx: number; vy: number; rot: number; rotSpeed: number; life: number; color: string;
}
export interface ShipTrail extends Vec2 { angle: number; life: number; color: string; }
export interface PortalEntity extends Vec2 { radius: number; life: number; pulse: number; active: boolean; }
export interface Star { x: number; y: number; layer: number; size: number; alpha: number; speed: number; }
export interface Nebula { x: number; y: number; r: number; color: string; alpha: number; speed: number; }
export interface Planet { x: number; y: number; r: number; color: string; speed: number; }
export interface SuperAsteroid { x: number; y: number; r: number; rot: number; rotSpeed: number; speed: number; }

export type HudBlockId = 'hud-block-score' | 'hud-block-sector' | 'hud-block-vida' | 'boss-container';
export type TouchId = 'joy-base-l' | 'joy-base-r' | 'btn-triple' | 'btn-parry' | 'btn-bomb' | 'btn-dash' | 'btn-pause-m';
