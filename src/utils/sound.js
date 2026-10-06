/*
 * Small UI sound effects, synthesised with the Web Audio API (no audio files).
 * Ported from fedpoint-main-html/js/sound.js. Muting is remembered per browser.
 */
const KEY = 'fedpoint.sound';

let ctx = null;
let master = null;
let noise = null; // one second of white noise, reused by every swoosh
let muted = (() => {
  try {
    return localStorage.getItem(KEY) === 'off';
  } catch {
    return false;
  }
})();
const listeners = new Set();

function audio() {
  if (muted) return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    // A gentle low-pass keeps every sound soft.
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 5200;
    master.connect(lp).connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Starting the audio engine can block for a moment, so do it right after the first interaction.
const warm = () => {
  ['pointerdown', 'keydown', 'touchstart'].forEach((t) => window.removeEventListener(t, warm, true));
  setTimeout(audio, 30);
};
['pointerdown', 'keydown', 'touchstart'].forEach((t) => window.addEventListener(t, warm, { capture: true, passive: true }));

function tone({ freq, to, type = 'sine', dur = 0.12, gain = 0.05, attack = 0.006, delay = 0 }) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur * 0.85);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function whoosh({ dur = 0.22, gain = 0.035, from = 600, to = 2400, delay = 0 }) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + delay;
  const src = ac.createBufferSource();
  src.buffer = noise;
  const bp = ac.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 1.2;
  bp.frequency.setValueAtTime(from, t);
  bp.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(master);
  src.start(t);
  src.stop(t + dur + 0.02);
}

export const sfx = {
  /** Question sent: an airy swoosh with a rising blip. */
  send() {
    whoosh({ dur: 0.24, gain: 0.03 });
    tone({ freq: 480, to: 900, dur: 0.13, gain: 0.045, delay: 0.03 });
  },
  /** Answer arrived: a soft two-note chime. */
  done() {
    tone({ freq: 1046.5, dur: 0.5, gain: 0.03 });
    tone({ freq: 2093, type: 'triangle', dur: 0.3, gain: 0.006 });
    tone({ freq: 1568, dur: 0.6, gain: 0.028, delay: 0.09 });
  },
  /** Buttons, cards, menus. */
  tap() {
    tone({ freq: 1500, type: 'triangle', dur: 0.045, gain: 0.018 });
  },
  /** New session. */
  pop() {
    tone({ freq: 620, to: 980, dur: 0.09, gain: 0.04 });
  },
  /** Session removed. */
  remove() {
    tone({ freq: 560, to: 300, dur: 0.12, gain: 0.035 });
  },
};

export const isMuted = () => muted;

export function setMuted(v) {
  muted = v;
  try {
    localStorage.setItem(KEY, v ? 'off' : 'on');
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((fn) => fn());
  if (!v) sfx.tap();
}

export function subscribeMuted(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
