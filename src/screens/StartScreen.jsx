import React from "react";
import { QUESTIONS, DICT } from "../data.js";
import { GridBg, CornerBrackets, PrimaryBtn, GhostBtn, Arrow } from "../ui.jsx";

// ============================================================
// START SCREEN
// ============================================================
export const StartScreen = ({ onStart, onDict }) =>
<div style={{ position: "relative", minHeight: "calc(100vh - 81px)", overflow: "hidden" }} data-screen-label="01 Start">
    <GridBg />
    <CornerBrackets inset={32} color="var(--ink)" />

    <div style={{
    position: "relative", zIndex: 2,
    maxWidth: 980, margin: "0 auto", padding: "110px 40px 80px",
    textAlign: "center"
  }}>
      <div className="mono" style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      fontSize: 11, letterSpacing: ".32em", color: "var(--ink-3)",
      padding: "6px 12px", border: "1px solid var(--line-2)", background: "#fff"
    }}>
        <span style={{ display: "inline-block", width: 6, height: 6, background: "var(--blue)" }} />
        MARKDOWN · SYNTAX · QUIZ
      </div>

      <h1 style={{
      fontSize: 96, lineHeight: 1.05, letterSpacing: "-.02em", fontWeight: 800,
      margin: "36px 0 18px"
    }}>
        Markdown<br />
        <span style={{
        background: "linear-gradient(180deg, transparent 64%, #cbd6ff 64% 92%, transparent 92%)",
        padding: "0 .12em"
      }}>クイズ</span>
      </h1>

      <div style={{ display: "inline-flex", gap: 28, alignItems: "center", marginTop: 48 }}>
        <PrimaryBtn onClick={onStart} style={{ minWidth: 220 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
            スタート
            <Arrow />
          </span>
        </PrimaryBtn>
        <GhostBtn onClick={onDict} style={{ minWidth: 220 }}>記法事典</GhostBtn>
      </div>

      <div style={{
      marginTop: 96, display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
      maxWidth: 760, margin: "96px auto 0",
      border: "1px solid var(--line)", background: "#fff"
    }}>
        <Stat n={QUESTIONS.length} label="問題プール" />
        <Stat n={DICT.length} label="事典エントリ" divider />
      </div>
    </div>
  </div>;


const Stat = ({ n, label, divider }) =>
<div style={{
  padding: "22px 24px",
  borderLeft: divider ? "1px solid var(--line)" : "none",
  textAlign: "left"
}}>
    <div className="mono" style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-.02em", color: "var(--ink)" }}>
      {String(n).padStart(2, "0")}
    </div>
    <div className="mono" style={{ fontSize: 10, letterSpacing: ".22em", color: "var(--ink-3)", marginTop: 6 }}>
      {label.toUpperCase()}
    </div>
  </div>;
