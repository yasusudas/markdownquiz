import React from "react";
import { QUESTIONS } from "../data.js";
import { renderMarkdown, StaticRender } from "../markdown.jsx";
import { GridBg, PrimaryBtn, GhostBtn, Arrow } from "../ui.jsx";

// ============================================================
// QUIZ SCREEN — input-based with live preview
// ============================================================
const PICK_COUNT = 8;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const QuizScreen = ({ onHome }) => {
  const [deck, setDeck] = React.useState(() => shuffle(QUESTIONS).slice(0, PICK_COUNT));
  const [idx, setIdx] = React.useState(0);
  const [input, setInput] = React.useState("");
  const [locked, setLocked] = React.useState(false); // when correct, lock further edits
  const [revealed, setRevealed] = React.useState(false); // ギブアップで正解を見たフラグ
  const [score, setScore] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const taRef = React.useRef(null);

  const q = deck[idx];
  const isCorrect = !locked && q && q.check(input);

  // Lock + score when answer is correct
  React.useEffect(() => {
    if (isCorrect && !locked) {
      setLocked(true);
      setScore((s) => s + 1);
    }
  }, [isCorrect, locked]);

  // Focus textarea on each new question
  React.useEffect(() => {
    setInput("");
    setLocked(false);
    setRevealed(false);
    setTimeout(() => {if (taRef.current) taRef.current.focus();}, 30);
  }, [idx]);

  const restart = () => {
    setDeck(shuffle(QUESTIONS).slice(0, PICK_COUNT));
    setIdx(0);setInput("");setLocked(false);setRevealed(false);setScore(0);setDone(false);
  };

  if (done) {
    return <ResultCard score={score} total={deck.length} onRestart={restart} onHome={onHome} />;
  }

  const next = () => {
    if (idx + 1 >= deck.length) {setDone(true);return;}
    setIdx(idx + 1);
  };

  const giveUp = () => {
    setRevealed(true);
    setLocked(true);
    setInput(sampleAnswer(q));
  };

  return (
    <div style={{ position: "relative", minHeight: "calc(100vh - 81px)" }} data-screen-label="02 Quiz">
      <GridBg />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px 80px", position: "relative" }}>
        <ProgressStrip total={deck.length} idx={idx} solved={locked && !revealed} />

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginTop: 28, marginBottom: 28
        }}>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: ".28em", color: "var(--ink-3)" }}>
              QUESTION {String(idx + 1).padStart(2, "0")} / {String(deck.length).padStart(2, "0")}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
              <CatTag>{q.label}</CatTag>
            </div>
          </div>
          <ScoreDisplay score={score} total={deck.length} />
        </div>

        <div style={{
          background: "#fff", border: "1px solid var(--line)",
          boxShadow: "10px 10px 0 0 var(--ink)",
          padding: "36px 40px 36px",
          position: "relative"
        }}>
          <div style={{
            position: "absolute", top: -1, left: -1, width: 8, height: 42, background: "var(--blue)"
          }} />

          {/* Question prompt */}
          <h2 style={{
            fontSize: 22, fontWeight: 700, lineHeight: 1.55, letterSpacing: ".005em",
            margin: "0 0 26px", textWrap: "pretty"
          }}>
            {q.prompt}
          </h2>

          {/* Target render — what the user must reproduce */}
          <TargetCard r={q.targetRender} />

          {/* Input + Preview */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginTop: 28, border: "1px solid var(--line-2)" }}>
            {/* Input pane */}
            <div style={{ borderRight: "1px solid var(--line-2)", display: "flex", flexDirection: "column", height: "220px" }}>
              <PaneHeader label="INPUT — Markdownを入力">
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".18em" }}>
                  {locked ? revealed ? "REVEALED" : "MATCHED" : "TYPING…"}
                </span>
              </PaneHeader>
              <textarea
                ref={taRef}
                className="mono"
                spellCheck={false}
                value={input}
                onChange={(e) => {if (!locked) setInput(e.target.value);}}
                placeholder="ここにMarkdownを入力…"
                style={{
                  height: 220, resize: "none",
                  border: "none", outline: "none",
                  padding: "18px 20px",
                  fontSize: 16, lineHeight: 1.7,
                  background: locked ? revealed ? "#fff" : "#eaf6ef" : "#fff",
                  color: "var(--ink)",
                  caretColor: "var(--blue)",
                  fontFamily: "inherit", display: "block", width: "100%", boxSizing: "border-box"
                }} />

            </div>
            {/* Preview pane */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <PaneHeader label="PREVIEW — レンダリング結果">
                {locked ?
                <Badge tone={revealed ? "warn" : "good"}>{revealed ? "見本表示" : "正解！"}</Badge> :
                input ?
                <Badge tone="dim">未一致</Badge> :

                <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".18em" }}>EMPTY</span>
                }
              </PaneHeader>
              <div style={{
                height: 220, padding: "18px 22px",
                background: locked ? "#fbfdff" : "#fbfcfe",
                overflow: "auto", boxSizing: "border-box"
              }}>
                {input ? renderMarkdown(input) :
                <div className="mono" style={{ fontSize: 13, color: "var(--ink-3)", opacity: .7 }}>
                    入力すると、ここにライブプレビューが出ます。
                  </div>
                }
              </div>
            </div>
          </div>

          {/* Reveal / Next */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: 24, gap: 16
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {locked && revealed &&
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".18em" }}>
                  この問題はスコアに加算されません
                </span>
              }
            </div>
            <PrimaryBtn onClick={locked ? next : giveUp}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
                {locked ?
                idx + 1 >= deck.length ? "結果を見る" : "次の問題" :
                "答えを見る"}
                <Arrow />
              </span>
            </PrimaryBtn>
          </div>
        </div>
      </div>
    </div>);

};

const PaneHeader = ({ label, children }) =>
<div style={{
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "9px 16px", background: "#f4f6fb", borderBottom: "1px solid var(--line-2)", height: "33.4375px"
}}>
    <span className="mono" style={{ fontSize: 11, letterSpacing: ".18em", color: "var(--ink-3)" }}>{label}</span>
    {children}
  </div>;


const Badge = ({ tone, children }) => {
  const map = {
    good: { bg: "var(--good)", fg: "#fff", bd: "var(--good)" },
    warn: { bg: "#f6c25f", fg: "#3a2900", bd: "#e0a426" },
    dim: { bg: "#fff", fg: "var(--ink-3)", bd: "var(--line-2)" }
  };
  const c = map[tone] || map.dim;
  return (
    <span className="mono" style={{
      fontSize: 11, letterSpacing: ".16em", padding: "3px 8px",
      background: c.bg, color: c.fg, border: `1px solid ${c.bd}`
    }}>{children}</span>);

};

const TargetCard = ({ r }) =>
<div style={{
  border: "1px solid var(--line-2)", background: "#fafbfe",
  padding: "22px 28px", display: "flex", alignItems: "center", gap: 24,
  minHeight: 108, position: "relative"
}}>
    <div className="mono" style={{
    position: "absolute", top: -9, left: 18,
    fontSize: 10, letterSpacing: ".22em", color: "var(--ink-3)",
    background: "#fff", padding: "2px 8px", border: "1px solid var(--line-2)"
  }}>
      TARGET
    </div>
    <div style={{ flex: 1 }}>
      <StaticRender r={r} size="lg" />
    </div>
  </div>;


const ProgressStrip = ({ total, idx, solved }) =>
<div style={{ display: "flex", gap: 6 }}>
    {Array.from({ length: total }).map((_, i) => {
    const past = i < idx;
    const cur = i === idx;
    const fill = past ? "var(--ink)" : cur ? solved ? "var(--good)" : "var(--blue)" : "var(--line)";
    return (
      <div key={i} style={{ flex: 1, height: 6, background: fill, transition: "background .2s" }} />);

  })}
  </div>;


const CatTag = ({ children }) =>
<span className="mono" style={{
  fontSize: 11, letterSpacing: ".18em", color: "var(--blue-ink)",
  padding: "5px 10px", background: "var(--blue-soft)", border: "1px solid #c8d4ff"
}}>#{children}</span>;


const ScoreDisplay = ({ score, total }) =>
<div style={{ textAlign: "right" }}>
    <div className="mono" style={{ fontSize: 10, letterSpacing: ".24em", color: "var(--ink-3)" }}>SCORE</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 2 }}>
      <span className="mono" style={{ fontSize: 28, fontWeight: 600, color: "var(--ink)" }}>{String(score).padStart(2, "0")}</span>
      <span className="mono" style={{ fontSize: 14, color: "var(--ink-3)" }}>/ {String(total).padStart(2, "0")}</span>
    </div>
  </div>;


// Provide an example answer when user gives up
function sampleAnswer(q) {
  switch (q.id) {
    case "h1":return "# はじめに";
    case "h2":return "## 目次";
    case "h3":return "### 概要";
    case "bold":return "**重要**";
    case "italic":return "*memo*";
    case "strike":return "~~古い情報~~";
    case "code":return "`npm install`";
    case "link":return "[Anthropic](https://anthropic.com)";
    case "image":return "![ロゴ](logo.png)";
    case "quote":return "> 明日は晴れ";
    case "hr":return "---";
    case "task-open":return "- [ ] 買い物";
    case "task-done":return "- [x] 提出";
    case "ul-item":return "- りんご";
    case "ol-item":return "1. 最初の手順";
    default:return "";
  }
}

const ResultCard = ({ score, total, onRestart, onHome }) => {
  const pct = Math.round(score / total * 100);
  const rank =
  pct === 100 ? { label: "PERFECT", note: "完璧です。Markdown博士の称号を授けます。" } :
  pct >= 80 ? { label: "EXCELLENT", note: "とても良い理解度です。実務で困らないレベル。" } :
  pct >= 60 ? { label: "GOOD", note: "基礎はしっかり。あと少しで上級者。" } :
  pct >= 40 ? { label: "FAIR", note: "もう一度プレイして基本記法を復習しましょう。" } :
  { label: "TRY AGAIN", note: "記法事典で確認してから再挑戦しましょう。" };
  return (
    <div style={{ position: "relative", minHeight: "calc(100vh - 81px)" }} data-screen-label="03 Result">
      <GridBg />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "96px 40px" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: ".3em", color: "var(--ink-3)", marginBottom: 18, textAlign: "center" }}>
          QUIZ COMPLETE
        </div>
        <div style={{
          background: "#fff", border: "1px solid var(--line)",
          boxShadow: "12px 12px 0 0 var(--blue)",
          padding: "56px 56px 48px", textAlign: "center"
        }}>
          <div className="mono" style={{
            fontSize: 11, letterSpacing: ".24em", color: "var(--blue)",
            padding: "5px 12px", border: "1.5px solid var(--blue)", display: "inline-block"
          }}>{rank.label}</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 8, margin: "28px 0 6px" }}>
            <span className="mono" style={{ fontSize: 120, fontWeight: 700, lineHeight: 1, letterSpacing: "-.04em" }}>
              {String(score).padStart(2, "0")}
            </span>
            <span className="mono" style={{ fontSize: 36, color: "var(--ink-3)" }}>/ {String(total).padStart(2, "0")}</span>
          </div>
          <div className="mono" style={{ fontSize: 13, color: "var(--ink-3)", letterSpacing: ".18em" }}>{pct}% CORRECT</div>
          <p style={{ marginTop: 30, fontSize: 15, lineHeight: 1.9, color: "var(--ink-2)" }}>{rank.note}</p>
        </div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 36 }}>
          <PrimaryBtn onClick={onRestart}>もう一度</PrimaryBtn>
          <GhostBtn onClick={onHome}>ホームへ戻る</GhostBtn>
        </div>
      </div>
    </div>);

};
