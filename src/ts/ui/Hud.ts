import type { Boss } from '../types.js';

export const hudState: { score: number; comboCount: number; comboMultiplier: number; comboResetTimer: ReturnType<typeof setTimeout> | null } =
  { score: 0, comboCount: 0, comboMultiplier: 1, comboResetTimer: null };

interface UpdateHUDParams {
  combatState: { health: number; bombs: number; hasRevive: boolean };
  weaponState: { current: string };
  progression: { currentWave: number };
  gameMode: { value: string };
}

export function updateHUD({ combatState, weaponState, progression, gameMode }: UpdateHUDParams): void {
  const scoreEl = document.getElementById('val-score');
  if (scoreEl) scoreEl.innerText = String(hudState.score);
  const bombEl = document.getElementById('val-bombs');
  if (bombEl) bombEl.innerText = String(combatState.bombs);

  const hpPct = Math.max(0, Math.min(100, combatState.health));
  const healthFill = document.getElementById('health-bar-fill') as HTMLElement | null;
  const healthPctEl = document.getElementById('val-health-pct');
  if (healthFill) {
    healthFill.style.width = hpPct + '%';
    healthFill.style.background = hpPct > 50 ? '#33ff66' : hpPct > 25 ? '#ffcc00' : '#ff3344';
  }
  if (healthPctEl) healthPctEl.innerText = Math.round(hpPct) + '%';
  const sectorLabel = gameMode.value === 'progressive' ? ` — SECTOR ${progression.currentWave}` : '';
  const levelTag = document.getElementById('level-tag');
  if (levelTag) levelTag.innerText = `MODO: ${gameMode.value.toUpperCase()}${sectorLabel}`;
  const wEl = document.getElementById('val-weapon') as HTMLElement | null;
  if (wEl) {
    wEl.innerText = weaponState.current === 'spread' ? 'SPREAD ★' : weaponState.current === 'laser' ? 'LASER ★' : 'NORMAL';
    wEl.style.color = weaponState.current !== 'normal' ? '#ff9900' : 'var(--primary)';
  }
  const rEl = document.getElementById('val-revive') as HTMLElement | null;
  if (rEl) rEl.style.display = combatState.hasRevive ? 'inline' : 'none';
}

export function updateComboDisplay(): void {
  const el = document.getElementById('combo-display') as HTMLElement | null;
  if (!el) return;
  if (hudState.comboCount >= 3) {
    el.style.display = 'block';
    el.innerText = hudState.comboMultiplier >= 3 ? `🔥 COMBO x${hudState.comboMultiplier} [${hudState.comboCount}]` : `⚡ COMBO x${hudState.comboMultiplier} [${hudState.comboCount}]`;
    el.style.color = hudState.comboMultiplier >= 3 ? 'var(--danger)' : 'var(--warning)';
    el.style.textShadow = `0 0 10px ${hudState.comboMultiplier >= 3 ? 'var(--danger)' : 'var(--warning)'}`;
  } else {
    el.style.display = 'none';
  }
}

interface WaveProgressParams {
  gameMode: { value: string };
  progression: { wavePhase: number; waveKills: number; waveKillTarget: number; waveTransition: boolean };
  bosses: Boss[];
}

export function updateWaveProgress({ gameMode, progression, bosses }: WaveProgressParams): void {
  if (gameMode.value !== 'progressive') return;
  const el = document.getElementById('wave-progress') as HTMLElement | null;
  const alertEl = document.getElementById('bomb-alert') as HTMLElement | null;
  if (!el) return;
  const isWavePhase = [1,3,5,7].includes(progression.wavePhase);
  if (!isWavePhase || progression.waveTransition) {
    el.style.display = 'none';
    if (alertEl) alertEl.style.display = 'none';
    return;
  }
  const pct = Math.min(100, (progression.waveKills / progression.waveKillTarget) * 100);
  const sectorNum = progression.wavePhase === 1 ? 1 : progression.wavePhase === 3 ? 2 : progression.wavePhase === 5 ? 3 : 4;
  el.style.display = 'block';
  el.innerHTML = `SECTOR ${sectorNum}: <span style="color:${pct>=100?'#00ff00':'var(--primary)'}">${progression.waveKills}/${progression.waveKillTarget}</span>
        <div style="width:100%;height:4px;background:#333;border-radius:2px;margin-top:3px;">
          <div style="width:${pct}%;height:4px;background:${pct>=100?'#00ff00':'var(--primary)'};border-radius:2px;transition:width 0.1s;"></div>
        </div>`;
  if (alertEl) {
    if (pct >= 100 && bosses.length === 0) {
      alertEl.style.display = 'block';
      const pulse = Math.sin(Date.now() / 250);
      const col = pulse > 0 ? 'var(--warning)' : '#ff3366';
      alertEl.style.color = col; alertEl.style.borderColor = col; alertEl.style.textShadow = `0 0 10px ${col}`;
      alertEl.innerText = '💣 USA BOMBA → IR AL JEFE 💣';
    } else {
      alertEl.style.display = 'none';
    }
  }
}
