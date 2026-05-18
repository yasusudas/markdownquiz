// ------------------------ QUESTIONS --------------------------
// Each question: prompt(目標) + targetRender (the Markdown OUTPUT
// the user must reproduce) + answer + check(input).
const lines = (s) => s.replace(/\r\n/g, "\n").trim();

export const QUESTIONS = [
{
  id: "h1",
  label: "見出し H1",
  prompt: "見出し1の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "h1", text: "はじめに" },
  hint: "行頭に # と半角スペース。",
  answer: "# はじめに",
  check: (s) => /^#\s+はじめに\s*$/.test(s)
},
{
  id: "h2",
  label: "見出し H2",
  prompt: "見出し2の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "h2", text: "目次" },
  hint: "## と半角スペース。",
  answer: "## 目次",
  check: (s) => /^##\s+目次\s*$/.test(s)
},
{
  id: "h3",
  label: "見出し H3",
  prompt: "見出し3の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "h3", text: "概要" },
  hint: "### と半角スペース。",
  answer: "### 概要",
  check: (s) => /^###\s+概要\s*$/.test(s)
},
{
  id: "h4",
  label: "見出し H4",
  prompt: "見出し4の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "h4", text: "詳細" },
  hint: "#### と半角スペース。",
  answer: "#### 詳細",
  check: (s) => /^####\s+詳細\s*$/.test(s)
},
{
  id: "h5",
  label: "見出し H5",
  prompt: "見出し5の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "h5", text: "補足" },
  hint: "##### と半角スペース。",
  answer: "##### 補足",
  check: (s) => /^#####\s+補足\s*$/.test(s)
},
{
  id: "h6",
  label: "見出し H6",
  prompt: "見出し6の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "h6", text: "メモ" },
  hint: "###### と半角スペース。",
  answer: "###### メモ",
  check: (s) => /^######\s+メモ\s*$/.test(s)
},
{
  id: "paragraph",
  label: "段落",
  prompt: "段落の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "paragraph", text: "これは段落です。" },
  hint: "通常の文章をそのまま書くと段落になります。",
  answer: "これは段落です。",
  check: (s) => /^\s*これは段落です。\s*$/.test(s)
},
{
  id: "bold",
  label: "太字",
  prompt: "太字の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "bold", text: "重要" },
  hint: "アスタリスク2つ、またはアンダースコア2つで囲みます。",
  answer: "**重要**",
  check: (s) => /^\s*(\*\*重要\*\*|__重要__)\s*$/.test(s)
},
{
  id: "italic",
  label: "イタリック",
  prompt: "イタリックの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "italic", text: "memo" },
  hint: "アスタリスク1つ、またはアンダースコア1つで囲みます。",
  answer: "*memo*",
  check: (s) => /^\s*(\*memo\*|_memo_)\s*$/.test(s)
},
{
  id: "strike",
  label: "取り消し線",
  prompt: "取り消し線の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "strike", text: "古い情報" },
  hint: "チルダ2つ ~~ で囲みます。",
  answer: "~~古い情報~~",
  check: (s) => /^\s*~~古い情報~~\s*$/.test(s)
},
{
  id: "underline",
  label: "下線",
  prompt: "下線の表示になるよう、HTMLタグを使って書いてください。",
  targetRender: { tag: "underline", text: "下線" },
  hint: "<u> と </u> で囲みます。",
  answer: "<u>下線</u>",
  check: (s) => /^\s*<u>下線<\/u>\s*$/i.test(s)
},
{
  id: "code",
  label: "インラインコード",
  prompt: "インラインコードの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "code", text: "npm install" },
  hint: "バッククォート ` で囲みます。",
  answer: "`npm install`",
  check: (s) => /^\s*`npm install`\s*$/.test(s)
},
{
  id: "code-color",
  label: "カラーコード",
  prompt: "CSSカラーのコードスパン表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "code", text: "#ffce44" },
  hint: "色コードをバッククォートで囲みます。",
  answer: "`#ffce44`",
  check: (s) => /^\s*`#ffce44`\s*$/.test(s)
},
{
  id: "code-backtick",
  label: "バッククォート入りコード",
  prompt: "バッククォートを含むコードスパンの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "code", text: "`code`" },
  hint: "中身に ` を含む場合は、外側を2個以上のバッククォートで囲みます。",
  answer: "`` `code` ``",
  check: (s) => /^\s*``\s*`code`\s*``\s*$/.test(s)
},
{
  id: "code-block",
  label: "コードブロック",
  prompt: "複数行コードブロックの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "block", text: "console.log(\"Hello\");", lang: "js" },
  hint: "バッククォート3つで上下を囲みます。言語名も指定できます。",
  answer: "```js\nconsole.log(\"Hello\");\n```",
  check: (s) => /^\s*```(?:js|javascript)?\s*\nconsole\.log\("Hello"\);\s*\n```\s*$/.test(s)
},
{
  id: "code-file",
  label: "ファイル名付きコード",
  prompt: "ファイル名付きコードブロックの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "block", text: "console.log(\"Hi\");", lang: "js", file: "app.js" },
  hint: "言語名の後ろに :ファイル名 を付けます。",
  answer: "```js:app.js\nconsole.log(\"Hi\");\n```",
  check: (s) => /^\s*```(?:js|javascript):app\.js\s*\nconsole\.log\("Hi"\);\s*\n```\s*$/.test(s)
},
{
  id: "diff-code",
  label: "Diffコード",
  prompt: "差分表示のコードブロックになるよう、Markdownを書いてください。",
  targetRender: { tag: "block", text: "- old\n+ new", lang: "diff" },
  hint: "言語名に diff を指定し、削除行は -、追加行は + で始めます。",
  answer: "```diff\n- old\n+ new\n```",
  check: (s) => /^\s*```diff\s*\n-\s*old\s*\n\+\s*new\s*\n```\s*$/.test(s)
},
{
  id: "tilde-block",
  label: "チルダコード",
  prompt: "チルダを使ったコードブロックの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "block", text: "block", lang: "" },
  hint: "チルダ3つでもコードブロックを作れます。",
  answer: "~~~\nblock\n~~~",
  check: (s) => /^\s*~~~\s*\nblock\s*\n~~~\s*$/.test(s)
},
{
  id: "link",
  label: "リンク",
  prompt: "通常リンクの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "link", text: "Anthropic", url: "https://anthropic.com" },
  hint: "[テキスト](URL) の順。",
  answer: "[Anthropic](https://anthropic.com)",
  check: (s) => /^\s*\[Anthropic\]\(https:\/\/anthropic\.com\/?\)\s*$/.test(s)
},
{
  id: "link-title",
  label: "タイトル付きリンク",
  prompt: "タイトル付きリンクの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "link", text: "Qiita", url: "https://qiita.com", title: "Qiita Home" },
  hint: "URL の後ろに半角スペースと引用符付きタイトルを書きます。",
  answer: "[Qiita](https://qiita.com \"Qiita Home\")",
  check: (s) => /^\s*\[Qiita\]\(https:\/\/qiita\.com\/?\s+"Qiita Home"\)\s*$/.test(s)
},
{
  id: "reference-link",
  label: "参照リンク",
  prompt: "参照リンクの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "link", text: "公式", url: "https://example.com" },
  hint: "本文側は [テキスト][id]、別行で [id]: URL を定義します。",
  answer: "[公式][site]\n\n[site]: https://example.com",
  check: (s) => /^\s*\[公式\]\[site\]\s*\n\s*\n?\[site\]:\s*https:\/\/example\.com\/?\s*$/i.test(s)
},
{
  id: "autolink",
  label: "URLリンクカード",
  prompt: "URLだけのリンク表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "linkCard", url: "https://example.com" },
  hint: "URLだけを単独行で書きます。",
  answer: "https://example.com",
  check: (s) => /^\s*https:\/\/example\.com\/?\s*$/.test(s)
},
{
  id: "image",
  label: "画像",
  prompt: "画像の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "image", alt: "ロゴ", url: "logo.png" },
  hint: "リンクの先頭に ! を付けます。",
  answer: "![ロゴ](logo.png)",
  check: (s) => /^\s*!\[ロゴ\]\(logo\.png\)\s*$/.test(s)
},
{
  id: "image-title",
  label: "タイトル付き画像",
  prompt: "タイトル付き画像の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "image", alt: "ロゴ", title: "Logo" },
  hint: "URL の後ろに半角スペースと引用符付きタイトルを書きます。",
  answer: "![ロゴ](logo.png \"Logo\")",
  check: (s) => /^\s*!\[ロゴ\]\(logo\.png\s+"Logo"\)\s*$/.test(s)
},
{
  id: "image-size",
  label: "サイズ指定画像",
  prompt: "サイズ指定画像の表示になるよう、HTMLタグで書いてください。",
  targetRender: { tag: "image", alt: "ロゴ", width: 120 },
  hint: "<img width=\"数値\" alt=\"...\" src=\"...\"> を使います。",
  answer: "<img width=\"120\" alt=\"ロゴ\" src=\"logo.png\">",
  check: (s) => /^\s*<img\s+width=["']120["']\s+alt=["']ロゴ["']\s+src=["']logo\.png["']\s*\/?>\s*$/i.test(s)
},
{
  id: "quote",
  label: "引用",
  prompt: "引用ブロックの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "quote", text: "明日は晴れ" },
  hint: "行頭に > と半角スペース。",
  answer: "> 明日は晴れ",
  check: (s) => /^\s*>\s+明日は晴れ\s*$/.test(s)
},
{
  id: "nested-quote",
  label: "多重引用",
  prompt: "二重引用の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "quote", text: "深い引用", depth: 2 },
  hint: "行頭に > を2つ書きます。",
  answer: ">> 深い引用",
  check: (s) => /^\s*>>\s+深い引用\s*$/.test(s)
},
{
  id: "hr",
  label: "水平線",
  prompt: "水平線（区切り線）の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "hr" },
  hint: "ハイフン、アスタリスク、アンダースコアいずれかを3つ以上。",
  answer: "---",
  check: (s) => /^\s*((-{3,}|\*{3,}|_{3,})|(-\s+-\s+-)|(\*\s+\*\s+\*)|(_\s+_\s+_))\s*$/.test(s)
},
{
  id: "task-open",
  label: "未完了タスク",
  prompt: "未完了タスクの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "task", items: [["買い物", false]] },
  hint: "- [ ] の後に半角スペース。",
  answer: "- [ ] 買い物",
  check: (s) => /^\s*-\s+\[ \]\s+買い物\s*$/.test(s)
},
{
  id: "task-done",
  label: "完了タスク",
  prompt: "完了タスクの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "task", items: [["提出", true]] },
  hint: "- [x] の後に半角スペース。",
  answer: "- [x] 提出",
  check: (s) => /^\s*-\s+\[x\]\s+提出\s*$/i.test(s)
},
{
  id: "ul-item",
  label: "箇条書きリスト",
  prompt: "順序なしリストの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "ul", items: ["りんご"] },
  hint: "-, *, + のいずれかで始めます。",
  answer: "- りんご",
  check: (s) => /^\s*[-*+]\s+りんご\s*$/.test(s)
},
{
  id: "nested-ul",
  label: "ネストリスト",
  prompt: "インデント付きリストの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "ul", items: ["親", ["子"]] },
  hint: "子項目は半角スペース2つ以上、またはタブで字下げします。",
  answer: "- 親\n  - 子",
  check: (s) => /^\s*[-*+]\s+親\s*\n(?: {2,}|\t)[-*+]\s+子\s*$/.test(s)
},
{
  id: "ol-item",
  label: "番号付きリスト",
  prompt: "番号付きリストの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "ol", items: ["最初の手順"] },
  hint: "数字 + . + 半角スペース。",
  answer: "1. 最初の手順",
  check: (s) => /^\s*1\.\s+最初の手順\s*$/.test(s)
},
{
  id: "line-break",
  label: "改行",
  prompt: "段落内改行の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "lineBreak", lines: ["1行目", "2行目"] },
  hint: "行末に半角スペース2つ、または <br> を使います。",
  answer: "1行目  \n2行目",
  check: (s) => /^\s*1行目 {2}\n2行目\s*$/.test(s) || /^\s*1行目\s*<br\s*\/?>\s*\n?2行目\s*$/i.test(s)
},
{
  id: "table",
  label: "テーブル",
  prompt: "テーブルの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "table", headers: ["名前", "役割"], rows: [["太郎", "管理者"]] },
  hint: "見出し行、区切り行、データ行を書きます。",
  answer: "| 名前 | 役割 |\n| ---- | ---- |\n| 太郎 | 管理者 |",
  check: (s) => /^\s*\|\s*名前\s*\|\s*役割\s*\|\s*\n\|\s*:?-{3,}:?\s*\|\s*:?-{3,}:?\s*\|\s*\n\|\s*太郎\s*\|\s*管理者\s*\|\s*$/.test(s)
},
{
  id: "table-align",
  label: "配置付きテーブル",
  prompt: "中央寄せを含むテーブルの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "table", headers: ["左", "中央", "右"], rows: [["A", "B", "C"]], align: ["left", "center", "right"] },
  hint: ":---, :---:, ---: で列の揃えを指定します。",
  answer: "| 左 | 中央 | 右 |\n| :--- | :---: | ---: |\n| A | B | C |",
  check: (s) => /^\s*\|\s*左\s*\|\s*中央\s*\|\s*右\s*\|\s*\n\|\s*:?-{1,}\s*\|\s*:?-{1,}:\s*\|\s*-{1,}:\s*\|\s*\n\|\s*A\s*\|\s*B\s*\|\s*C\s*\|\s*$/.test(s)
},
{
  id: "html-table",
  label: "HTMLテーブル",
  prompt: "HTMLテーブルの表示になるよう、HTMLタグを書いてください。",
  targetRender: { tag: "htmlTable", headers: ["名前", "説明"], rows: [["table", "テーブル"]] },
  hint: "<table> の中に <th> と <td> を書きます。",
  answer: "<table>\n<tr><th>名前</th><th>説明</th></tr>\n<tr><td>table</td><td>テーブル</td></tr>\n</table>",
  check: (s) => /^\s*<table>\s*\n<tr><th>名前<\/th><th>説明<\/th><\/tr>\s*\n<tr><td>table<\/td><td>テーブル<\/td><\/tr>\s*\n<\/table>\s*$/i.test(s)
},
{
  id: "footnote",
  label: "脚注",
  prompt: "脚注付きテキストの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "footnote", text: "本文", note: "注釈" },
  hint: "文中に [^1]、別行に [^1]: 注釈を書きます。",
  answer: "本文[^1]\n\n[^1]: 注釈",
  check: (s) => /^\s*本文\[\^1\]\s*\n\s*\n?\[\^1\]:\s+注釈\s*$/.test(s)
},
{
  id: "color",
  label: "文字色",
  prompt: "赤文字の表示になるよう、HTMLタグを使って書いてください。",
  targetRender: { tag: "color", text: "赤文字", color: "red" },
  hint: "<span style=\"color: red;\">...</span> または <font color=\"red\">...</font> を使います。",
  answer: "<span style=\"color: red;\">赤文字</span>",
  check: (s) => /^\s*(<span\s+style=["'][^"']*color:\s*red;?[^"']*["']>赤文字<\/span>|<span\s+style=[^>\s]*color:\s*red;?>赤文字<\/span>|<font\s+color=["']red["']>赤文字<\/font>)\s*$/i.test(s)
},
{
  id: "details",
  label: "折りたたみ",
  prompt: "折りたたみ表示になるよう、HTMLタグを書いてください。",
  targetRender: { tag: "details", title: "タイトル", text: "内容" },
  hint: "<details> と <summary> を使います。",
  answer: "<details>\n<summary>タイトル</summary>\n\n内容\n</details>",
  check: (s) => /^\s*<details>\s*\n<summary>タイトル<\/summary>\s*\n\s*\n?内容\s*\n<\/details>\s*$/i.test(s)
},
{
  id: "note",
  label: "注記ブロック",
  prompt: "注意の注記ブロック表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "note", tone: "warn", text: "注意してください" },
  hint: ":::note warn で始め、::: で閉じます。",
  answer: ":::note warn\n注意してください\n:::",
  check: (s) => /^\s*:::note\s+warn\s*\n注意してください\s*\n:::\s*$/.test(s)
},
{
  id: "math-inline",
  label: "インライン数式",
  prompt: "インライン数式の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "mathInline", text: "E = mc^2" },
  hint: "$...$ で囲みます。",
  answer: "$E = mc^2$",
  check: (s) => /^\s*(\$E = mc\^2\$|\$`E = mc\^2`\$)\s*$/.test(s)
},
{
  id: "math-block",
  label: "数式ブロック",
  prompt: "数式ブロックの表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "mathBlock", text: "x^2 + y^2 = 1" },
  hint: "$$ で上下を囲むか、math のコードブロックを使います。",
  answer: "$$\nx^2 + y^2 = 1\n$$",
  check: (s) => /^\s*\$\$\s*\nx\^2 \+ y\^2 = 1\s*\n\$\$\s*$/.test(s) || /^\s*```math\s*\nx\^2 \+ y\^2 = 1\s*\n```\s*$/.test(s)
},
{
  id: "mermaid",
  label: "Mermaid",
  prompt: "Mermaid図の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "diagram", kind: "mermaid", text: "graph TD\nA --> B" },
  hint: "mermaid を指定したコードブロックを書きます。",
  answer: "```mermaid\ngraph TD\nA --> B\n```",
  check: (s) => /^\s*```mermaid\s*\ngraph TD\s*\nA\s*-->\s*B\s*\n```\s*$/.test(s)
},
{
  id: "plantuml",
  label: "PlantUML",
  prompt: "PlantUML図の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "diagram", kind: "plantuml", text: "Alice -> Bob: Hello" },
  hint: "plantuml または uml を指定したコードブロックを書きます。",
  answer: "```plantuml\nAlice -> Bob: Hello\n```",
  check: (s) => /^\s*```(?:plantuml|uml)\s*\nAlice\s*->\s*Bob:\s*Hello\s*\n```\s*$/.test(s)
},
{
  id: "plantuml-raw",
  label: "PlantUML生記法",
  prompt: "PlantUMLの生記法表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "diagram", kind: "plantuml", text: "@startuml\nAlice -> Bob: Hello\n@enduml" },
  hint: "@startuml と @enduml で囲みます。",
  answer: "@startuml\nAlice -> Bob: Hello\n@enduml",
  check: (s) => /^\s*@startuml\s*\nAlice\s*->\s*Bob:\s*Hello\s*\n@enduml\s*$/i.test(s)
},
{
  id: "emoji",
  label: "絵文字",
  prompt: "絵文字の表示になるよう、Markdownを書いてください。",
  targetRender: { tag: "emoji", text: "いいね", emoji: "👍" },
  hint: ":smile: や :+1: のようにコロンで囲みます。",
  answer: "いいね :+1:",
  check: (s) => /^\s*いいね\s+(:\+1:|:thumbsup:)\s*$/.test(s)
},
{
  id: "escape",
  label: "エスケープ",
  prompt: "Markdown記号を無効化して表示されるよう、バックスラッシュで書いてください。",
  targetRender: { tag: "esc", text: "*not italic*" },
  hint: "記号の前にバックスラッシュを書きます。",
  answer: "\\*not italic\\*",
  check: (s) => /^\s*\\\*not italic\\\*\s*$/.test(s)
},
{
  id: "comment",
  label: "コメントアウト",
  prompt: "一部のテキストを非表示にするコメントアウトを書いてください。",
  targetRender: { tag: "comment", text: "見える文章" },
  hint: "<!-- と --> で囲んだ部分は表示されません。",
  answer: "見える<!--隠す-->文章",
  check: (s) => /^\s*見える<!--隠す-->文章\s*$/.test(s)
},
{
  id: "description-list",
  label: "説明リスト",
  prompt: "説明リストの表示になるよう、HTMLタグを書いてください。",
  targetRender: { tag: "description", term: "リンゴ", desc: "赤いフルーツ" },
  hint: "<dl> の中に <dt> と <dd> を書きます。",
  answer: "<dl>\n<dt>リンゴ</dt>\n<dd>赤いフルーツ</dd>\n</dl>",
  check: (s) => /^\s*<dl>\s*\n<dt>リンゴ<\/dt>\s*\n<dd>赤いフルーツ<\/dd>\s*\n<\/dl>\s*$/i.test(s)
}];


// ------------------------ DICT (記法事典) --------------------
export const DICT = [
{ cat: "見出し", syntax: "# 見出し1", render: { tag: "h1", text: "見出し1" } },
{ cat: "見出し", syntax: "## 見出し2", render: { tag: "h2", text: "見出し2" } },
{ cat: "見出し", syntax: "### 見出し3", render: { tag: "h3", text: "見出し3" } },
{ cat: "見出し", syntax: "#### 見出し4", render: { tag: "h4", text: "見出し4" } },
{ cat: "見出し", syntax: "##### 見出し5", render: { tag: "h5", text: "見出し5" } },
{ cat: "見出し", syntax: "###### 見出し6", render: { tag: "h6", text: "見出し6" } },
{ cat: "段落", syntax: "通常の文章です。", render: { tag: "paragraph", text: "通常の文章です。" } },
{ cat: "強調", syntax: "**太字**", render: { tag: "bold", text: "太字" } },
{ cat: "強調", syntax: "*イタリック*", render: { tag: "italic", text: "イタリック" } },
{ cat: "強調", syntax: "~~取り消し線~~", render: { tag: "strike", text: "取り消し線" } },
{ cat: "強調", syntax: "<u>下線</u>", render: { tag: "underline", text: "下線" } },
{ cat: "コード", syntax: "`inline code`", render: { tag: "code", text: "inline code" } },
{ cat: "コード", syntax: "`#ffce44`", render: { tag: "code", text: "#ffce44" } },
{ cat: "コード", syntax: "`` `backtick` ``", render: { tag: "code", text: "`backtick`" } },
{ cat: "コード", syntax: "```js\\nconsole.log('Hi');\\n```", render: { tag: "block", text: "console.log('Hi');", lang: "js" } },
{ cat: "コード", syntax: "```js:app.js\\nconsole.log('Hi');\\n```", render: { tag: "block", text: "console.log('Hi');", lang: "js", file: "app.js" } },
{ cat: "コード", syntax: "```diff\\n- old\\n+ new\\n```", render: { tag: "block", text: "- old\n+ new", lang: "diff" } },
{ cat: "コード", syntax: "~~~\\nblock\\n~~~", render: { tag: "block", text: "block" } },
{ cat: "リンク", syntax: "[テキスト](https://example.com)", render: { tag: "link", text: "テキスト", url: "https://example.com" } },
{ cat: "リンク", syntax: "[Qiita](https://qiita.com \"Qiita Home\")", render: { tag: "link", text: "Qiita", url: "https://qiita.com", title: "Qiita Home" } },
{ cat: "リンク", syntax: "[公式][site]\\n\\n[site]: https://example.com", render: { tag: "link", text: "公式", url: "https://example.com" } },
{ cat: "リンク", syntax: "https://example.com", render: { tag: "linkCard", url: "https://example.com" } },
{ cat: "画像", syntax: "![alt](image.png)", render: { tag: "image", alt: "alt" } },
{ cat: "画像", syntax: "![alt](image.png \"title\")", render: { tag: "image", alt: "alt", title: "title" } },
{ cat: "画像", syntax: "<img width=\"120\" alt=\"alt\" src=\"image.png\">", render: { tag: "image", alt: "alt", width: 120 } },
{ cat: "リスト", syntax: "- 項目A\\n- 項目B", render: { tag: "ul", items: ["項目A", "項目B"] } },
{ cat: "リスト", syntax: "- 親\\n  - 子", render: { tag: "ul", items: ["親", ["子"]] } },
{ cat: "リスト", syntax: "1. 一つ目\\n1. 二つ目", render: { tag: "ol", items: ["一つ目", "二つ目"] } },
{ cat: "リスト", syntax: "- [ ] 未完了\\n- [x] 完了", render: { tag: "task", items: [["未完了", false], ["完了", true]] } },
{ cat: "引用", syntax: "> 引用文です", render: { tag: "quote", text: "引用文です" } },
{ cat: "引用", syntax: ">> 二重引用です", render: { tag: "quote", text: "二重引用です", depth: 2 } },
{ cat: "水平線", syntax: "---", render: { tag: "hr" } },
{ cat: "改行", syntax: "1行目  \\n2行目", render: { tag: "lineBreak", lines: ["1行目", "2行目"] } },
{ cat: "テーブル", syntax: "| A | B |\\n| - | - |\\n| 1 | 2 |", render: { tag: "table", headers: ["A", "B"], rows: [["1", "2"]] } },
{ cat: "テーブル", syntax: "| 左 | 中央 | 右 |\\n| :-- | :-: | --: |\\n| A | B | C |", render: { tag: "table", headers: ["左", "中央", "右"], rows: [["A", "B", "C"]], align: ["left", "center", "right"] } },
{ cat: "テーブル", syntax: "<table>\\n<tr><th>名前</th><th>説明</th></tr>\\n<tr><td>table</td><td>テーブル</td></tr>\\n</table>", render: { tag: "htmlTable", headers: ["名前", "説明"], rows: [["table", "テーブル"]] } },
{ cat: "脚注", syntax: "本文[^1]\\n\\n[^1]: 注釈", render: { tag: "footnote", text: "本文", note: "注釈" } },
{ cat: "HTML", syntax: "<span style=\"color: red;\">赤文字</span>", render: { tag: "color", text: "赤文字", color: "red" } },
{ cat: "HTML", syntax: "<div style=\"color:red;\">赤文字</div>", render: { tag: "color", text: "赤文字", color: "red" } },
{ cat: "HTML", syntax: "<details>\\n<summary>タイトル</summary>\\n\\n内容\\n</details>", render: { tag: "details", title: "タイトル", text: "内容" } },
{ cat: "HTML", syntax: "<dl>\\n<dt>リンゴ</dt>\\n<dd>赤いフルーツ</dd>\\n</dl>", render: { tag: "description", term: "リンゴ", desc: "赤いフルーツ" } },
{ cat: "注記", syntax: ":::note warn\\n注意してください\\n:::", render: { tag: "note", tone: "warn", text: "注意してください" } },
{ cat: "数式", syntax: "$E = mc^2$", render: { tag: "mathInline", text: "E = mc^2" } },
{ cat: "数式", syntax: "$`E = mc^2`$", render: { tag: "mathInline", text: "E = mc^2" } },
{ cat: "数式", syntax: "$$\\nx^2 + y^2 = 1\\n$$", render: { tag: "mathBlock", text: "x^2 + y^2 = 1" } },
{ cat: "図表", syntax: "```mermaid\\ngraph TD\\nA --> B\\n```", render: { tag: "diagram", kind: "mermaid", text: "graph TD\nA --> B" } },
{ cat: "図表", syntax: "```plantuml\\nAlice -> Bob: Hello\\n```", render: { tag: "diagram", kind: "plantuml", text: "Alice -> Bob: Hello" } },
{ cat: "図表", syntax: "@startuml\\nAlice -> Bob: Hello\\n@enduml", render: { tag: "diagram", kind: "plantuml", text: "@startuml\nAlice -> Bob: Hello\n@enduml" } },
{ cat: "絵文字", syntax: "いいね :+1:", render: { tag: "emoji", text: "いいね", emoji: "👍" } },
{ cat: "エスケープ", syntax: "\\\\*not italic\\\\*", render: { tag: "esc", text: "*not italic*" } },
{ cat: "コメント", syntax: "見える<!--隠す-->文章", render: { tag: "comment", text: "見える文章" } }];
