# StudyTypeScript

## 前提

Nord.js が必要です。

## 環境設定

必要に応じて `package.json` を修正し、
`npm i` を実行してください。

## プロジェクトの説明

`src` ディレクトリ配下に TypeScript ソースを配置してください。
`build` ディレクトリ配下に、トランスパイルした JavaScript ソースが作成されます。

## npm スクリプトの説明

- npm run
    - main: トランスパイルせずに `src/main.ts` を実行する。
    - build: トランスパイルを行う。
    - start: トランスパイルを行った後、`build/main.js` を実行する。
    - restart: `build/main.js` を実行する。
