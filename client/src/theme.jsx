import { createContext, useCallback, useContext, useEffect, useState } from "react";

const Ctx = createContext({ theme: "dark", toggle: () => {} });
export const useTheme = () => useContext(Ctx);

const initial = () => {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initial);
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-theme", theme);
    el.style.colorScheme = theme;
    try { localStorage.setItem("ic_theme", theme); } catch { /* private mode */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#050a1f" : "#f4f7ff");
  }, [theme]);
  const toggle = useCallback(() => {
    const el = document.documentElement;
    el.classList.add("theme-anim");                       // smooth colour cross-fade
    setTimeout(() => el.classList.remove("theme-anim"), 600);
    setTheme(t => (t === "dark" ? "light" : "dark"));
  }, []);
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}

export function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  const label = dark ? "Switch to light mode" : "Switch to dark mode";
  return (
    <button type="button" className={"theme-toggle " + className + (dark ? " is-dark" : " is-light")} onClick={toggle}
      role="switch" aria-checked={dark} aria-label={label} title={label}>
      <span className="tt-track">
        <span className="tt-thumb">
          <svg className="tt-ic sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
          <svg className="tt-ic moon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
        </span>
      </span>
    </button>
  );
}
