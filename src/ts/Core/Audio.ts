let audioCtx: AudioContext | null = null;
let masterGainNode: GainNode | null = null;
let isMuted = false;

export function initAudio(): void {
  if (!audioCtx) {
    const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    audioCtx = new Ctx();
    masterGainNode = audioCtx.createGain();
    masterGainNode.connect(audioCtx.destination);
    masterGainNode.gain.value = isMuted ? 0 : 0.5;
  } else if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
}

export function toggleVolume(): void {
  initAudio();
  isMuted = !isMuted;
  const btn = document.getElementById('btn-volume');
  if (btn) btn.innerText = isMuted ? '🔇' : '🔊';
  if (masterGainNode) masterGainNode.gain.value = isMuted ? 0 : 0.5;
}

export function getAudioState(): { isMuted: boolean; hasCtx: boolean } {
  return { isMuted, hasCtx: !!audioCtx };
}

function withAudio(fn: (ctx: AudioContext, gain: GainNode) => void): void {
  if (!audioCtx || !masterGainNode) return;
  fn(audioCtx, masterGainNode);
}

export const sfx = {
  shoot: (): void => withAudio((ctx, master) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'square'; osc.connect(gain); gain.connect(master);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  }),
  parry: (): void => withAudio((ctx, master) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sine'; osc.connect(gain); gain.connect(master);
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  }),
  bomb: (): void => withAudio((ctx, master) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sawtooth'; osc.connect(gain); gain.connect(master);
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(); osc.stop(ctx.currentTime + 0.6);
  }),
  hit: (): void => withAudio((ctx, master) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sawtooth'; osc.connect(gain); gain.connect(master);
    osc.frequency.setValueAtTime(250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
  }),
  dash: (): void => withAudio((ctx, master) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sine'; osc.connect(gain); gain.connect(master);
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.08);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(); osc.stop(ctx.currentTime + 0.2);
  }),
  powerup: (): void => withAudio((ctx, master) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sine'; osc.connect(gain); gain.connect(master);
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  }),
  laser: (): void => withAudio((ctx, master) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sawtooth'; osc.connect(gain); gain.connect(master);
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
    osc.start(); osc.stop(ctx.currentTime + 0.07);
  })
} as const;
