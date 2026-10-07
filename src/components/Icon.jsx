// Stroke icons from fedpoint-main-html/js/icons.js (24×24, currentColor).
const PATHS = {
  heart: <path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 0 1 7.5-6.6 5 5 0 0 1 7.5 6.6z" />,
  heartPulse: <><path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 0 1 7.5-6.6 5 5 0 0 1 7.5 6.6z" /><path d="M6.5 12.2h2.6l1.4-2.6 2.2 4.6 1.4-2h3.4" /></>,
  shieldCheck: <><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" /><path d="M8.8 12.1l2.2 2.2 4.2-4.4" /></>,
  dollar: <path d="M15.4 8.4c-.6-1.2-1.9-1.9-3.4-1.9-1.9 0-3.3 1-3.3 2.4 0 3.3 6.8 1.9 6.8 5.3 0 1.4-1.5 2.5-3.5 2.5-1.6 0-3-.7-3.6-1.9M12 4.5v2M12 16.8v2.2" />,
  tooth: <path d="M7 4C5 4 3.5 5.6 3.5 8c0 2 .8 3.4 1.5 5 .6 1.5.6 3.6 1.2 5.4.3 1 1 1.6 1.7 1.6 1.3 0 1.4-2 2-4 .3-1 .8-1.6 1.6-1.6h.1c.8 0 1.3.6 1.6 1.6.6 2 .7 4 2 4 .7 0 1.4-.6 1.7-1.6.6-1.8.6-3.9 1.2-5.4.7-1.6 1.5-3 1.5-5 0-2.4-1.5-4-3.5-4-1.5 0-2.3.6-3.1 1-.5.3-1.3.3-1.8 0C9.3 4.6 8.5 4 7 4z" />,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M17 14c2.5 0 4 2 4 4.5" /></>,
  scale: <path d="M12 4v16M6 20h12M5 8h14M5 8l-3 7a3.5 3.5 0 0 0 6 0L5 8zM19 8l-3 7a3.5 3.5 0 0 0 6 0l-3-7z" />,
  wallet: <><path d="M3 7a2 2 0 0 1 2-2h13v4M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-1z" /><circle cx="16" cy="13.5" r="1" /></>,
  shield: <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />,
  doc: <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  check: <path d="M5 12l5 5L20 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  up: <path d="M7 11v9H4v-9h3zM7 11l4-7c1.5 0 2.5 1 2 3l-.5 3H19a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 18 20H7" />,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" /></>,
  chev: <path d="M9 6l6 6-6 6" />,
  chevLeft: <path d="M15 6l-6 6 6 6" />,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  arrowUp: <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  volume: <><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></>,
  volumeOff: <><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="M16 9.5l5 5M21 9.5l-5 5" /></>,
};

export default function Icon({ name, size = 16, strokeWidth = 1.8, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {PATHS[name]}
    </svg>
  );
}
