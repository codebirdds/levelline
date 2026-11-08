const P = {
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  "eye-off": <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><path d="M3 3l18 18" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="1" /><path d="M8 11V8a4 4 0 018 0v3" /></>,
  unlock: <><rect x="5" y="11" width="14" height="10" rx="1" /><path d="M8 11V8a4 4 0 017.5-2" /></>,
  up: <path d="M6 15l6-6 6 6" />,
  down: <path d="M6 9l6 6 6-6" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  plus: <path d="M12 5v14M5 12h14" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  back: <path d="M15 5l-7 7 7 7" />,
  minus: <path d="M5 12h14" />,
};
export default function Icon({ name, size = 14, fill = "none" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name]}
    </svg>
  );
}
