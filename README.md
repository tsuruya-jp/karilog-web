# karilog-web

**猟師の頼れる相棒** - 射撃・狩猟の帳簿管理サービス（フロントエンド）

## 概要

Karilog Webは、射撃および狩猟の帳簿をデジタル管理するWebアプリケーションのフロントエンドです。
実包管理帳簿、出猟カレンダーなどの機能を提供し、警察提出用PDF出力に対応しています。

## 主な機能

- 🔐 **ユーザー認証** - JWT認証、メール確認、パスワードリセット
- 📦 **実包管理** - 購入・使用記録、在庫管理、上限チェック
- 📅 **出猟カレンダー** - 出猟予定・実績の記録、統計表示
- 🔫 **銃砲管理** - 所持する銃の登録・管理
- 📄 **帳簿出力** - 警察提出用PDFの生成・ダウンロード

## 技術スタック（予定）

### フレームワーク候補

#### Option 1: React + Farm（推奨）
- React 19 + TypeScript
- Bun（パッケージマネージャー）
- Farm（Rust製ビルドツール）
- TanStack Router（型安全なルーティング）
- TanStack Query（サーバー状態管理）
- Zustand（クライアント状態管理）
- shadcn/ui + Tailwind CSS
- react-hook-form + Zod
- FullCalendar

#### Option 2: Next.js
- Next.js 14 + TypeScript
- その他はOption 1と同様

#### Option 3: Vue 3
- Vue 3 + TypeScript + Vite
- Pinia
- Element Plus / Vuetify

**注意**: 技術スタックは要件定義書確認後に確定します。

## リポジトリ構成

```
.
├── karilog-web/        # フロントエンド（本リポジトリ）
└── karilog-api/        # バックエンドAPI（../karilog-api）
```

## ドキュメント

- [Claude.md](Claude.md) - 開発ガイド
- [要件定義書](docs/requirements.md) - 機能要件、非機能要件、画面一覧
- [技術選定ガイド](docs/tech-stack.md) - フレームワーク比較、推奨構成
- [API連携仕様書](docs/api-integration.md) - API連携方法、認証フロー

### バックエンドAPI
- [karilog-api README](../karilog-api/README.md)
- [API仕様（Swagger）](../karilog-api/docs/swagger.yml)

## 開発優先順位

### Phase 1: 認証基盤
- ログイン・ログアウト
- ユーザー登録・メール確認
- パスワードリセット
- トークン自動更新

### Phase 2: 実包管理帳簿（最優先）
- ダッシュボード
- 実包種別・購入記録・使用記録管理
- 在庫一覧
- 帳簿PDF出力

### Phase 3: 出猟管理（最優先）
- 出猟カレンダー
- 出猟記録管理
- 出猟統計

### Phase 4: サポート機能
- 銃砲管理
- アカウント設定

## セットアップ（未実装）

```bash
# 依存関係インストール
bun install

# 開発サーバー起動
bun run dev

# ビルド
bun run build
```

## 環境変数（予定）

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Karilog
VITE_APP_ENV=development
```

## ライセンス

Apache License 2.0

## 作者

Yuri
