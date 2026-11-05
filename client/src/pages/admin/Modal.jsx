import { useEffect } from "react";
export default function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const k = e => e.key === "Escape" && onClose();
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="modal" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className={"card mbox" + (wide ? " wide" : "")} role="dialog" aria-modal="true" aria-label={title}>
        <div className="mh"><h3>{title}</h3><button className="x" onClick={onClose} aria-label="Close">✕</button></div>{children}
      </div>
    </div>
  );
}
