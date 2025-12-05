# Karilog Web - Claude Code開発ガイド

## プロジェクト概要

Karilog Webは射撃・狩猟の帳簿をデジタル管理するWebアプリケーションのフロントエンドです。
バックエンドAPI（karilog-api）と連携し、実包管理帳簿、出猟カレンダーなどの機能を提供します。

---

## 技術スタック

- **フレームワーク**: React 19 + TypeScript（候補）
- **パッケージマネージャー**: Bun（高速、オールインワンツールキット）
- **ビルドツール**: Farm（Rust製、超高速ビルド＆HMR）
- **ルーティング**: TanStack Router（型安全なルーティング、データローディング機能内蔵）
- **状態管理**:
  - サーバー状態: TanStack Query
  - クライアント状態: Zustand
- **UIライブラリ**: shadcn/ui + Tailwind CSS
- **フォーム**: react-hook-form + Zod
- **カレンダー**: FullCalendar
- **HTTP通信**: Axios
- **日付処理**: date-fns

**注意**: 技術スタックは要件定義後に変更される可能性があります。

---

## Bun使用ガイド

### 基本方針

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

### Bun APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

### Testing with Bun

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

### Frontend Development with Bun

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";

// import .css files directly and it works
import './index.css';

import { createRoot } from "react-dom/client";

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.md`.

---

## リポジトリ構成

```
karilog-web/          # フロントエンド（本リポジトリ）
karilog-api/          # バックエンドAPI（../karilog-api）
```

---

## プロジェクト構造（予定）

```
karilog-web/
├── docs/                   # ドキュメント
│   ├── requirements.md     # 要件定義書
│   ├── tech-stack.md       # 技術選定ガイド
│   └── api-integration.md  # API連携仕様書
├── public/                 # 静的ファイル
├── src/
│   ├── main.tsx            # エントリポイント
│   ├── App.tsx             # ルートコンポーネント
│   ├── pages/              # ページコンポーネント
│   │   ├── auth/           # 認証関連ページ
│   │   ├── dashboard/      # ダッシュボード
│   │   ├── ammunition/     # 実包管理
│   │   ├── hunting/        # 出猟管理
│   │   ├── firearms/       # 銃砲管理
│   │   └── settings/       # 設定
│   ├── components/         # 共通コンポーネント
│   │   ├── ui/             # UIコンポーネント
│   │   ├── layout/         # レイアウト
│   │   └── forms/          # フォーム
│   ├── features/           # 機能別モジュール
│   │   ├── auth/
│   │   ├── ammunition/
│   │   └── hunting/
│   ├── hooks/              # カスタムフック
│   ├── api/                # API通信
│   │   ├── client.ts       # Axiosインスタンス
│   │   ├── auth.ts
│   │   ├── ammunition.ts
│   │   └── hunting.ts
│   ├── stores/             # 状態管理（Zustand）
│   ├── types/              # 型定義
│   ├── utils/              # ユーティリティ
│   ├── styles/             # スタイル
│   └── routes/             # ルーティング（TanStack Router、型安全なルート定義）
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 主要ドキュメント

- [要件定義書](docs/requirements.md) - 機能要件、非機能要件、画面一覧
- [技術選定ガイド](docs/tech-stack.md) - フレームワーク比較、推奨構成
- [API連携仕様書](docs/api-integration.md) - API連携方法、認証フロー
- [karilog-api API仕様](../karilog-api/docs/swagger.yml) - バックエンドAPI仕様

---

## 開発優先順位

### Phase 1: 認証基盤（1-2週間）
1. プロジェクトセットアップ
2. ルーティング設定
3. 認証API連携
4. ログイン・ログアウト画面
5. ユーザー登録・メール確認
6. パスワードリセット
7. トークン自動更新機能

### Phase 2: 実包管理帳簿（3-4週間）【最優先】
1. ダッシュボード画面
2. 実包種別管理（CRUD）
3. 購入記録管理（CRUD、上限チェック）
4. 使用記録管理（CRUD、在庫チェック）
5. 在庫一覧画面
6. 所持許可上限設定
7. 帳簿PDF出力機能

### Phase 3: 出猟管理（2-3週間）【最優先】
1. 出猟カレンダー画面
2. 出猟記録登録・編集
3. 出猟記録一覧・フィルタリング
4. 出猟統計画面
5. 実包使用記録との連携

### Phase 4: サポート機能（1-2週間）
1. 銃砲管理画面（CRUD）
2. アカウント設定画面
3. パスワード変更機能
4. CSV出力機能

### Phase 5: 最適化・テスト（1-2週間）
1. パフォーマンス最適化
2. アクセシビリティ改善
3. E2Eテスト
4. バグ修正

---

## 開発ルール

### コーディング規約

1. **TypeScriptフル活用**: `any`型は原則禁止、厳格な型定義
2. **命名規則**:
   - コンポーネント: PascalCase (`UserProfile.tsx`)
   - フック: camelCase、useプレフィックス (`useAuth.ts`)
   - 定数: SCREAMING_SNAKE_CASE
   - その他: camelCase
3. **ESLint + Prettier**: コードフォーマットを統一
4. **コンポーネント設計**:
   - 単一責任の原則
   - Presentational / Container分離（必要に応じて）
   - Props型定義必須

### コミットメッセージ

```
<type>: <subject>

<body>
```

**type**:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: スタイル変更（機能影響なし）
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: ビルド、CI等

**例**:
```
feat: 実包購入記録登録フォームを実装

- react-hook-formでフォームバリデーション
- Zodスキーマで型安全なバリデーション
- 許可上限チェック機能を統合
```

### ブランチ戦略

- `main`: 本番リリース
- `develop`: 開発用
- `feature/*`: 機能開発
- `fix/*`: バグ修正

---

## 環境変数

```env
# API設定
VITE_API_BASE_URL=http://localhost:8080/api/v1

# アプリケーション設定
VITE_APP_NAME=Karilog
VITE_APP_ENV=development
```

---

## 開発コマンド（予定）

```bash
# 依存関係インストール
bun install

# 開発サーバー起動
bun run dev

# ビルド
bun run build

# プレビュー
bun run preview

# Lint
bun run lint

# Lintエラー自動修正
bun run lint:fix

# 型チェック
bun run type-check

# テスト
bun test

# E2Eテスト
bun run test:e2e
```

**注**: Bunはnpm/yarn/pnpmより高速なパッケージ管理とスクリプト実行を提供します。

---

## API連携の基本

### Axiosクライアント設定

```typescript
// src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 認証トークン付与
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// トークン自動リフレッシュ
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      // リフレッシュ処理...
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### TanStack Queryの使用

```typescript
// src/hooks/useAmmunitionStock.ts
import { useQuery } from '@tanstack/react-query';
import { getAmmunitionStock } from '@/api/ammunition';

export const useAmmunitionStock = () => {
  return useQuery({
    queryKey: ['ammunition-stock'],
    queryFn: getAmmunitionStock,
    staleTime: 5 * 60 * 1000, // 5分キャッシュ
  });
};
```

### フォームバリデーション

```typescript
// src/schemas/purchaseSchema.ts
import { z } from 'zod';

export const purchaseSchema = z.object({
  ammunition_type_id: z.string().uuid(),
  purchase_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  supplier: z.string().min(1, '購入先を入力してください').max(200),
  quantity: z.number().int().min(1, '数量は1以上で入力してください'),
  price: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

export type PurchaseFormValues = z.infer<typeof purchaseSchema>;
```

```typescript
// コンポーネント内
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const PurchaseForm = () => {
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
  });

  const onSubmit = (values: PurchaseFormValues) => {
    // API呼び出し
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
};
```

---

## 注意事項

1. **セキュリティ**:
   - トークンはlocalStorageに保存（将来的にhttpOnlyクッキー検討）
   - XSS対策として入力値はサニタイズ
   - APIからのレスポンスをそのままinnerHTMLに設定しない

2. **パフォーマンス**:
   - TanStack Queryのキャッシュを活用
   - 不要な再レンダリングを防ぐ（React.memo、useMemo、useCallback）
   - 大きなリストは仮想スクロール（react-virtual）

3. **アクセシビリティ**:
   - セマンティックHTML使用
   - キーボード操作対応
   - aria属性の適切な設定
   - カラーコントラスト確保

4. **エラーハンドリング**:
   - APIエラーはユーザーフレンドリーなメッセージに変換
   - エラーバウンダリで予期しないエラーをキャッチ
   - ネットワークエラー時の再試行機能

5. **テスト**:
   - 重要な機能はユニットテスト
   - ユーザーフローはE2Eテスト（Playwright推奨）
   - API連携はMSWでモック

---

## よくある開発タスク

### 新しいページを追加

1. `src/pages/` にページコンポーネントを作成
2. `src/routes/` に型安全なルート定義を追加（TanStack Router）
   - ルートパラメータ、検索パラメータの型定義も含む
   - データローディング関数（loader）の定義も可能
3. ナビゲーションメニューにリンクを追加（型安全なナビゲーション）

### 新しいAPI連携を追加

1. `src/api/` にAPI関数を定義
2. `src/hooks/` にカスタムフック作成（TanStack Query）
3. 型定義を `src/types/` に追加
4. コンポーネントで使用

### 新しいフォームを追加

1. `src/schemas/` にZodスキーマ定義
2. `src/components/forms/` にフォームコンポーネント作成
3. react-hook-formとzodResolverで統合
4. バリデーションエラー表示

---

## トラブルシューティング

### Q: APIが401エラーを返す
A: トークンが期限切れの可能性。リフレッシュトークンで更新を試みる。それでも失敗する場合はログイン画面へリダイレクト。

### Q: TanStack Queryのキャッシュが更新されない
A: Mutation成功時に`queryClient.invalidateQueries()`で該当するクエリを無効化。

### Q: フォームのバリデーションが動かない
A: Zodスキーマと型定義が一致しているか確認。`zodResolver`の設定を確認。

---

## 参考リンク

- [React公式ドキュメント](https://react.dev/)
- [Bun](https://bun.sh/)
- [Farm](https://www.farmfe.org/)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [FullCalendar](https://fullcalendar.io/)

---

## 改訂履歴

| バージョン | 日付 | 内容 |
|------------|------|------|
| 1.3 | 2025-12-05 | Claude.mdとCLAUDE.mdを統合、Bun使用ガイドセクションを追加 |
| 1.2 | 2025-12-04 | パッケージマネージャーをBunに、ビルドツールをFarmに変更 |
| 1.1 | 2025-12-04 | ルーティングをReact Router v6からTanStack Routerに変更 |
| 1.0 | 2025-12-01 | 初版作成 |
