import { social } from "../data/content.js";

const ICON = {
  LinkedIn: <path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.05c.55-1 1.9-2 3.9-2 4.1 0 4.75 2.7 4.75 6.2V21h-4v-4.9c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V21h-4z" />,
  Instagram: <g fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></g>,
  Facebook: <path fill="currentColor" d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z" />
};

export default function Social() {
  return (
    <div className="social">
      {social.map(([n, url]) => (
        <a key={n} href={url} target="_blank" rel="noreferrer" aria-label={n} title={n}>
          <svg viewBox="0 0 24 24" aria-hidden="true">{ICON[n]}</svg>
        </a>))}
    </div>
  );
}
