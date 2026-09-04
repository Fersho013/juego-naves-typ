import type { GameConfig, Nave } from '../types.js';

export const config: GameConfig = { w: 800, h: 600, diff: 2 };

export function getCanvas(): HTMLCanvasElement {
  const el = document.getElementById('gameCanvas');
  if (!(el instanceof HTMLCanvasElement)) throw new Error('canvas #gameCanvas no encontrado');
  return el;
}
export function getCtx(): CanvasRenderingContext2D {
  const ctx = getCanvas().getContext('2d');
  if (!ctx) throw new Error('2d context no disponible');
  return ctx;
}
export function getContainer(): HTMLElement {
  const el = document.getElementById('game-container');
  if (!el) throw new Error('#game-container no encontrado');
  return el;
}

export function applyOptions(canvas: HTMLCanvasElement, nave: Nave): void {
  const sizeVal = (document.getElementById('opt-size') as HTMLSelectElement | null)?.value || '800x600';
  const isForcedMobile = (document.documentElement as HTMLElement).dataset.forcedMobile === 'true';
  if (sizeVal === 'auto' || isForcedMobile) {
    config.w = window.innerWidth;
    config.h = window.innerHeight;
  } else {
    const [w, h] = sizeVal.split('x').map(Number);
    config.w = w; config.h = h;
  }
  canvas.width = config.w; canvas.height = config.h;
  const container = getContainer();
  container.style.width = config.w + 'px';
  container.style.height = config.h + 'px';
  nave.x = canvas.width / 2; nave.y = canvas.height - 100;
}
