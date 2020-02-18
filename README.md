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
    - mastermind: トランスパイルせずに `src/mastermind.ts` を実行する。
    - poker: トランスパイルせずに `src/poker.ts` を実行する。
    - build: トランスパイルを行う。
