import { initAudio } from '../Core/Audio.js';
import { nave } from '../entities/Player.js';

declare global { interface Window { __getGameState?: () => string; } }

export function showScreen(id: string): void {
  initAudio();
  document.querySelectorAll('.ui-screen').forEach(s => s.classList.remove('active'));
  if (id !== 'none' && document.getElementById(id)) document.getElementById(id)!.classList.add('active');
  updateVolumeVisibility();
}

export function updateVolumeVisibility(): void {
  const volBtn = document.getElementById('btn-volume') as HTMLElement | null;
  if (!volBtn) return;
  const gameState = window.__getGameState ? window.__getGameState() : 'MENU';
  volBtn.style.display = (gameState === 'MENU' || gameState === 'PAUSED') ? 'flex' : 'none';
}

export function initPreview(): void {
  const pCanvas = document.getElementById('previewCanvas') as HTMLCanvasElement | null;
  if (!pCanvas) return;
  const pCtx = pCanvas.getContext('2d');
  if (!pCtx) return;
  function renderPreview(): void {
    pCtx!.clearRect(0, 0, pCanvas.width, pCanvas.height);
    pCtx!.save();
    pCtx!.translate(pCanvas.width / 2, pCanvas.height / 2);
    pCtx!.rotate(-Math.PI / 2);
    pCtx!.shadowBlur = 15; pCtx!.shadowColor = nave.color;
    pCtx!.fillStyle = nave.color;
    pCtx!.beginPath(); pCtx!.moveTo(25, 0); pCtx!.lineTo(-20, -20); pCtx!.lineTo(-20, 20); pCtx!.fill();
    pCtx!.restore();
    requestAnimationFrame(renderPreview);
  }
  renderPreview();
}

export function changeNaveColor(newColor: string): void { nave.color = newColor; }
