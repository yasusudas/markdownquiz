// ------------------------ QUESTIONS --------------------------
// Each question: prompt(目標) + targetRender (the Markdown OUTPUT
// the user must reproduce) + check(input) returning true if the
// user's input correctly produces that output.
export const QUESTIONS = [
{
  id: "h1",
  label: "見出し H1",
  prompt: "次の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "h1", text: "はじめに" },
  hint: "行頭に # と半角スペース。",
  check: (s) => /^#\s+はじめに\s*$/.test(s)
},
{
  id: "h2",
  label: "見出し H2",
  prompt: "次の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "h2", text: "目次" },
  hint: "## と半角スペース。",
  check: (s) => /^##\s+目次\s*$/.test(s)
},
{
  id: "h3",
  label: "見出し H3",
  prompt: "次の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "h3", text: "概要" },
  hint: "### と半角スペース。",
  check: (s) => /^###\s+概要\s*$/.test(s)
},
{
  id: "bold",
  label: "太字",
  prompt: "「重要」を太字にしてください。",
  targetRender: { tag: "bold", text: "重要" },
  hint: "アスタリスク2つで囲みます。",
  check: (s) => /^\s*(\*\*重要\*\*|__重要__)\s*$/.test(s)
},
{
  id: "italic",
  label: "イタリック",
  prompt: "「memo」をイタリックにしてください。",
  targetRender: { tag: "italic", text: "memo" },
  hint: "アスタリスク1つ、またはアンダースコア1つで囲みます。",
  check: (s) => /^\s*(\*memo\*|_memo_)\s*$/.test(s)
},
{
  id: "strike",
  label: "取り消し線",
  prompt: "「古い情報」に取り消し線を引いてください。",
  targetRender: { tag: "strike", text: "古い情報" },
  hint: "チルダ2つ ~~ で囲みます。",
  check: (s) => /^\s*~~古い情報~~\s*$/.test(s)
},
{
  id: "code",
  label: "インラインコード",
  prompt: "「npm install」をインラインコードにしてください。",
  targetRender: { tag: "code", text: "npm install" },
  hint: "バッククォート ` で囲みます。",
  check: (s) => /^\s*`npm install`\s*$/.test(s)
},
{
  id: "link",
  label: "リンク",
  prompt: "表示テキスト「Anthropic」、URL「https://anthropic.com」のリンクを書いてください。",
  targetRender: { tag: "link", text: "Anthropic", url: "https://anthropic.com" },
  hint: "[テキスト](URL) の順。",
  check: (s) => /^\s*\[Anthropic\]\(https:\/\/anthropic\.com\/?\)\s*$/.test(s)
},
{
  id: "image",
  label: "画像",
  prompt: "alt「ロゴ」、src「logo.png」の画像を埋め込んでください。",
  targetRender: { tag: "image", alt: "ロゴ", url: "logo.png" },
  hint: "リンクの先頭に ! を付けます。",
  check: (s) => /^\s*!\[ロゴ\]\(logo\.png\)\s*$/.test(s)
},
{
  id: "quote",
  label: "引用",
  prompt: "「明日は晴れ」を引用ブロックにしてください。",
  targetRender: { tag: "quote", text: "明日は晴れ" },
  hint: "行頭に > と半角スペース。",
  check: (s) => /^\s*>\s+明日は晴れ\s*$/.test(s)
},
{
  id: "hr",
  label: "水平線",
  prompt: "水平線（区切り線）を引いてください。",
  targetRender: { tag: "hr" },
  hint: "ハイフン、アスタリスク、アンダースコアいずれかを3つ以上。",
  check: (s) => /^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(s)
},
{
  id: "task-open",
  label: "未完了タスク",
  prompt: "未完了のタスクとして「買い物」を書いてください。",
  targetRender: { tag: "task", items: [["買い物", false]] },
  hint: "- [ ] の後に半角スペース。",
  check: (s) => /^\s*-\s+\[ \]\s+買い物\s*$/.test(s)
},
{
  id: "task-done",
  label: "完了タスク",
  prompt: "完了済みのタスクとして「提出」を書いてください。",
  targetRender: { tag: "task", items: [["提出", true]] },
  hint: "- [x] の後に半角スペース。",
  check: (s) => /^\s*-\s+\[x\]\s+提出\s*$/i.test(s)
},
{
  id: "ul-item",
  label: "リスト項目",
  prompt: "順序なしリストの項目として「りんご」を書いてください。",
  targetRender: { tag: "ul", items: ["りんご"] },
  hint: "-, *, + のいずれかで始めます。",
  check: (s) => /^\s*[-*+]\s+りんご\s*$/.test(s)
},
{
  id: "ol-item",
  label: "番号付きリスト",
  prompt: "順序付きリストの1番目として「最初の手順」を書いてください。",
  targetRender: { tag: "ol", items: ["最初の手順"] },
  hint: "数字 + . + 半角スペース。",
  check: (s) => /^\s*1\.\s+最初の手順\s*$/.test(s)
}];


// ------------------------ DICT (記法事典) --------------------
export const DICT = [
{ cat: "見出し", syntax: "# 見出し1", render: { tag: "h1", text: "見出し1" } },
{ cat: "見出し", syntax: "## 見出し2", render: { tag: "h2", text: "見出し2" } },
{ cat: "見出し", syntax: "### 見出し3", render: { tag: "h3", text: "見出し3" } },
{ cat: "強調", syntax: "**太字**", render: { tag: "bold", text: "太字" } },
{ cat: "強調", syntax: "*イタリック*", render: { tag: "italic", text: "イタリック" } },
{ cat: "強調", syntax: "~~取り消し線~~", render: { tag: "strike", text: "取り消し線" } },
{ cat: "コード", syntax: "`inline code`", render: { tag: "code", text: "inline code" } },
{ cat: "コード", syntax: "```\\nblock\\n```", render: { tag: "block", text: "block" } },
{ cat: "リンク", syntax: "[Anthropic](https://...)", render: { tag: "link", text: "Anthropic", url: "https://..." } },
{ cat: "画像", syntax: "![alt](image.png)", render: { tag: "image", alt: "alt" } },
{ cat: "リスト", syntax: "- 項目A\\n- 項目B", render: { tag: "ul", items: ["項目A", "項目B"] } },
{ cat: "リスト", syntax: "1. 一つ目\\n2. 二つ目", render: { tag: "ol", items: ["一つ目", "二つ目"] } },
{ cat: "リスト", syntax: "- [ ] 未完了\\n- [x] 完了", render: { tag: "task", items: [["未完了", false], ["完了", true]] } },
{ cat: "引用", syntax: "> 引用文です", render: { tag: "quote", text: "引用文です" } },
{ cat: "水平線", syntax: "---", render: { tag: "hr" } },
{ cat: "テーブル", syntax: "| A | B |\\n| - | - |\\n| 1 | 2 |", render: { tag: "table" } },
{ cat: "エスケープ", syntax: "\\\\*not italic\\\\*", render: { tag: "esc", text: "*not italic*" } }];
