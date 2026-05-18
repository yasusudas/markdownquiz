import React from "react";

// ============================================================
// MINI MARKDOWN RENDERER
// Learning-focused renderer for the formats used in the quiz.
// It intentionally renders safe React elements instead of injecting HTML.
// ============================================================
const ESC = "\uE000";

const emojiMap = {
  "+1": "👍",
  thumbsup: "👍",
  smile: "😄",
  laughing: "😆",
  tada: "🎉",
  warning: "⚠️",
  memo: "📝",
  rocket: "🚀",
  heart: "❤️"
};

const headingSizes = {
  h1: [42, 28, 800],
  h2: [32, 22, 700],
  h3: [24, 17, 700],
  h4: [20, 15.5, 700],
  h5: [17, 14, 700],
  h6: [15, 13, 700]
};

const normalizeEscapes = (text) =>
text.replace(/\\([\\`*_\[\]()#~>!+.\-])/g, `${ESC}$1`);

const restoreEscapes = (text) => text.split(ESC).join("");

const getAttr = (html, name) => {
  const m = html.match(new RegExp(`${name}=["']([^"']*)["']`, "i"));
  return m ? m[1] : "";
};

const trimPipes = (line) =>
line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

const alignFromCell = (cell) => {
  const s = cell.trim();
  if (/^:-+:$/.test(s)) return "center";
  if (/^-+:$/.test(s)) return "right";
  if (/^:-+$/.test(s)) return "left";
  return "left";
};

export const ImgPlaceholder = ({ alt = "image", w = 96, h = 56, title }) =>
<span style={{
  display: "inline-flex", alignItems: "center", gap: 8,
  padding: "6px 10px",
  border: "1px dashed var(--line-2)", background: "#fff",
  verticalAlign: "middle", maxWidth: 260
}}>
    <span style={{
    width: Math.min(Number(w) || 32, 160),
    height: Math.min(Number(h) || 24, 90),
    display: "inline-block",
    backgroundImage: "repeating-linear-gradient(45deg, #eef2fa 0 6px, #fff 6px 12px)",
    border: "1px solid var(--line-2)",
    flex: "0 0 auto"
  }} />
    <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)", overflowWrap: "anywhere" }}>
      {alt}{title ? ` / ${title}` : ""}
    </span>
  </span>;

const colorLike = (text) =>
/^(#[0-9a-f]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\))$/i.test(text.trim());

const InlineCode = ({ text }) =>
<code className="mono" style={{ fontSize: "0.95em", padding: "2px 6px", background: "#eef2fa", border: "1px solid var(--line-2)", display: "inline-flex", alignItems: "center", gap: 6 }}>
    {colorLike(text) && <span style={{ width: 12, height: 12, border: "1px solid var(--line-2)", background: text.trim(), display: "inline-block" }} />}
    {text}
  </code>;

const CodeBlock = ({ text, lang, file }) =>
<pre className="mono" style={{
  margin: "6px 0", padding: "12px 14px",
  background: "#0b1020", color: "#e6ecff",
  fontSize: 13, lineHeight: 1.7, borderLeft: "3px solid var(--blue)",
  overflow: "auto", width: "100%"
}}>
    {(lang || file) && <div style={{ color: "#7aa2ff", fontSize: 11, marginBottom: 6 }}>{file || lang}</div>}
    <code>
      {text.split("\n").map((line, i) => {
      const color = /^diff/.test(lang || "") && line.startsWith("+") ? "#7ad6a3" :
      /^diff/.test(lang || "") && line.startsWith("-") ? "#ff8a9a" : "inherit";
      return <React.Fragment key={i}><span style={{ color }}>{line}</span>{i + 1 < text.split("\n").length && "\n"}</React.Fragment>;
    })}
    </code>
  </pre>;

const MathBlock = ({ text, inline = false }) => {
  if (inline) {
    return <code className="mono" style={{ padding: "2px 6px", background: "#fff7df", border: "1px solid #efd58c" }}>{text}</code>;
  }
  return (
    <div className="mono" style={{
      padding: "14px 16px", background: "#fff7df", border: "1px solid #efd58c",
      color: "#4b3500", fontSize: 15, textAlign: "center", width: "100%"
    }}>{text}</div>
  );
};

const DiagramBlock = ({ kind, text }) =>
<div style={{
  border: "1px solid var(--line-2)", background: "#f8fbff",
  padding: "14px 16px", width: "100%"
}}>
    <div className="mono" style={{ fontSize: 11, letterSpacing: ".16em", color: "var(--blue)", marginBottom: 10 }}>
      {String(kind || "diagram").toUpperCase()} DIAGRAM
    </div>
    <pre className="mono" style={{ margin: 0, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--ink-2)" }}>{text}</pre>
  </div>;

const NoteBlock = ({ tone = "info", text }) => {
  const map = {
    info: { bg: "#eef5ff", bd: "#9ec5ff", label: "NOTE" },
    warn: { bg: "#fff7df", bd: "#f0c56f", label: "WARNING" },
    alert: { bg: "#fff0f3", bd: "#ef9cab", label: "ALERT" }
  };
  const c = map[tone] || map.info;
  return (
    <div style={{ border: `1px solid ${c.bd}`, borderLeft: `4px solid ${c.bd}`, background: c.bg, padding: "12px 14px", width: "100%" }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: ".16em", color: "var(--ink-3)", marginBottom: 6 }}>{c.label}</div>
      <div style={{ fontSize: 15, lineHeight: 1.7 }}>{renderInline(text)}</div>
    </div>
  );
};

const TablePreview = ({ headers = ["A", "B"], rows = [["1", "2"]], align = [] }) =>
<div style={{ fontSize: 14, border: "1px solid var(--line-2)", width: "100%", overflow: "hidden" }}>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`, background: "#eef2fa", fontWeight: 600 }}>
      {headers.map((h, i) =>
      <div key={i} style={{ padding: "7px 10px", borderRight: i + 1 === headers.length ? "none" : "1px solid var(--line-2)", textAlign: align[i] || "left" }}>
          {h}
        </div>
      )}
    </div>
    {rows.map((row, r) =>
    <div key={r} style={{ display: "grid", gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
        {headers.map((_, i) =>
        <div key={i} style={{
          padding: "7px 10px",
          borderRight: i + 1 === headers.length ? "none" : "1px solid var(--line-2)",
          borderTop: "1px solid var(--line-2)",
          textAlign: align[i] || "left"
        }}>{row[i] || ""}</div>
        )}
      </div>
    )}
  </div>;

const LinkCard = ({ url }) =>
<a href={url} onClick={(e) => e.preventDefault()} style={{
  display: "block", color: "inherit", textDecoration: "none",
  border: "1px solid var(--line-2)", background: "#fff", padding: "12px 14px", width: "100%"
}}>
    <div className="mono" style={{ color: "var(--blue)", fontSize: 13, overflowWrap: "anywhere" }}>{url}</div>
    <div style={{ marginTop: 6, color: "var(--ink-3)", fontSize: 13 }}>リンクプレビュー</div>
  </a>;

const renderList = (items, kind) =>
<div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 16, lineHeight: 1.7, margin: "6px 0" }}>
    {items.map((it, i) => {
    const mark = kind === "ol" ? `${i + 1}.` : "•";
    return (
      <div key={i} style={{ display: "flex", gap: 10, paddingLeft: it.level * 22 }}>
        {kind === "task" ?
        <span style={{
          width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center",
          border: "1.5px solid var(--ink-2)", background: it.checked ? "var(--ink)" : "#fff", marginTop: 5, flex: "0 0 auto"
        }}>
            {it.checked && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6 L5 9 L10 3" stroke="#fff" strokeWidth="2" fill="none" /></svg>}
          </span> :
        <span className="mono" style={{ width: 22, flex: "0 0 auto", color: "var(--ink-3)" }}>{mark}</span>
        }
        <span style={{ textDecoration: it.checked ? "line-through" : "none", color: it.checked ? "var(--ink-3)" : "var(--ink)" }}>
          {renderInline(it.text, i)}
        </span>
      </div>
    );
  })}
  </div>;

export function renderInline(text, key = 0, refs = {}, footnotes = {}) {
  let s = normalizeEscapes(text).replace(/<!--[\s\S]*?-->/g, "");
  let k = 0;
  const out = [];
  const pushText = (t) => {if (t) out.push(restoreEscapes(t));};

  const tokens = [
  { re: /<br\s*\/?>/i, build: () => <br key={`br${key}-${k++}`} /> },
  { re: /\[\^([^\]]+)\]/, build: (m) => <sup key={`fn${key}-${k++}`} className="mono" title={footnotes[m[1]] || ""} style={{ color: "var(--blue)", fontSize: ".75em" }}>[{m[1]}]</sup> },
  { re: /\$`([^`]+)`\$/, build: (m) => <MathBlock key={`miq${key}-${k++}`} text={m[1]} inline /> },
  { re: /\$([^$\n]+)\$/, build: (m) => <MathBlock key={`mi${key}-${k++}`} text={m[1]} inline /> },
  { re: /``\s*([^`]+)\s*``/, build: (m) => <InlineCode key={`c2${key}-${k++}`} text={restoreEscapes(m[1])} /> },
  { re: /`([^`]+)`/, build: (m) => <InlineCode key={`c${key}-${k++}`} text={restoreEscapes(m[1])} /> },
  { re: /<u>([\s\S]*?)<\/u>/i, build: (m) => <span key={`u${key}-${k++}`} style={{ textDecoration: "underline" }}>{renderInline(m[1], `${key}-u${k}`, refs, footnotes)}</span> },
  { re: /<(b|strong)>([\s\S]*?)<\/\1>/i, build: (m) => <strong key={`hb${key}-${k++}`} style={{ fontWeight: 800 }}>{renderInline(m[2], `${key}-hb${k}`, refs, footnotes)}</strong> },
  { re: /<(i|em)>([\s\S]*?)<\/\1>/i, build: (m) => <em key={`hi${key}-${k++}`} style={{ fontStyle: "italic" }}>{renderInline(m[2], `${key}-hi${k}`, refs, footnotes)}</em> },
  { re: /<span\s+style=["'][^"']*color:\s*([^;"']+);?[^"']*["']>([\s\S]*?)<\/span>/i, build: (m) => <span key={`col${key}-${k++}`} style={{ color: m[1].trim() }}>{renderInline(m[2], `${key}-col${k}`, refs, footnotes)}</span> },
  { re: /<span\s+style=[^>\s]*color:\s*([^;>\s]+);?>([\s\S]*?)<\/span>/i, build: (m) => <span key={`colu${key}-${k++}`} style={{ color: m[1].trim() }}>{renderInline(m[2], `${key}-colu${k}`, refs, footnotes)}</span> },
  { re: /<div\s+style=["'][^"']*color:\s*([^;"']+);?[^"']*["']>([\s\S]*?)<\/div>/i, build: (m) => <span key={`divcol${key}-${k++}`} style={{ color: m[1].trim(), display: "block" }}>{renderInline(m[2], `${key}-divcol${k}`, refs, footnotes)}</span> },
  { re: /<div\s+style=[^>\s]*color:\s*([^;>\s]+);?>([\s\S]*?)<\/div>/i, build: (m) => <span key={`divcolu${key}-${k++}`} style={{ color: m[1].trim(), display: "block" }}>{renderInline(m[2], `${key}-divcolu${k}`, refs, footnotes)}</span> },
  { re: /<font\s+color=["']([^"']+)["']>([\s\S]*?)<\/font>/i, build: (m) => <span key={`font${key}-${k++}`} style={{ color: m[1].trim() }}>{renderInline(m[2], `${key}-font${k}`, refs, footnotes)}</span> },
  { re: /<img\s+[^>]*>/i, build: (m) => <ImgPlaceholder key={`imghtml${key}-${k++}`} alt={getAttr(m[0], "alt") || "image"} w={getAttr(m[0], "width") || 96} h={getAttr(m[0], "height") || 56} title={getAttr(m[0], "title")} /> },
  { re: /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["']([^"']+)["'])?(?:\s+=(\d*)x?(\d*)?)?\)/, build: (m) => <ImgPlaceholder key={`i${key}-${k++}`} alt={m[1] || "image"} title={m[3]} w={m[4] || 96} h={m[5] || 56} /> },
  { re: /\[([^\]]+)\]\(([^)\s]+)(?:\s+["']([^"']+)["'])?\)/, build: (m) => <a key={`l${key}-${k++}`} href={m[2]} title={m[3] || ""} onClick={(e) => e.preventDefault()} style={{ color: "var(--blue)", textDecoration: "underline", textUnderlineOffset: 3 }}>{renderInline(m[1], `${key}-l${k}`, refs, footnotes)}</a> },
  { re: /\[([^\]]+)\]\[([^\]]+)\]/, build: (m) => <a key={`rl${key}-${k++}`} href={refs[m[2]] || "#"} onClick={(e) => e.preventDefault()} style={{ color: "var(--blue)", textDecoration: "underline", textUnderlineOffset: 3 }}>{m[1]}</a> },
  { re: /\*\*([^*]+)\*\*/, build: (m) => <strong key={`b${key}-${k++}`} style={{ fontWeight: 800 }}>{restoreEscapes(m[1])}</strong> },
  { re: /__([^_]+)__/, build: (m) => <strong key={`b${key}-${k++}`} style={{ fontWeight: 800 }}>{restoreEscapes(m[1])}</strong> },
  { re: /~~([^~]+)~~/, build: (m) => <span key={`s${key}-${k++}`} style={{ textDecoration: "line-through" }}>{restoreEscapes(m[1])}</span> },
  { re: /(?<![*_\w])\*([^*]+)\*(?![*_\w])/, build: (m) => <em key={`it${key}-${k++}`} style={{ fontStyle: "italic" }}>{restoreEscapes(m[1])}</em> },
  { re: /(?<![*_\w])_([^_]+)_(?![*_\w])/, build: (m) => <em key={`it${key}-${k++}`} style={{ fontStyle: "italic" }}>{restoreEscapes(m[1])}</em> },
  { re: /:([a-z0-9_+\-]+):/i, build: (m) => emojiMap[m[1]] ? <span key={`emj${key}-${k++}`} aria-label={m[1]}>{emojiMap[m[1]]}</span> : m[0] },
  { re: /https?:\/\/[^\s<]+/, build: (m) => <a key={`url${key}-${k++}`} href={m[0]} onClick={(e) => e.preventDefault()} style={{ color: "var(--blue)", textDecoration: "underline", textUnderlineOffset: 3 }}>{m[0]}</a> }];

  while (s.length) {
    let best = null;
    for (const t of tokens) {
      const m = s.match(t.re);
      if (m && (best === null || m.index < best.m.index)) best = { t, m };
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
  const allLines = src.replace(/\r\n/g, "\n").split("\n");
  const refs = {};
  const footnotes = {};
  const lines = [];

  for (const line of allLines) {
    let m;
    if (m = line.match(/^\s*\[([^\]^]+)\]:\s+(\S+)(?:\s+["']([^"']+)["'])?\s*$/)) {
      refs[m[1]] = m[2];
      continue;
    }
    if (m = line.match(/^\s*\[\^([^\]]+)\]:\s+(.*)$/)) {
      footnotes[m[1]] = m[2];
      continue;
    }
    lines.push(line);
  }

  const blocks = [];
  let listBuf = null;
  const flushList = () => {
    if (!listBuf) return;
    blocks.push(renderList(listBuf.items, listBuf.kind));
    listBuf = null;
  };

  const addListItem = (kind, item) => {
    if (!listBuf || listBuf.kind !== kind) {flushList();listBuf = { kind, items: [] };}
    listBuf.items.push(item);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*$/.test(line)) {flushList();continue;}

    let m;
    if (m = line.match(/^\s*(```|~~~)\s*([^\s`]*)?.*$/)) {
      flushList();
      const fence = m[1];
      const info = m[2] || "";
      const [langRaw, file] = info.split(":");
      const lang = (langRaw || "").toLowerCase();
      const body = [];
      i += 1;
      while (i < lines.length && !new RegExp(`^\\s*${fence}\\s*$`).test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      const text = body.join("\n");
      if (lang === "math") blocks.push(<MathBlock key={`b${blocks.length}`} text={text} />);
      else if (lang === "mermaid" || lang === "plantuml" || lang === "uml") blocks.push(<DiagramBlock key={`b${blocks.length}`} kind={lang === "uml" ? "plantuml" : lang} text={text} />);
      else blocks.push(<CodeBlock key={`b${blocks.length}`} text={text} lang={lang} file={file} />);
      continue;
    }

    if (/^\s*@startuml\s*$/i.test(line)) {
      flushList();
      const body = [line.trim()];
      i += 1;
      while (i < lines.length && !/^\s*@enduml\s*$/i.test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) body.push(lines[i].trim());
      blocks.push(<DiagramBlock key={`b${blocks.length}`} kind="plantuml" text={body.join("\n")} />);
      continue;
    }

    if (/^\s*\$\$\s*$/.test(line)) {
      flushList();
      const body = [];
      i += 1;
      while (i < lines.length && !/^\s*\$\$\s*$/.test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      blocks.push(<MathBlock key={`b${blocks.length}`} text={body.join("\n")} />);
      continue;
    }

    if (/^\s*:::note\b/.test(line)) {
      flushList();
      const tone = (line.match(/^\s*:::note\s+([a-z]+)/) || [])[1] || "info";
      const body = [];
      i += 1;
      while (i < lines.length && !/^\s*:::\s*$/.test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      blocks.push(<NoteBlock key={`b${blocks.length}`} tone={tone} text={body.join("\n")} />);
      continue;
    }

    if (/^\s*<details>\s*$/i.test(line)) {
      flushList();
      const body = [];
      i += 1;
      while (i < lines.length && !/^\s*<\/details>\s*$/i.test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      const summaryLine = body.find((l) => /<summary>/i.test(l)) || "";
      const title = (summaryLine.match(/<summary>([\s\S]*?)<\/summary>/i) || [])[1] || "詳細";
      const text = body.filter((l) => !/<summary>/i.test(l)).join("\n").trim();
      blocks.push(<details key={`b${blocks.length}`} style={{ border: "1px solid var(--line-2)", padding: "10px 12px", background: "#fff", width: "100%" }} open>
          <summary style={{ fontWeight: 700, cursor: "pointer" }}>{title}</summary>
          <div style={{ marginTop: 10, color: "var(--ink-2)", lineHeight: 1.7 }}>{renderInline(text, i, refs, footnotes)}</div>
        </details>);
      continue;
    }

    if (/^\s*<dl>\s*$/i.test(line)) {
      flushList();
      const body = [];
      i += 1;
      while (i < lines.length && !/^\s*<\/dl>\s*$/i.test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      const term = ((body.join("\n").match(/<dt>([\s\S]*?)<\/dt>/i) || [])[1] || "").trim();
      const desc = ((body.join("\n").match(/<dd>([\s\S]*?)<\/dd>/i) || [])[1] || "").trim();
      blocks.push(<dl key={`b${blocks.length}`} style={{ margin: "6px 0", display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px", fontSize: 15 }}>
          <dt style={{ fontWeight: 700 }}>{term}</dt>
          <dd style={{ margin: 0, color: "var(--ink-2)" }}>{desc}</dd>
        </dl>);
      continue;
    }

    if (/^\s*<table>\s*$/i.test(line)) {
      flushList();
      const body = [];
      i += 1;
      while (i < lines.length && !/^\s*<\/table>\s*$/i.test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      const html = body.join("\n");
      const headers = Array.from(html.matchAll(/<th>([\s\S]*?)<\/th>/gi)).map((x) => x[1].trim());
      const cells = Array.from(html.matchAll(/<td>([\s\S]*?)<\/td>/gi)).map((x) => x[1].trim());
      const rows = [];
      for (let j = 0; j < cells.length; j += Math.max(headers.length, 1)) {
        rows.push(cells.slice(j, j + Math.max(headers.length, 1)));
      }
      blocks.push(<TablePreview key={`b${blocks.length}`} headers={headers.length ? headers : ["項目"]} rows={rows.length ? rows : [[""]]} />);
      continue;
    }

    if (i + 1 < lines.length && /^\s*\|/.test(line) && /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?\s*$/.test(lines[i + 1])) {
      flushList();
      const headers = trimPipes(line);
      const align = trimPipes(lines[i + 1]).map(alignFromCell);
      const rows = [];
      i += 2;
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        rows.push(trimPipes(lines[i]));
        i += 1;
      }
      i -= 1;
      blocks.push(<TablePreview key={`b${blocks.length}`} headers={headers} rows={rows} align={align} />);
      continue;
    }

    if (m = line.match(/^\s*(#{1,6})\s+(.*)$/)) {
      flushList();
      const tag = `h${m[1].length}`;
      const font = { h1: 34, h2: 26, h3: 20, h4: 17, h5: 15, h6: 13.5 }[tag];
      const Tag = tag;
      blocks.push(<Tag key={`b${blocks.length}`} style={{ margin: "8px 0", fontSize: font, fontWeight: m[1].length < 4 ? 800 : 700 }}>{renderInline(m[2], i, refs, footnotes)}</Tag>);
      continue;
    }

    if (/^\s*((-{3,}|\*{3,}|_{3,})|(-\s+-\s+-)|(\*\s+\*\s+\*)|(_\s+_\s+_))\s*$/.test(line)) {
      flushList();
      blocks.push(<hr key={`b${blocks.length}`} style={{ border: "none", borderTop: "1.5px solid var(--ink-2)", margin: "10px 0" }} />);
      continue;
    }

    if (m = line.match(/^\s*(>+)\s?(.*)$/)) {
      flushList();
      const depth = m[1].length;
      blocks.push(<blockquote key={`b${blocks.length}`} style={{
        margin: "6px 0 6px " + (depth - 1) * 16 + "px",
        padding: "6px 16px", borderLeft: "3px solid var(--blue)",
        color: "var(--ink-2)", fontStyle: "italic", fontSize: 16, background: depth > 1 ? "#f6f8fd" : "transparent"
      }}>{renderInline(m[2], i, refs, footnotes)}</blockquote>);
      continue;
    }

    if (m = line.match(/^(\s*)[-*+]\s+\[( |x|X)\]\s+(.*)$/)) {
      addListItem("task", { level: Math.floor(m[1].replace(/\t/g, "  ").length / 2), checked: m[2].toLowerCase() === "x", text: m[3] });
      continue;
    }
    if (m = line.match(/^(\s*)[-*+]\s+(.*)$/)) {
      addListItem("ul", { level: Math.floor(m[1].replace(/\t/g, "  ").length / 2), text: m[2] });
      continue;
    }
    if (m = line.match(/^(\s*)\d+\.\s+(.*)$/)) {
      addListItem("ol", { level: Math.floor(m[1].replace(/\t/g, "  ").length / 2), text: m[2] });
      continue;
    }

    flushList();
    if (/^https?:\/\/\S+\s*$/.test(line.trim())) {
      blocks.push(<LinkCard key={`b${blocks.length}`} url={line.trim()} />);
      continue;
    }
    if (line.endsWith("  ") && i + 1 < lines.length) {
      blocks.push(<p key={`b${blocks.length}`} style={{ margin: "6px 0", fontSize: 16, lineHeight: 1.85 }}>{renderInline(line.trimEnd(), i, refs, footnotes)}<br />{renderInline(lines[i + 1], `${i}-br`, refs, footnotes)}</p>);
      i += 1;
      continue;
    }
    blocks.push(<p key={`b${blocks.length}`} style={{ margin: "6px 0", fontSize: 16, lineHeight: 1.85 }}>{renderInline(line, i, refs, footnotes)}</p>);
  }
  flushList();

  const footnoteIds = Object.keys(footnotes);
  if (footnoteIds.length) {
    blocks.push(
      <div key="footnotes" style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--line-2)", fontSize: 13, color: "var(--ink-3)" }}>
        {footnoteIds.map((id) => <div key={id}><sup className="mono">[{id}]</sup> {footnotes[id]}</div>)}
      </div>
    );
  }

  return blocks;
}


// ============================================================
// StaticRender — also used by the dictionary
// ============================================================
export const StaticRender = ({ r, size = "md" }) => {
  const big = size === "lg";
  const [bigSize, smallSize, weight] = headingSizes[r.tag] || [];
  switch (r.tag) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":return <div style={{ fontSize: big ? bigSize : smallSize, fontWeight: weight, letterSpacing: "-.005em" }}>{r.text}</div>;
    case "bold":return <span style={{ fontSize: big ? 22 : 16, fontWeight: 800 }}>{r.text}</span>;
    case "italic":return <span style={{ fontSize: big ? 22 : 16, fontStyle: "italic" }}>{r.text}</span>;
    case "strike":return <span style={{ fontSize: big ? 22 : 16, textDecoration: "line-through" }}>{r.text}</span>;
    case "underline":return <span style={{ fontSize: big ? 22 : 16, textDecoration: "underline" }}>{r.text}</span>;
    case "color":return <span style={{ fontSize: big ? 22 : 16, color: r.color || "red" }}>{r.text}</span>;
    case "paragraph":return <p style={{ margin: 0, fontSize: big ? 18 : 15, lineHeight: 1.8 }}>{r.text}</p>;
    case "code":return <InlineCode text={r.text} />;
    case "block":return <CodeBlock text={r.text || "block"} lang={r.lang} file={r.file} />;
    case "link":return <a href={r.url || "#"} title={r.title || ""} onClick={(e) => e.preventDefault()} style={{ color: "var(--blue)", textDecoration: "underline", textUnderlineOffset: 3, fontSize: big ? 22 : 16 }}>{r.text}</a>;
    case "linkCard":return <LinkCard url={r.url} />;
    case "image":return <ImgPlaceholder alt={r.alt} title={r.title} w={r.width || 96} />;
    case "ul":return <StaticList kind="ul" items={r.items} big={big} />;
    case "ol":return <StaticList kind="ol" items={r.items} big={big} />;
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
          margin: `0 0 0 ${((r.depth || 1) - 1) * 16}px`,
          padding: "8px 16px", borderLeft: "3px solid var(--blue)",
          color: "var(--ink-2)", fontStyle: "italic", fontSize: big ? 18 : 15,
          background: r.depth > 1 ? "#f6f8fd" : "transparent"
        }}>{r.text}</blockquote>);

    case "hr":return <div style={{ width: "100%", height: 1.5, background: "var(--ink-2)" }} />;
    case "lineBreak":return <p style={{ margin: 0, fontSize: big ? 18 : 15, lineHeight: 1.8 }}>{r.lines[0]}<br />{r.lines[1]}</p>;
    case "table":return <TablePreview headers={r.headers} rows={r.rows} align={r.align} />;
    case "htmlTable":return <TablePreview headers={r.headers} rows={r.rows} />;
    case "footnote":return <div style={{ fontSize: big ? 18 : 15 }}>{r.text}<sup className="mono" style={{ color: "var(--blue)" }}>[1]</sup><div style={{ marginTop: 10, borderTop: "1px solid var(--line-2)", paddingTop: 8, color: "var(--ink-3)", fontSize: 13 }}><sup>[1]</sup> {r.note}</div></div>;
    case "details":return <details open style={{ border: "1px solid var(--line-2)", padding: "10px 12px", background: "#fff", width: "100%" }}><summary style={{ fontWeight: 700 }}>{r.title}</summary><div style={{ marginTop: 10 }}>{r.text}</div></details>;
    case "description":return <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px", fontSize: big ? 17 : 15 }}><dt style={{ fontWeight: 700 }}>{r.term}</dt><dd style={{ margin: 0, color: "var(--ink-2)" }}>{r.desc}</dd></dl>;
    case "note":return <NoteBlock tone={r.tone} text={r.text} />;
    case "mathInline":return <MathBlock text={r.text} inline />;
    case "mathBlock":return <MathBlock text={r.text} />;
    case "diagram":return <DiagramBlock kind={r.kind} text={r.text} />;
    case "emoji":return <span style={{ fontSize: big ? 22 : 16 }}>{r.text} {r.emoji}</span>;
    case "esc":return <span className="mono" style={{ fontSize: 15 }}>{r.text}</span>;
    case "comment":return <span style={{ fontSize: big ? 18 : 15 }}>{r.text}</span>;
    default:return null;
  }
};

const StaticList = ({ items, kind, big }) => {
  const Tag = kind === "ol" ? "ol" : "ul";
  return (
    <Tag style={{ margin: 0, paddingLeft: 22, fontSize: big ? 18 : 15, lineHeight: 1.85 }}>
      {items.map((item, i) =>
      Array.isArray(item) ?
      <li key={i} style={{ listStyle: "none" }}><ul style={{ margin: 0, paddingLeft: 18 }}>{item.map((t, j) => <li key={j}>{t}</li>)}</ul></li> :
      <li key={i}>{item}</li>
      )}
    </Tag>
  );
};
