import type { Bullet, EnemyBullet, PickUp, WeaponPowerUp } from '../types.js';

export const bullets: Bullet[] = [];
export const enemyBullets: EnemyBullet[] = [];
export const pickUps: PickUp[] = [];
export const weaponPowerUps: WeaponPowerUp[] = [];

export const weaponState: { current: string; timer: number } = { current: 'normal', timer: 0 };
export const homingState: { active: boolean; timer: number } = { active: false, timer: 0 };
export const droneState: { drones: { x: number; y: number; angleOffset: number }[]; timer: number } = { drones: [], timer: 0 };

export function clearProjectiles(): void {
  bullets.length = 0; enemyBullets.length = 0; pickUps.length = 0; weaponPowerUps.length = 0;
}
