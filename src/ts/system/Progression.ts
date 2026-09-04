import { bosses, createBoss } from '../entities/Boss.js';
import { enemies } from '../entities/Enemy.js';
import { enemyBullets } from '../entities/Projectile.js';
import { fxState } from './Effects.js';
import type { BossType } from '../types.js';

export const progression: { currentWave: number; wavePhase: number; waveKills: number; waveKillTarget: number; waveTransition: boolean; waveTransitionTimer: number; waveTransitionMsg: string } = {
  currentWave: 1, wavePhase: 1, waveKills: 0, waveKillTarget: 50, waveTransition: false, waveTransitionTimer: 0, waveTransitionMsg: ''
};

export function startWaveTransition(msg: string, nextPhase: number, callback: () => void): void {
  if (progression.waveTransition) return;
  progression.waveTransition = true;
  progression.waveTransitionMsg = msg;
  progression.waveTransitionTimer = 150;
  progression.wavePhase = nextPhase;
  enemies.length = 0; enemyBullets.length = 0;
  fxState.screenShake = 5;
  setTimeout(() => { callback(); progression.waveTransition = false; progression.waveTransitionMsg = ''; }, 2500);
}

interface CheckProgressionParams {
  gameMode: { value: string };
  currentWaveRef: { canvas: HTMLCanvasElement };
  customSelection: string[];
  frameCount: number;
  winGame: () => void;
}

export function checkProgression({ gameMode, currentWaveRef, customSelection, frameCount, winGame }: CheckProgressionParams): void {
  if (gameMode.value === 'custom') {
    const hasBoss = customSelection.some(v => ['b1','b2','b3','b_hunter','b_berserker','b4'].includes(v));
    if (bosses.length === 0 && hasBoss && progression.currentWave > 1) { winGame(); }
    if (bosses.length === 0 && progression.currentWave === 1) progression.currentWave++;
    return;
  }
  if (gameMode.value === 'solo_boss' && bosses.length === 0) {
    const canvas = currentWaveRef.canvas;
    if (progression.currentWave === 1) { createBoss({ canvas, type: 'static' as BossType, id: 'B1' }); progression.currentWave++; }
    else if (progression.currentWave === 2) { createBoss({ canvas, type: 'moving' as BossType, id: 'B2' }); progression.currentWave++; }
    else if (progression.currentWave === 3) { createBoss({ canvas, type: 'static' as BossType, id: 'B1' }); createBoss({ canvas, type: 'moving' as BossType, id: 'B2' }); progression.currentWave++; }
    else if (progression.currentWave === 4) { createBoss({ canvas, type: 'hunter' as BossType, id: 'B3' }); progression.currentWave++; }
    else if (progression.currentWave === 5) { createBoss({ canvas, type: 'berserker' as BossType, id: 'B4' }); progression.currentWave++; }
    else if (progression.currentWave === 6) { createBoss({ canvas, type: 'doppel' as BossType, id: 'DOPPEL' }); progression.currentWave++; }
    else winGame();
    return;
  }
  if (gameMode.value === 'progressive') {
    if (progression.waveTransition) return;
    const canvas = currentWaveRef.canvas;
    if (progression.wavePhase === 1 && progression.waveKills >= progression.waveKillTarget && bosses.length === 0 && enemies.length === 0) {
      startWaveTransition('JEFE 1', 2, () => { createBoss({ canvas, type: 'static' as BossType, id: 'B1' }); });
    } else if (progression.wavePhase === 3 && progression.waveKills >= progression.waveKillTarget && bosses.length === 0 && enemies.length === 0) {
      startWaveTransition('JEFE 2', 4, () => { progression.currentWave = 2; createBoss({ canvas, type: 'moving' as BossType, id: 'B2' }); });
    } else if (progression.wavePhase === 5 && progression.waveKills >= progression.waveKillTarget && bosses.length === 0 && enemies.length === 0) {
      startWaveTransition('JEFE 3', 6, () => { progression.currentWave = 3; createBoss({ canvas, type: 'hunter' as BossType, id: 'B3' }); });
    } else if (progression.wavePhase === 7 && progression.waveKills >= progression.waveKillTarget && bosses.length === 0 && enemies.length === 0) {
      startWaveTransition('JEFE FINAL — DOPPEL', 8, () => { progression.currentWave = 4; createBoss({ canvas, type: 'doppel' as BossType, id: 'DOPPEL' }); });
    } else if (progression.wavePhase === 9 && bosses.length === 0) winGame();

    if (progression.wavePhase === 2 && bosses.length === 0 && !progression.waveTransition && frameCount > 10) {
      startWaveTransition('SECTOR 2', 3, () => { progression.currentWave = 2; progression.waveKills = 0; });
    } else if (progression.wavePhase === 4 && bosses.length === 0 && !progression.waveTransition && frameCount > 10) {
      startWaveTransition('SECTOR 3', 5, () => { progression.currentWave = 3; progression.waveKills = 0; });
    } else if (progression.wavePhase === 6 && bosses.length === 0 && !progression.waveTransition && frameCount > 10) {
      startWaveTransition('SECTOR 4', 7, () => { progression.currentWave = 4; progression.waveKills = 0; });
    } else if (progression.wavePhase === 8 && !progression.waveTransition && frameCount > 10) {
      const doppelAllDead = !bosses.some(b => b.type === 'doppel' || b.type === 'doppel_y' || b.type === 'doppel_o');
      if (doppelAllDead && bosses.length === 0) progression.wavePhase = 9;
    }
  }
}
