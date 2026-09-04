import type { GameConfig, PlatformState, Nave, GameState } from './types.js';

export const platform: PlatformState = {
  isMobile: /Mobi|Android/i.test(navigator.userAgent),
  isForcedMobile: false,
  isTouchUIHidden: false,
  usingGamepad: false,
  touchMoveX: 0,
  touchMoveY: 0,
  rightJoyActive: false
};

export function isTouchActive(): boolean {
  return platform.isMobile && !platform.isTouchUIHidden;
}

export function toggleTouchUI(): void {
  platform.isTouchUIHidden = !platform.isTouchUIHidden;
  const mobileUi = document.getElementById('mobile-ui');
  if (!mobileUi) return;
  mobileUi.style.display = platform.isTouchUIHidden ? 'none' : (platform.isMobile ? 'block' : 'none');
}

export function setTouchMove(x: number, y: number): void {
  platform.touchMoveX = x;
  platform.touchMoveY = y;
}

export function setRightJoyActive(v: boolean): void {
  platform.rightJoyActive = v;
}

export function setUsingGamepad(v: boolean): void {
  platform.usingGamepad = v;
}

export function toggleDeviceMode(config: GameConfig, canvas: HTMLCanvasElement | null): void {
  platform.isForcedMobile = !platform.isForcedMobile;
  const btn = document.getElementById('btn-device-toggle') as HTMLButtonElement | null;

  if (platform.isForcedMobile) {
    if (btn) { btn.innerText = 'CAMBIAR A MODO PC'; btn.style.borderColor = 'var(--primary)'; btn.style.color = 'var(--primary)'; }
    platform.isMobile = true;
    const elem = document.documentElement as HTMLElement & { requestFullscreen?: () => Promise<void> };
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => {
        const orient = screen.orientation as unknown as { lock?: (v: string) => Promise<void> };
        if (orient?.lock) orient.lock('landscape').catch(() => {});
      }).catch(() => {});
    }
    config.w = window.innerWidth;
    config.h = window.innerHeight;
  } else {
    if (btn) { btn.innerText = 'CAMBIAR A MODO MÓVIL'; btn.style.borderColor = 'var(--success)'; btn.style.color = 'var(--success)'; }
    const touchOpt = (document.getElementById('opt-touch') as HTMLSelectElement | null)?.value;
    if (touchOpt === 'force') platform.isMobile = true;
    else if (touchOpt === 'hide') platform.isMobile = false;
    else platform.isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (document.fullscreenElement && (document as Document & { exitFullscreen?: () => Promise<void> }).exitFullscreen) {
      (document as unknown as { exitFullscreen: () => Promise<void> }).exitFullscreen().catch(() => {});
    }
    const orient2 = screen.orientation as unknown as { unlock?: () => void };
    if (orient2?.unlock) orient2.unlock();

    const sizeVal = (document.getElementById('opt-size') as HTMLSelectElement | null)?.value || '800x600';
    if (sizeVal !== 'auto') {
      const [w, h] = sizeVal.split('x').map(Number);
      config.w = w; config.h = h;
    }
  }

  if (canvas) {
    canvas.width = config.w; canvas.height = config.h;
    const container = document.getElementById('game-container');
    if (container) { container.style.width = config.w + 'px'; container.style.height = config.h + 'px'; }
  }
}

export function bindResize(config: GameConfig, canvas: HTMLCanvasElement, nave: Nave, getGameState: () => GameState): void {
  window.addEventListener('resize', () => {
    const sizeOpt = (document.getElementById('opt-size') as HTMLSelectElement | null)?.value;
    if (platform.isForcedMobile || sizeOpt === 'auto') {
      setTimeout(() => {
        config.w = window.innerWidth; config.h = window.innerHeight;
        canvas.width = config.w; canvas.height = config.h;
        const container = document.getElementById('game-container');
        if (container) { container.style.width = config.w + 'px'; container.style.height = config.h + 'px'; }
        if (getGameState() === 'MENU') { nave.x = canvas.width / 2; nave.y = canvas.height - 100; }
      }, 150);
    }
  });
}
