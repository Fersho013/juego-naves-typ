import type { Nave, Enemy, EnemyBullet, Particle, FloatingText } from '../types.js';

interface Cannon { x: number; y: number; hp: number; maxHp: number; lastShot: number; alive: boolean; }
interface Gate { x: number; y: number; w: number; h: number; hp: number; maxHp: number; open: boolean; lastSpawn: number; }
interface ModifierPickup { x: number; y: number; vy: number; active: boolean; pulse: number; }
interface GreenPortal { x: number; y: number; radius: number; pulse: number; active: boolean; }

interface SuperBossStateType {
  active: boolean; arena: boolean; phase: 1 | 2 | 3;
  x: number; y: number; w: number; h: number;
  hp: number; maxHp: number; shield: boolean;
  cannons: Cannon[]; gate: Gate | null;
  lasersActive: boolean; laserTimer: number; shieldTimer: number;
  destroyed: boolean; explosionTimer: number;
  modifierPickup: ModifierPickup | null;
  greenPortal: GreenPortal | null;
}

export const superBossState: SuperBossStateType = {
  active: false, arena: false, phase: 1,
  x: 0, y: 0, w: 0, h: 0,
  hp: 20000, maxHp: 20000, shield: true,
  cannons: [], gate: null,
  lasersActive: false, laserTimer: 0, shieldTimer: 0,
  destroyed: false, explosionTimer: 0,
  modifierPickup: null, greenPortal: null
};

export let hasSuperModifier = false;
export function grantSuperModifier(): void { hasSuperModifier = true; }
export function hasSuperModifierActive(): boolean { return hasSuperModifier; }
export function clearSuperModifier(): void { hasSuperModifier = false; }

export function spawnSuperBoss(canvas: HTMLCanvasElement): void {
  superBossState.active = true; superBossState.arena = true; superBossState.phase = 1;
  superBossState.destroyed = false; superBossState.explosionTimer = 0;
  superBossState.x = canvas.width / 2; superBossState.y = 62;
  superBossState.w = canvas.width - 12; superBossState.h = 56;
  superBossState.hp = 20000; superBossState.maxHp = 20000;
  superBossState.shield = true; superBossState.lasersActive = false;
  superBossState.laserTimer = 0; superBossState.shieldTimer = 0;
  superBossState.modifierPickup = null;
  const spacing = superBossState.w / 4;
  superBossState.cannons = [];
  for (let i = 0; i < 3; i++) {
    superBossState.cannons.push({ x: superBossState.x - spacing * 1.2 + i * spacing * 1.2, y: superBossState.y + 38, hp: 2500, maxHp: 2500, lastShot: 0, alive: true });
  }
  superBossState.gate = null;
}

export function clearSuperBoss(): void {
  superBossState.active = false; superBossState.arena = false; superBossState.phase = 1;
  superBossState.cannons = []; superBossState.gate = null;
  superBossState.modifierPickup = null; superBossState.greenPortal = null;
}

interface UpdateSuperBossParams {
  canvas: HTMLCanvasElement; nave: Nave; bullets?: unknown[]; enemyBullets: EnemyBullet[]; enemies: Enemy[];
  particles: Particle[]; floatingTexts: FloatingText[]; fxState: { screenShake: number; hitStopFrames: number };
  createExplosion: (x: number, y: number, color?: string, n?: number) => void;
  spawnDebris: (x: number, y: number, color?: string, n?: number) => void;
  hudState: { score: number }; combatState?: unknown; dropPickup?: unknown; frameCount: number;
}

export function updateSuperBoss({ canvas, nave, enemyBullets, enemies, particles, floatingTexts, fxState, createExplosion, spawnDebris, hudState }: UpdateSuperBossParams): void {
  if (!superBossState.active || superBossState.destroyed) {
    if (superBossState.destroyed) {
      // handled below
    } else return;
  }
  if (superBossState.hp <= 0 && !superBossState.destroyed) {
    superBossState.destroyed = true; superBossState.explosionTimer = 90;
    superBossState.modifierPickup = { x: canvas.width / 2 + 70, y: canvas.height / 2, vy: 1.1, active: true, pulse: 0 };
    superBossState.greenPortal = { x: canvas.width / 2 - 70, y: canvas.height / 2, radius: 24, pulse: 0, active: true };
    createExplosion(superBossState.x, superBossState.y, '#00ff66', 60);
    spawnDebris(superBossState.x, superBossState.y, '#00ff66', 8);
    fxState.screenShake = 34; fxState.hitStopFrames = 12;
    floatingTexts.push({ x: superBossState.x, y: superBossState.y - 70, text: '★ SUPER BOSS DESTRUIDO ★', life: 2.2, color: '#00ff66' });
    floatingTexts.push({ x: superBossState.greenPortal.x, y: superBossState.greenPortal.y - 36, text: 'PORTAL VERDE → SALIR', life: 4, color: '#00ff66' });
    floatingTexts.push({ x: superBossState.modifierPickup.x, y: superBossState.modifierPickup.y - 30, text: 'CONSUMIBLE VERDE', life: 4, color: '#00ff66' });
  }
  if (superBossState.destroyed) {
    superBossState.explosionTimer--;
    if (superBossState.explosionTimer % 12 === 0) {
      const rx = superBossState.x + (Math.random() - 0.5) * superBossState.w * 0.8;
      const ry = superBossState.y + (Math.random() - 0.5) * 22;
      createExplosion(rx, ry, '#ff6600', 10);
    }
    if (superBossState.modifierPickup?.active) {
      const mp = superBossState.modifierPickup;
      mp.y += mp.vy; mp.pulse = (mp.pulse || 0) + 0.09;
      if (mp.y > canvas.height - 26 || mp.y < canvas.height * 0.35) mp.vy *= -1;
      if (Math.hypot(mp.x - nave.x, mp.y - nave.y) < 28) {
        mp.active = false; grantSuperModifier(); hasSuperModifier = true;
        floatingTexts.push({ x: mp.x, y: mp.y - 30, text: '✦ MODIFICADOR VERDE PERMANENTE ✦', life: 2.0, color: '#00ff66' });
        particles.push({ x: mp.x, y: mp.y, vx: 0, vy: 0, life: 1, type: 'bomb_ring', color: '#00ff66' });
        hudState.score += 15000;
      }
    }
    if (superBossState.greenPortal?.active) {
      const gp = superBossState.greenPortal;
      gp.pulse += 0.11;
      if (Math.hypot(gp.x - nave.x, gp.y - nave.y) < gp.radius + 16) {
        floatingTexts.push({ x: gp.x, y: gp.y - 30, text: '¡REGRESANDO A ZONA NORMAL!', life: 1.6, color: '#00ff66' });
        particles.push({ x: gp.x, y: gp.y, vx: 0, vy: 0, life: 1, type: 'bomb_ring', color: '#00ff66' });
        clearSuperBoss();
      }
    }
    return;
  }
  const spacing = superBossState.w / 4;
  superBossState.cannons.forEach((c) => { c.x = superBossState.x - spacing * 1.2 + (superBossState.cannons.indexOf(c)) * spacing * 1.2; c.y = superBossState.y + 38; });
  // Fix spacing index correctly
  superBossState.cannons.forEach((c, i) => { c.x = superBossState.x - spacing * 1.2 + i * spacing * 1.2; c.y = superBossState.y + 38; });

  if (superBossState.phase === 1) {
    superBossState.shield = true; let aliveCount = 0;
    superBossState.cannons.forEach(c => {
      if (!c.alive) return; aliveCount++;
      const now = Date.now();
      if (now - c.lastShot > 130) {
        const ang = Math.atan2(nave.y - c.y, nave.x - c.x);
        enemyBullets.push({ x: c.x, y: c.y, vx: Math.cos(ang) * 5.8, vy: Math.sin(ang) * 5.8, color: '#ff5555' });
        c.lastShot = now;
      }
    });
    if (aliveCount === 0) {
      superBossState.phase = 2;
      superBossState.gate = { x: superBossState.x, y: superBossState.y + 26, w: 120, h: 22, hp: 6000, maxHp: 6000, open: true, lastSpawn: Date.now() };
      floatingTexts.push({ x: superBossState.x, y: superBossState.y + 80, text: '— COMPUERTA ABIERTA —', life: 1.8, color: '#ff9900' });
      particles.push({ x: superBossState.x, y: superBossState.y, vx: 0, vy: 0, life: 1, type: 'bomb_ring', color: '#ff9900' });
    }
  } else if (superBossState.phase === 2) {
    superBossState.shield = true; const g = superBossState.gate; if (!g) return;
    if (g.hp <= 0) {
      superBossState.phase = 3; superBossState.shield = false; superBossState.lasersActive = true;
      superBossState.laserTimer = Date.now(); superBossState.shieldTimer = 0; superBossState.gate = null;
      floatingTexts.push({ x: superBossState.x, y: superBossState.y + 80, text: 'ESCUDOS CAÍDOS — FASE LÁSER', life: 1.8, color: '#00ffcc' }); return;
    }
    if (Date.now() - g.lastSpawn > 425) {
      g.lastSpawn = Date.now();
      const types: Enemy['type'][] = ['common','special','elite','kamikaze','kamikaze_bomb'];
      const pick = types[Math.floor(Math.random()*types.length)];
      const nx = g.x + (Math.random()-0.5)*(g.w-10); const ny = g.y+12;
      const hpMap: Record<string, number> = { common:30, special:60, elite:120, kamikaze:25, kamikaze_bomb:35 };
      const vyMap: Record<string, number> = { common:1.8, special:2.2, elite:1.4, kamikaze:3.0, kamikaze_bomb:2.8 };
      enemies.push({ x:nx, y:ny, type:pick, hp:hpMap[pick]||30, vx:(Math.random()-0.5)*1.6, vy:vyMap[pick]||1.8, shield:pick==='special', lastShot:0, suicidal:pick==='kamikaze'||pick==='kamikaze_bomb', isBombKamikaze:pick==='kamikaze_bomb', bombRadius:42 });
    }
  } else if (superBossState.phase === 3) {
    const now = Date.now();
    if (superBossState.lasersActive) {
      superBossState.shield = false;
      if (now - superBossState.laserTimer > 46) {
        superBossState.laserTimer = now;
        const leftX = superBossState.x - superBossState.w*0.42; const rightX = superBossState.x + superBossState.w*0.42; const y = superBossState.y+18;
        [leftX,rightX].forEach(lx => {
          const ang = Math.atan2(nave.y - y, nave.x - lx);
          enemyBullets.push({ x:lx, y, vx:Math.cos(ang)*7.2, vy:Math.sin(ang)*7.2, color:'#00ccff', isLaser:true });
        });
      }
      if (!superBossState.shieldTimer) superBossState.shieldTimer = now;
      if (now - superBossState.shieldTimer > 3000) { superBossState.lasersActive=false; superBossState.shield=true; superBossState.shieldTimer=now; }
    } else {
      superBossState.shield = true;
      if (now - superBossState.shieldTimer > 2000) { superBossState.lasersActive=true; superBossState.shield=false; superBossState.laserTimer=now; superBossState.shieldTimer=now; }
    }
  }
}

export function canDamageSuperBoss(): boolean {
  if (!superBossState.active || superBossState.destroyed) return false;
  if (superBossState.phase === 1) return false;
  if (superBossState.phase === 2) return false;
  if (superBossState.phase === 3) return superBossState.lasersActive;
  return false;
}

export function damageSuperBoss(dmg: number): number {
  if (!canDamageSuperBoss()) return 0;
  superBossState.hp -= dmg; if (superBossState.hp<0) superBossState.hp=0; return dmg;
}
export function damageCannon(index: number, dmg: number): number {
  const c = superBossState.cannons[index]; if(!c||!c.alive) return 0;
  c.hp -= dmg; if(c.hp<=0){c.hp=0; c.alive=false; return 1;} return 0;
}
export function damageGate(dmg: number): number {
  if(!superBossState.gate) return 0;
  superBossState.gate.hp -= dmg; if(superBossState.gate.hp<0) superBossState.gate.hp=0; return dmg;
}

export function drawSuperBoss(ctx: CanvasRenderingContext2D, frameCount: number): void {
  if (!superBossState.active) return;
  const sb = superBossState;
  if (sb.destroyed) {
    ctx.save(); ctx.globalAlpha = Math.max(0, sb.explosionTimer/90); ctx.fillStyle='#111';
    ctx.fillRect(sb.x - sb.w/2, sb.y - sb.h/2, sb.w, sb.h); ctx.restore();
    if (sb.greenPortal?.active) {
      const gp = sb.greenPortal; const pulse = 0.5 + Math.sin(gp.pulse)*0.32;
      ctx.save(); ctx.globalAlpha = 0.20*pulse+0.14;
      const gg = ctx.createRadialGradient(gp.x,gp.y,0,gp.x,gp.y,gp.radius*3.0);
      gg.addColorStop(0,'rgba(40,255,120,0.95)'); gg.addColorStop(0.45,'rgba(20,180,80,0.42)'); gg.addColorStop(1,'transparent');
      ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(gp.x,gp.y,gp.radius*3.0,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha=0.96; ctx.strokeStyle='#3dff8a'; ctx.lineWidth=2.6; ctx.shadowBlur=18; ctx.shadowColor='#00ff66';
      ctx.beginPath(); ctx.arc(gp.x,gp.y,gp.radius,0,Math.PI*2); ctx.stroke(); ctx.shadowBlur=0;
      ctx.globalAlpha=0.85; ctx.strokeStyle='#b8ffcf'; ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.arc(gp.x,gp.y,gp.radius*0.62,gp.pulse,gp.pulse+Math.PI*1.6); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.globalAlpha=0.9; ctx.fillStyle='#00ff66'; ctx.font='bold 9px Orbitron'; ctx.textAlign='center';
      ctx.fillText('PORTAL VERDE',gp.x,gp.y - gp.radius -12); ctx.restore();
    }
    if (sb.modifierPickup?.active) {
      const p = sb.modifierPickup; const pulse = 0.8 + Math.sin(p.pulse||0)*0.2;
      ctx.save(); ctx.globalAlpha=pulse; ctx.shadowBlur=18; ctx.shadowColor='#00ff66'; ctx.fillStyle='#00ff66';
      ctx.beginPath(); ctx.arc(p.x,p.y,14,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='#003a18'; ctx.lineWidth=2; ctx.stroke();
      ctx.shadowBlur=0; ctx.fillStyle='#002b12'; ctx.font='bold 14px Orbitron'; ctx.textAlign='center'; ctx.fillText('✦',p.x,p.y+5);
      ctx.globalAlpha=1; ctx.fillStyle='#00ff66'; ctx.font='bold 8px Orbitron'; ctx.fillText('TRIPLE VERDE',p.x,p.y+24);
      ctx.strokeStyle='rgba(0,255,102,0.7)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.arc(p.x,p.y,19+Math.sin(p.pulse)*2,p.pulse,p.pulse+Math.PI*1.4); ctx.stroke(); ctx.restore();
    }
    return;
  }
  ctx.save(); ctx.shadowBlur=22; ctx.shadowColor=sb.shield?'#1e90ff':'#ff3366';
  const grad = ctx.createLinearGradient(sb.x - sb.w/2, sb.y, sb.x + sb.w/2, sb.y);
  grad.addColorStop(0,'#1a1a2e'); grad.addColorStop(0.5,'#2a2a4a'); grad.addColorStop(1,'#1a1a2e');
  ctx.fillStyle=grad; ctx.fillRect(sb.x - sb.w/2, sb.y - sb.h/2, sb.w, sb.h);
  ctx.strokeStyle=sb.shield?'#1e90ff':'#ff9900'; ctx.lineWidth=2.5; ctx.strokeRect(sb.x - sb.w/2, sb.y - sb.h/2, sb.w, sb.h);
  ctx.strokeStyle='rgba(255,255,255,0.12)'; ctx.lineWidth=1;
  for(let i=1;i<4;i++){ const y=sb.y - sb.h/2 + (sb.h/4)*i; ctx.beginPath(); ctx.moveTo(sb.x - sb.w/2+12,y); ctx.lineTo(sb.x + sb.w/2-12,y); ctx.stroke(); }
  if(sb.shield){ ctx.globalAlpha=0.18+Math.sin(frameCount*0.12)*0.07; ctx.fillStyle='#1e90ff'; ctx.fillRect(sb.x - sb.w/2-4,sb.y - sb.h/2-4,sb.w+8,sb.h+8);
    ctx.globalAlpha=0.55; ctx.strokeStyle='#6ec8ff'; ctx.lineWidth=1.5; ctx.setLineDash([6,4]); ctx.strokeRect(sb.x - sb.w/2-6,sb.y - sb.h/2-6,sb.w+12,sb.h+12); ctx.setLineDash([]); }
  ctx.shadowBlur=0; const hpPct=sb.hp/sb.maxHp; const barW=sb.w*0.86; const barX=sb.x - barW/2;
  ctx.globalAlpha=1; ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(barX,sb.y - sb.h/2 -14,barW,8);
  ctx.fillStyle=sb.shield?'#1e90ff':(sb.phase===3&&sb.lasersActive?'#00ff66':'#ff3366'); ctx.fillRect(barX,sb.y - sb.h/2 -14,barW*hpPct,8);
  ctx.strokeStyle='#333'; ctx.strokeRect(barX,sb.y - sb.h/2 -14,barW,8);
  ctx.fillStyle='#aaa'; ctx.font='7px Orbitron'; ctx.textAlign='center';
  ctx.fillText(`NODRIZA · FASE ${sb.phase} ${sb.shield?'[ESCUDO]':sb.lasersActive?'[LÁSER]':''}`,sb.x,sb.y - sb.h/2 -18); ctx.restore();
  if(sb.phase===1){ sb.cannons.forEach(c=>{ if(!c.alive) return; ctx.save(); ctx.translate(c.x,c.y);
    ctx.fillStyle='#2d2d3a'; ctx.strokeStyle='#555'; ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(0,0,18,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle=c.hp<200?'#ff4444':'#888'; ctx.fillRect(-3,-18,6,22);
    const pct=c.hp/c.maxHp; ctx.fillStyle='#111'; ctx.fillRect(-18,16,36,5);
    ctx.fillStyle=pct>0.5?'#33ff66':pct>0.25?'#ffcc00':'#ff3344'; ctx.fillRect(-18,16,36*pct,5);
    ctx.strokeStyle='#333'; ctx.strokeRect(-18,16,36,5); ctx.restore(); }); }
  if(sb.phase===2 && sb.gate){ const g=sb.gate; ctx.save(); ctx.translate(g.x,g.y);
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(-g.w/2,-g.h/2,g.w,g.h);
    ctx.strokeStyle=g.hp<400?'#ff4444':'#ff9900'; ctx.lineWidth=2; ctx.strokeRect(-g.w/2,-g.h/2,g.w,g.h);
    ctx.fillStyle='#333'; for(let dx=-g.w/2+6;dx<g.w/2;dx+=14){ ctx.fillRect(dx,-g.h/2-4,8,6); ctx.fillRect(dx,g.h/2-2,8,6); }
    const pct=g.hp/g.maxHp; ctx.fillStyle='#111'; ctx.fillRect(-g.w/2,g.h/2+8,g.w,6);
    ctx.fillStyle=pct>0.5?'#ff9900':'#ff3344'; ctx.fillRect(-g.w/2,g.h/2+8,g.w*pct,6);
    ctx.fillStyle='#ffcc00'; ctx.font='6px Orbitron'; ctx.textAlign='center'; ctx.fillText('COMPUERTA',0,-g.h/2-8); ctx.restore(); }
  if(sb.phase===3 && sb.lasersActive){ ctx.save(); ctx.globalAlpha=0.22; ctx.fillStyle='#00ccff';
    const lx1=sb.x - sb.w*0.42, lx2=sb.x + sb.w*0.42; ctx.fillRect(lx1-6,sb.y+18,12,40); ctx.fillRect(lx2-6,sb.y+18,12,40); ctx.restore(); }
}
export function isInSuperArena(): boolean { return superBossState.arena; }
