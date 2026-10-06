// A still frame of the "Bloub" assistant character from fedpoint-main-html (no animation).
// Eye presets are in body units (body radius = 100): [x, y, widthScale, heightScale, rotationDeg].
const MOODS = {
  neutral: { l: [-24, -12, 1, 1, 0], r: [24, -12, 1, 1, 0] },
  suspicious: { l: [-8, -10, 1, 1, -7], r: [44, -14, 1.25, 0.42, -4] },
};

function Eye({ v: [x, y, ws, hs, rot] }) {
  const w = 18.6 * ws;
  const h = 41.2 * hs;
  return (
    <rect
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      rx={Math.min(w, h) / 2}
      transform={`rotate(${rot} ${x} ${y})`}
      fill="#F9F9F9"
    />
  );
}

export default function BloubFace({ size = 26, mood = 'neutral', label = 'FedPoint assistant' }) {
  const m = MOODS[mood] || MOODS.neutral;
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" role="img" aria-label={label} className="shrink-0">
      <circle r="100" fill="#248AED" />
      <Eye v={m.l} />
      <Eye v={m.r} />
    </svg>
  );
}
