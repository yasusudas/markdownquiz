import React from "react";

// ============================================================
// ATOMS  ——  Mark, TopBar, buttons, decorations
// ============================================================

export const Mark = ({ size = 44 }) =>
<svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
    <rect x="1" y="1" width="42" height="42" rx="9" fill="#0b1020" />
    <rect x="1" y="1" width="42" height="42" rx="9" fill="none" stroke="#2456f6" strokeWidth="1.5" />
    <path d="M9 31 V13 L15 20 L21 13 V31" stroke="#e6ecff" strokeWidth="2.2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M30 13 V27 M25 22 L30 27 L35 22" stroke="#2456f6" strokeWidth="2.2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
  </svg>;


export const TopBar = ({ route, onHome }) =>
<header style={{
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "22px 56px", borderBottom: "1px solid var(--line)",
  background: "rgba(255,255,255,.7)", backdropFilter: "blur(8px)",
  position: "sticky", top: 0, zIndex: 10
}}>
    <button onClick={onHome} style={{
    display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", padding: 0, color: "inherit", cursor: "pointer"
  }}>
      <Mark size={36} />
      <div style={{ textAlign: "left" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: ".18em", color: "var(--ink-3)" }}>LEARN · MARKDOWN</div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: ".02em", marginTop: 2 }}>Markdownクイズ</div>
      </div>
    </button>
    <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Crumb active={route === "start"}>HOME</Crumb>
      <Sep />
      <Crumb active={route === "quiz"}>QUIZ</Crumb>
      <Sep />
      <Crumb active={route === "dict"}>記法事典</Crumb>
    </nav>
  </header>;


const Crumb = ({ active, children }) =>
<span className="mono" style={{
  fontSize: 11, letterSpacing: ".22em",
  color: active ? "var(--blue)" : "var(--ink-3)",
  fontWeight: active ? 600 : 400
}}>{children}</span>;

const Sep = () =>
<span className="mono" style={{ color: "var(--line-2)", fontSize: 11 }}>/</span>;


export const PrimaryBtn = ({ onClick, children, disabled, style }) =>
<button onClick={disabled ? undefined : onClick} disabled={disabled} style={{
  background: disabled ? "#9aa6c5" : "var(--blue)", color: "#fff", border: "none",
  padding: "18px 38px", fontSize: 16, fontWeight: 600, letterSpacing: ".04em",
  borderRadius: 0, position: "relative",
  boxShadow: disabled ? "6px 6px 0 0 #c4cce0" : "6px 6px 0 0 var(--ink)",
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "transform .12s ease, box-shadow .12s ease",
  ...style
}}
onMouseDown={(e) => {if (disabled) return;e.currentTarget.style.transform = "translate(3px,3px)";e.currentTarget.style.boxShadow = "3px 3px 0 0 var(--ink)";}}
onMouseUp={(e) => {if (disabled) return;e.currentTarget.style.transform = "";e.currentTarget.style.boxShadow = "6px 6px 0 0 var(--ink)";}}
onMouseLeave={(e) => {if (disabled) return;e.currentTarget.style.transform = "";e.currentTarget.style.boxShadow = "6px 6px 0 0 var(--ink)";}}>

    {children}
  </button>;


export const GhostBtn = ({ onClick, children, style }) =>
<button onClick={onClick} style={{
  background: "transparent", color: "var(--ink)", border: "1.5px solid var(--ink)",
  padding: "16.5px 36.5px", fontSize: 16, fontWeight: 600, letterSpacing: ".04em",
  borderRadius: 0,
  boxShadow: "6px 6px 0 0 var(--blue)", cursor: "pointer",
  transition: "transform .12s ease, box-shadow .12s ease",
  fontFamily: "inherit",
  ...style
}}
onMouseDown={(e) => {e.currentTarget.style.transform = "translate(3px,3px)";e.currentTarget.style.boxShadow = "3px 3px 0 0 var(--blue)";}}
onMouseUp={(e) => {e.currentTarget.style.transform = "";e.currentTarget.style.boxShadow = "6px 6px 0 0 var(--blue)";}}
onMouseLeave={(e) => {e.currentTarget.style.transform = "";e.currentTarget.style.boxShadow = "6px 6px 0 0 var(--blue)";}}>

    {children}
  </button>;


export const CornerBrackets = ({ inset = 24, color = "var(--ink)" }) => {
  const arm = 22,t = 1.5;
  return (
    <>
      <div style={{ position: "absolute", top: inset, left: inset, width: arm, height: arm, borderTop: `${t}px solid ${color}`, borderLeft: `${t}px solid ${color}` }} />
      <div style={{ position: "absolute", top: inset, right: inset, width: arm, height: arm, borderTop: `${t}px solid ${color}`, borderRight: `${t}px solid ${color}` }} />
      <div style={{ position: "absolute", bottom: inset, left: inset, width: arm, height: arm, borderBottom: `${t}px solid ${color}`, borderLeft: `${t}px solid ${color}` }} />
      <div style={{ position: "absolute", bottom: inset, right: inset, width: arm, height: arm, borderBottom: `${t}px solid ${color}`, borderRight: `${t}px solid ${color}` }} />
    </>);

};

export const GridBg = () =>
<div aria-hidden="true" style={{
  position: "absolute", inset: 0, pointerEvents: "none",
  backgroundImage:
  "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)",
  backgroundSize: "48px 48px"
}} />;


export const Arrow = () =>
<svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
    <path d="M1 7 H20 M14 1 L20 7 L14 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>;
