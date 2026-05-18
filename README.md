# Markdown Quiz

Markdown の基本記法を、入力式のクイズで練習できる React アプリです。

画面に表示される目標の見た目を再現するように Markdown を入力すると、右側にライブプレビューが表示されます。正しい記法と一致すると自動で正解になり、次の問題へ進めます。

## Features

- 見出し、太字、リンク、画像、引用、リストなどの基本記法を練習
- Markdown 入力とレンダリング結果のライブプレビュー
- ランダムに選ばれる 8 問のクイズ
- 正解数に応じた結果表示
- 記法と表示結果を確認できる「記法事典」

## Tech Stack

- React
- Vite
- JavaScript

## Getting Started

依存関係をインストールします。

```bash
npm install
```

開発サーバーを起動します。

```bash
npm run dev
```

本番用にビルドします。

```bash
npm run build
```

ビルド結果をローカルで確認します。

```bash
npm run preview
```

## Project Structure

```text
src/
  App.jsx                 アプリ全体の画面切り替え
  data.js                 クイズ問題と記法事典のデータ
  markdown.jsx            簡易 Markdown レンダラー
  ui.jsx                  共通 UI パーツ
  screens/
    StartScreen.jsx       スタート画面
    QuizScreen.jsx        クイズ画面
    DictScreen.jsx        記法事典画面
```

## Notes

このアプリは学習用の簡易 Markdown レンダラーを内蔵しています。一般的な Markdown パーサーの完全互換を目指すものではなく、クイズで扱う基本記法に絞って表示します。
