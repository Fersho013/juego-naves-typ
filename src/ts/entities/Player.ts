import type { Nave, Bullet, InputState } from '../types.js';
import { sfx } from '../Core/Audio.js';

export const nave: Nave = { x: 400, y: 500, vx: 0, vy: 0, accel: 0.9, fric: 0.90, inmune: false, color: '#ffffff' };

export function changeNaveColor(newColor: string): void {
  nave.color = newColor;
}

interface SpawnBulletsParams {
  input: InputState;
  bullets: Bullet[];
  currentWeapon: { value: string };
  drones: { x: number; y: number }[];
  sfxRef?: typeof sfx;
  screenShakeRef?: { value: number };
}

export function spawnBullets({ input, bullets, currentWeapon, drones }: SpawnBulletsParams): void {
  const baseAngle = Math.atan2(input.aimY - nave.y, input.aimX - nave.x);
  if (currentWeapon.value === 'laser') { sfx.laser(); return; }
  sfx.shoot();
  if (currentWeapon.value === 'spread') {
    for (let i = 0; i < 5; i++) {
      const a = baseAngle + (i - 2) * 0.25;
      bullets.push({ x: nave.x, y: nave.y, vx: Math.cos(a) * 13, vy: Math.sin(a) * 13, color: '#ff9900', dmg: 15 });
    }
  } else if (input.triple) {
    for (let i = -1; i <= 1; i++) { const a = baseAngle + (i * 0.2); bullets.push({ x: nave.x, y: nave.y, vx: Math.cos(a) * 12, vy: Math.sin(a) * 12, color: '#ffcc00', dmg: 25 }); }
  } else {
    bullets.push({ x: nave.x, y: nave.y, vx: Math.cos(baseAngle) * 15, vy: Math.sin(baseAngle) * 15, color: '#1e90ff', dmg: 20 });
  }
  drones.forEach((d: { x: number; y: number }) => {
    bullets.push({ x: d.x, y: d.y, vx: Math.cos(baseAngle) * 13, vy: Math.sin(baseAngle) * 13, color: '#ffffff', dmg: 8, isDrone: true });
  });
}
