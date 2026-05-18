import React from "react";

// ============================================================
// MINI MARKDOWN RENDERER
// Single-line aware; supports headings, blockquote, hr, list/task
// item, plus inline: ** ** , __ __, * *, _ _, ~~ ~~, ` `,
// [text](url), ![alt](url).
// Returns an array of React nodes (one per non-empty line group).
// ============================================================
export const ImgPlaceholder = ({ alt = "image", w = 96, h = 56 }) =>
<span style={{
  display: "inline-flex", alignItems: "center", gap: 8,
  padding: "6px 10px",
  border: "1px dashed var(--line-2)", background: "#fff",
  verticalAlign: "middle"
}}>
    <span style={{
    width: 32, height: 24, display: "inline-block",
    backgroundImage: "repeating-linear-gradient(45deg, #eef2fa 0 6px, #fff 6px 12px)",
    border: "1px solid var(--line-2)"
  }} />
    <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{alt}</span>
  </span>;


export function renderInline(text, key = 0) {
  // Process in order. We do a simple tokenization with regex.
  // Order matters: ` first (so other rules don't touch its contents),
  // then images, then links, then bold, then strike, then italic.
  let s = text;
  let k = 0;

  const out = [];
  const pushText = (t) => {if (t) out.push(t);};

  const tokens = [
  { re: /`([^`]+)`/, build: (m) => <code key={`c${key}-${k++}`} className="mono" style={{ fontSize: "0.95em", padding: "2px 6px", background: "#eef2fa", border: "1px solid var(--line-2)" }}>{m[1]}</code> },
  { re: /!\[([^\]]*)\]\(([^)\s]+)\)/, build: (m) => <ImgPlaceholder key={`i${key}-${k++}`} alt={m[1]} /> },
  { re: /\[([^\]]+)\]\(([^)\s]+)\)/, build: (m) => <a key={`l${key}-${k++}`} href={m[2]} onClick={(e) => e.preventDefault()} style={{ color: "var(--blue)", textDecoration: "underline", textUnderlineOffset: 3 }}>{m[1]}</a> },
  { re: /\*\*([^*]+)\*\*/, build: (m) => <strong key={`b${key}-${k++}`} style={{ fontWeight: 800 }}>{m[1]}</strong> },
  { re: /__([^_]+)__/, build: (m) => <strong key={`b${key}-${k++}`} style={{ fontWeight: 800 }}>{m[1]}</strong> },
  { re: /~~([^~]+)~~/, build: (m) => <span key={`s${key}-${k++}`} style={{ textDecoration: "line-through" }}>{m[1]}</span> },
  { re: /(?<![*_\w])\*([^*]+)\*(?![*_\w])/, build: (m) => <em key={`it${key}-${k++}`} style={{ fontStyle: "italic" }}>{m[1]}</em> },
  { re: /(?<![*_\w])_([^_]+)_(?![*_\w])/, build: (m) => <em key={`it${key}-${k++}`} style={{ fontStyle: "italic" }}>{m[1]}</em> }];


  while (s.length) {
    // find earliest match
    let best = null;
    for (const t of tokens) {
      const m = s.match(t.re);
      if (m && (best === null || m.index < best.m.index)) {
        best = { t, m };
      }
    }
    if (!best) {pushText(s);break;}
    if (best.m.index > 0) pushText(s.slice(0, best.m.index));
    out.push(best.t.build(best.m));
    s = s.slice(best.m.index + best.m[0].length);
  }
  return out;
}

export function renderMarkdown(src) {
  if (!src || !src.trim()) return null;
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let listBuf = null; // {kind:'ul'|'ol'|'task', items:[]}
  const flushList = () => {
    if (!listBuf) return;
    const i = blocks.length;
    if (listBuf.kind === "ul") {
      blocks.push(<ul key={`l${i}`} style={{ margin: "6px 0", paddingLeft: 24, fontSize: 16, lineHeight: 1.85 }}>{listBuf.items.map((it, j) => <li key={j}>{renderInline(it, j)}</li>)}</ul>);
    } else if (listBuf.kind === "ol") {
      blocks.push(<ol key={`l${i}`} style={{ margin: "6px 0", paddingLeft: 24, fontSize: 16, lineHeight: 1.85 }}>{listBuf.items.map((it, j) => <li key={j}>{renderInline(it, j)}</li>)}</ol>);
    } else {
      blocks.push(
        <div key={`l${i}`} style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 16 }}>
          {listBuf.items.map(([t, ch], j) =>
          <label key={j} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <span style={{
              width: 16, height: 16, display: "inline-flex",
              alignItems: "center", justifyContent: "center",
              border: "1.5px solid var(--ink-2)", background: ch ? "var(--ink)" : "#fff",
              flex: "0 0 auto"
            }}>
                {ch && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6 L5 9 L10 3" stroke="#fff" strokeWidth="2" fill="none" /></svg>}
              </span>
              <span style={{ textDecoration: ch ? "line-through" : "none", color: ch ? "var(--ink-3)" : "var(--ink)" }}>{renderInline(t, j)}</span>
            </label>
          )}
        </div>
      );
    }
    listBuf = null;
  };

  lines.forEach((raw, i) => {
    const line = raw;
    if (/^\s*$/.test(line)) {flushList();return;}

    let m;
    if (m = line.match(/^\s*###\s+(.*)$/)) {
      flushList();
      blocks.push(<h3 key={i} style={{ margin: "6px 0", fontSize: 20, fontWeight: 700 }}>{renderInline(m[1], i)}</h3>);
      return;
    }
    if (m = line.match(/^\s*##\s+(.*)$/)) {
      flushList();
      blocks.push(<h2 key={i} style={{ margin: "8px 0", fontSize: 26, fontWeight: 700, letterSpacing: "-.005em" }}>{renderInline(m[1], i)}</h2>);
      return;
    }
    if (m = line.match(/^\s*#\s+(.*)$/)) {
      flushList();
      blocks.push(<h1 key={i} style={{ margin: "10px 0", fontSize: 34, fontWeight: 800, letterSpacing: "-.01em" }}>{renderInline(m[1], i)}</h1>);
      return;
    }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushList();
      blocks.push(<hr key={i} style={{ border: "none", borderTop: "1.5px solid var(--ink-2)", margin: "10px 0" }} />);
      return;
    }
    if (m = line.match(/^\s*>\s+(.*)$/)) {
      flushList();
      blocks.push(<blockquote key={i} style={{ margin: "6px 0", padding: "6px 16px", borderLeft: "3px solid var(--blue)", color: "var(--ink-2)", fontStyle: "italic", fontSize: 16 }}>{renderInline(m[1], i)}</blockquote>);
      return;
    }
    if (m = line.match(/^\s*-\s+\[( |x|X)\]\s+(.*)$/)) {
      const checked = m[1].toLowerCase() === "x";
      if (!listBuf || listBuf.kind !== "task") {flushList();listBuf = { kind: "task", items: [] };}
      listBuf.items.push([m[2], checked]);
      return;
    }
    if (m = line.match(/^\s*[-*+]\s+(.*)$/)) {
      if (!listBuf || listBuf.kind !== "ul") {flushList();listBuf = { kind: "ul", items: [] };}
      listBuf.items.push(m[1]);
      return;
    }
    if (m = line.match(/^\s*\d+\.\s+(.*)$/)) {
      if (!listBuf || listBuf.kind !== "ol") {flushList();listBuf = { kind: "ol", items: [] };}
      listBuf.items.push(m[1]);
      return;
    }
    // paragraph
    flushList();
    blocks.push(<p key={i} style={{ margin: "6px 0", fontSize: 16, lineHeight: 1.85 }}>{renderInline(line, i)}</p>);
  });
  flushList();
  return blocks;
}


// ============================================================
// StaticRender — also used by the dictionary
// ============================================================
export const StaticRender = ({ r, size = "md" }) => {
  // sizes
  const big = size === "lg";
  switch (r.tag) {
    case "h1":return <div style={{ fontSize: big ? 42 : 28, fontWeight: big ? 800 : 700, letterSpacing: "-.01em" }}>{r.text}</div>;
    case "h2":return <div style={{ fontSize: big ? 32 : 22, fontWeight: 700, letterSpacing: "-.005em" }}>{r.text}</div>;
    case "h3":return <div style={{ fontSize: big ? 24 : 17, fontWeight: 700 }}>{r.text}</div>;
    case "bold":return <span style={{ fontSize: big ? 22 : 16, fontWeight: 800 }}>{r.text}</span>;
    case "italic":return <span style={{ fontSize: big ? 22 : 16, fontStyle: "italic" }}>{r.text}</span>;
    case "strike":return <span style={{ fontSize: big ? 22 : 16, textDecoration: "line-through" }}>{r.text}</span>;
    case "code":return <code className="mono" style={{ fontSize: big ? 16 : 14, padding: "3px 8px", background: "#eef2fa", border: "1px solid var(--line-2)" }}>{r.text}</code>;
    case "block":return <pre className="mono" style={{ margin: 0, padding: "10px 14px", background: "#0b1020", color: "#e6ecff", fontSize: 13, width: "100%", maxWidth: 300 }}>block</pre>;
    case "link":return <a href={r.url || "#"} onClick={(e) => e.preventDefault()} style={{ color: "var(--blue)", textDecoration: "underline", textUnderlineOffset: 3, fontSize: big ? 22 : 16 }}>{r.text}</a>;
    case "image":return <ImgPlaceholder alt={r.alt} />;
    case "ul":return (
        <ul style={{ margin: 0, paddingLeft: 22, fontSize: big ? 18 : 15, lineHeight: 1.85 }}>
        {r.items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>);

    case "ol":return (
        <ol style={{ margin: 0, paddingLeft: 22, fontSize: big ? 18 : 15, lineHeight: 1.85 }}>
        {r.items.map((t, i) => <li key={i}>{t}</li>)}
      </ol>);

    case "task":return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: big ? 18 : 15 }}>
        {r.items.map(([t, ch], i) =>
          <label key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 16, height: 16, display: "inline-flex",
              alignItems: "center", justifyContent: "center",
              border: "1.5px solid var(--ink-2)", background: ch ? "var(--ink)" : "#fff"
            }}>
              {ch && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6 L5 9 L10 3" stroke="#fff" strokeWidth="2" fill="none" /></svg>}
            </span>
            <span style={{ textDecoration: ch ? "line-through" : "none", color: ch ? "var(--ink-3)" : "var(--ink)" }}>{t}</span>
          </label>
          )}
      </div>);

    case "quote":return (
        <blockquote style={{
          margin: 0, padding: "8px 16px", borderLeft: "3px solid var(--blue)",
          color: "var(--ink-2)", fontStyle: "italic", fontSize: big ? 18 : 15
        }}>{r.text}</blockquote>);

    case "hr":return <div style={{ width: "100%", height: 1.5, background: "var(--ink-2)" }} />;
    case "table":return (
        <div style={{ fontSize: 14, border: "1px solid var(--line-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#eef2fa", fontWeight: 600 }}>
          <div style={{ padding: "6px 12px", borderRight: "1px solid var(--line-2)" }}>A</div>
          <div style={{ padding: "6px 12px" }}>B</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ padding: "6px 12px", borderRight: "1px solid var(--line-2)", borderTop: "1px solid var(--line-2)" }}>1</div>
          <div style={{ padding: "6px 12px", borderTop: "1px solid var(--line-2)" }}>2</div>
        </div>
      </div>);

    case "esc":return <span className="mono" style={{ fontSize: 15 }}>{r.text}</span>;
    default:return null;
  }
};
