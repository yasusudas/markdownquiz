import React from "react";
import { DICT } from "../data.js";
import { GridBg } from "../ui.jsx";
import { StaticRender } from "../markdown.jsx";

// ============================================================
// DICTIONARY SCREEN
// ============================================================
export const DictScreen = () => {
  const [filter, setFilter] = React.useState("ALL");
  const cats = ["ALL", ...Array.from(new Set(DICT.map((d) => d.cat)))];
  const rows = filter === "ALL" ? DICT : DICT.filter((d) => d.cat === filter);

  return (
    <div style={{ position: "relative", minHeight: "calc(100vh - 81px)" }} data-screen-label="04 Dictionary">
      <GridBg />
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 40px 96px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: ".3em", color: "var(--ink-3)" }}>
              REFERENCE / SYNTAX × OUTPUT
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-.02em", margin: "14px 0 0" }}>記法事典</h1>
            <p style={{ marginTop: 14, fontSize: 15, color: "var(--ink-2)", maxWidth: 560, lineHeight: 1.8 }}>
              左に書く記法、右に表示されるテキスト。よく使うMarkdownを一覧でどうぞ。
            </p>
          </div>
          <div className="mono" style={{
            fontSize: 12, color: "var(--ink-3)", padding: "10px 14px",
            border: "1px solid var(--line-2)", background: "#fff"
          }}>
            {String(rows.length).padStart(2, "0")} ENTRIES
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {cats.map((c) =>
          <button key={c} onClick={() => setFilter(c)} className="mono" style={{
            fontSize: 12, letterSpacing: ".14em", padding: "8px 14px",
            background: filter === c ? "var(--ink)" : "#fff",
            color: filter === c ? "#fff" : "var(--ink-2)",
            border: "1px solid " + (filter === c ? "var(--ink)" : "var(--line-2)"),
            fontFamily: "inherit", cursor: "pointer"
          }}>{c.toUpperCase()}</button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 1fr", background: "var(--ink)", color: "#fff" }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: ".24em", padding: "14px 24px", textAlign: "center" }}>CAT</div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: ".24em", padding: "14px 24px", textAlign: "center" }}>SYNTAX (記法)</div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: ".24em", padding: "14px 24px", textAlign: "center" }}>OUTPUT (表示)</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderTop: "none" }}>
          {rows.map((r, i) => <DictRow key={i} row={r} alt={i % 2 === 1} />)}
        </div>
      </div>
    </div>);

};

const DictRow = ({ row, alt }) =>
<div style={{
  display: "grid", gridTemplateColumns: "200px 1fr 1fr",
  borderTop: "1px solid var(--line)",
  background: alt ? "#fafbfe" : "#fff",
  minHeight: 96
}}>
    <div style={{ padding: "20px 24px", borderRight: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className="mono" style={{
      fontSize: 11, letterSpacing: ".14em", color: "var(--blue-ink)",
      background: "var(--blue-soft)", border: "1px solid #c8d4ff", padding: "4px 10px"
    }}>{row.cat}</span>
    </div>
    <div style={{ padding: "18px 24px", borderRight: "1px solid var(--line)", display: "flex", alignItems: "center" }}>
      <SyntaxBlock text={row.syntax} />
    </div>
    <div style={{ padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <StaticRender r={row.render} />
    </div>
  </div>;


const SyntaxBlock = ({ text }) => {
  const lines = text.split("\\n");
  return (
    <pre className="mono" style={{
      margin: 0, padding: "14px 16px",
      background: "var(--code-bg)", color: "var(--code-ink)",
      fontSize: 13.5, lineHeight: 1.7, letterSpacing: ".01em",
      width: "100%", borderLeft: "3px solid var(--blue)",
      whiteSpace: "pre-wrap", wordBreak: "break-all"
    }}>
      {lines.map((l, i) => <div key={i}><Tinted line={l} /></div>)}
    </pre>);

};

const Tinted = ({ line }) => {
  let m;
  if (m = line.match(/^(#{1,6})\s(.*)/)) return <><span style={{ color: "#7aa2ff" }}>{m[1]}</span> <span>{m[2]}</span></>;
  if (line.startsWith("```")) return <span style={{ color: "#7ad6a3" }}>{line}</span>;
  if (line.startsWith("> ")) return <><span style={{ color: "#c79bff" }}>{">"}</span> <span>{line.slice(2)}</span></>;
  if (line.startsWith("---")) return <span style={{ color: "#7a8aaa" }}>{line}</span>;
  if (line.match(/^(\d+)\./)) return <><span style={{ color: "#7aa2ff" }}>{line.match(/^(\d+\.)/)[0]}</span>{line.slice(line.match(/^(\d+\.)/)[0].length)}</>;
  if (line.match(/^[-*+]\s/)) return <><span style={{ color: "#7aa2ff" }}>{line[0]}</span>{line.slice(1)}</>;
  if (line.startsWith("|")) {
    const parts = line.split("|");
    return <>{parts.map((p, i) => <React.Fragment key={i}>{i > 0 && <span style={{ color: "#7aa2ff" }}>|</span>}{p}</React.Fragment>)}</>;
  }
  return <span dangerouslySetInnerHTML={{ __html:
    line.
    replace(/`([^`]+)`/g, '<span style="color:#7ad6a3">`$1`</span>').
    replace(/(\*\*[^*]+\*\*)/g, '<span style="color:#ffcf73">$1</span>').
    replace(/(!\[[^\]]*\]\([^\)]+\))/g, '<span style="color:#7ad6a3">$1</span>').
    replace(/(\[[^\]]+\]\([^\)]+\))/g, '<span style="color:#7ad6a3">$1</span>')
  }} />;
};
