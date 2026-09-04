export const DASH = {
  DURATION: 500,
  COOLDOWN: 2000,
  SPEED: 18
} as const;

export const COMBO = {
  RESET_MS: 2500,
  MULTIPLIER_TIER_2: 5,
  MULTIPLIER_TIER_3: 10
} as const;

export const WEAPON_TIMERS = {
  DEFAULT: 600,
  HOMING: 900,
  DRONE: 900
} as const;

export const WAVE_DEFAULT_TARGET = 50 as const;

export const SUPER_BOSS_DEFAULTS = {
  HP: 20000,
  CANNON_HP: 2500,
  GATE_HP: 6000,
  CANNON_COOLDOWN: 130,
  LASER_COOLDOWN: 46,
  GATE_SPAWN_MS: 425
} as const;

export const PORTAL_DEFAULT_PROB = 1 as const;
