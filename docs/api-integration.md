# Karilog Web API連携仕様書

## 概要

本ドキュメントでは、Karilog Web（フロントエンド）とkarilog-api（バックエンド）の連携方法を定義します。

---

## API基本情報

### エンドポイント

| 環境 | URL |
|------|-----|
| 開発 | `http://localhost:8080/api/v1` |
| 本番 | `https://api.karilog.jp/api/v1`（予定） |

### 認証方式

**Bearer認証（JWT）**

リクエストヘッダーに以下を付与：
```
Authorization: Bearer <access_token>
```

### トークン有効期限

| トークン種別 | 有効期限 |
|--------------|----------|
| アクセストークン | 1時間 |
| リフレッシュトークン | 30日 |

---

## 認証フロー

### 1. ユーザー登録

**エンドポイント**: `POST /auth/register`

**リクエスト**:
```json
{
  "email": "hunter@example.com",
  "password": "SecurePass123!",
  "name": "山田太郎"
}
```

**レスポンス** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "hunter@example.com",
  "name": "山田太郎",
  "email_verified": false,
  "created_at": "2025-01-15T10:30:00Z",
  "message": "確認メールを送信しました。メール内のリンクをクリックしてください。"
}
```

**フロントエンド処理**:
1. フォームバリデーション（メールアドレス形式、パスワード8文字以上）
2. API呼び出し
3. 成功時 → メール確認案内画面へ遷移
4. エラー時 → エラーメッセージ表示（メールアドレス重複等）

---

### 2. メールアドレス確認

**エンドポイント**: `POST /auth/verify-email`

**リクエスト**:
```json
{
  "token": "verification-token-from-email"
}
```

**レスポンス** (200 OK):
```json
{
  "message": "メールアドレスを確認しました。ログインできます。"
}
```

**フロントエンド処理**:
1. URLパラメータからトークン取得（例: `/verify-email?token=xxx`）
2. API呼び出し
3. 成功時 → ログイン画面へ遷移、成功メッセージ表示
4. エラー時 → エラーメッセージ表示、再送信リンク表示

---

### 3. ログイン

**エンドポイント**: `POST /auth/login`

**リクエスト**:
```json
{
  "email": "hunter@example.com",
  "password": "SecurePass123!"
}
```

**レスポンス** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "hunter@example.com",
    "name": "山田太郎",
    "email_verified": true
  }
}
```

**エラーレスポンス例** (423 Locked):
```json
{
  "code": "ACCOUNT_LOCKED",
  "message": "アカウントがロックされています",
  "locked_until": "2025-01-15T11:00:00Z",
  "remaining_minutes": 25
}
```

**フロントエンド処理**:
1. API呼び出し
2. 成功時:
   - アクセストークンとリフレッシュトークンをlocalStorageに保存
   - ユーザー情報をZustandストアに保存
   - ダッシュボードへ遷移
3. エラー時:
   - 401 Unauthorized → 「メールアドレスまたはパスワードが正しくありません」
   - 423 Locked → ロック解除時刻を表示

---

### 4. トークンリフレッシュ

**エンドポイント**: `POST /auth/refresh`

**リクエスト**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**レスポンス** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**フロントエンド処理**:
1. API呼び出しで401エラー発生時、自動的にリフレッシュを試行
2. 新しいトークンをlocalStorageに保存
3. 元のAPIリクエストを再実行
4. リフレッシュ失敗時 → ログイン画面へリダイレクト

**実装例（Axiosインターセプター）**:
```typescript
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post('/auth/refresh', { refresh_token: refreshToken });

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // リフレッシュ失敗 → ログアウト処理
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

### 5. ログアウト

**エンドポイント**: `POST /auth/logout`

**リクエスト**: なし（Authorizationヘッダーのみ）

**レスポンス**: 204 No Content

**フロントエンド処理**:
1. API呼び出し
2. localStorageをクリア
3. Zustandストアをリセット
4. ログイン画面へ遷移

---

## データ取得フロー（TanStack Query）

### 基本パターン

**API関数定義**:
```typescript
// src/api/ammunition.ts
export const getAmmunitionStock = async (): Promise<AmmunitionStock[]> => {
  const { data } = await axios.get('/ammunition-stock');
  return data.stocks;
};
```

**カスタムフック**:
```typescript
// src/hooks/useAmmunitionStock.ts
import { useQuery } from '@tanstack/react-query';
import { getAmmunitionStock } from '@/api/ammunition';

export const useAmmunitionStock = () => {
  return useQuery({
    queryKey: ['ammunition-stock'],
    queryFn: getAmmunitionStock,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });
};
```

**コンポーネント内で使用**:
```typescript
const AmmunitionStockPage = () => {
  const { data, isLoading, error } = useAmmunitionStock();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      {data.map(stock => (
        <StockCard key={stock.ammunition_type.id} stock={stock} />
      ))}
    </div>
  );
};
```

---

## データ更新フロー（TanStack Query Mutation）

### 基本パターン

**API関数定義**:
```typescript
// src/api/ammunition.ts
export const createAmmunitionPurchase = async (
  purchase: CreateAmmunitionPurchaseRequest
): Promise<AmmunitionPurchase> => {
  const { data } = await axios.post('/ammunition-purchases', purchase);
  return data;
};
```

**カスタムフック**:
```typescript
// src/hooks/useCreateAmmunitionPurchase.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAmmunitionPurchase } from '@/api/ammunition';
import { toast } from '@/components/ui/toast';

export const useCreateAmmunitionPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAmmunitionPurchase,
    onSuccess: (data) => {
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['ammunition-purchases'] });
      queryClient.invalidateQueries({ queryKey: ['ammunition-stock'] });

      toast({
        title: '購入記録を登録しました',
        description: `${data.ammunition_type.name}を${data.quantity}発購入`,
      });
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        // 上限超過警告
        toast({
          title: '警告',
          description: error.response.data.message,
          variant: 'warning',
        });
      } else {
        toast({
          title: 'エラー',
          description: '購入記録の登録に失敗しました',
          variant: 'destructive',
        });
      }
    },
  });
};
```

**コンポーネント内で使用**:
```typescript
const PurchaseForm = () => {
  const createPurchase = useCreateAmmunitionPurchase();

  const onSubmit = (values: FormValues) => {
    createPurchase.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* フォームフィールド */}
      <Button type="submit" disabled={createPurchase.isPending}>
        {createPurchase.isPending ? '登録中...' : '登録'}
      </Button>
    </form>
  );
};
```

---

## エラーハンドリング

### HTTPステータスコード別の処理

| ステータス | エラーコード | 処理 |
|-----------|--------------|------|
| 400 | VALIDATION_ERROR | バリデーションエラーをフィールドごとに表示 |
| 401 | UNAUTHORIZED | トークンリフレッシュ試行 → 失敗時ログイン画面へ |
| 401 | INVALID_CREDENTIALS | 「メールアドレスまたはパスワードが正しくありません」 |
| 401 | EMAIL_NOT_VERIFIED | 「メールアドレスが確認されていません」 |
| 403 | FORBIDDEN | 「アクセス権限がありません」 |
| 404 | NOT_FOUND | 「データが見つかりません」 |
| 422 | QUOTA_EXCEEDED | 許可上限超過警告を表示（警告として処理、登録は可能） |
| 422 | INSUFFICIENT_STOCK | 「在庫が不足しています」 |
| 423 | ACCOUNT_LOCKED | ロック解除時刻を表示 |
| 429 | TOO_MANY_REQUESTS | 「リクエストが多すぎます。しばらく待ってください」 |
| 500 | INTERNAL_SERVER_ERROR | 「サーバーエラーが発生しました」 |

### バリデーションエラーの表示

**APIレスポンス例**:
```json
{
  "code": "VALIDATION_ERROR",
  "message": "入力内容に誤りがあります",
  "details": [
    {
      "field": "email",
      "message": "有効なメールアドレスを入力してください"
    },
    {
      "field": "password",
      "message": "パスワードは8文字以上で入力してください"
    }
  ]
}
```

**フロントエンド処理**:
```typescript
const onSubmit = async (values: FormValues) => {
  try {
    await registerUser(values);
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.details) {
      // react-hook-formのsetErrorでフィールドエラーを設定
      error.response.data.details.forEach((detail) => {
        setError(detail.field, { message: detail.message });
      });
    }
  }
};
```

---

## ページネーション

### APIレスポンス例

**リクエスト**: `GET /ammunition-purchases?page=1&per_page=20`

**レスポンス**:
```json
{
  "purchases": [...],
  "total": 150,
  "page": 1,
  "per_page": 20,
  "total_pages": 8
}
```

### フロントエンド実装

```typescript
const usePaginatedPurchases = (page: number, perPage: number = 20) => {
  return useQuery({
    queryKey: ['ammunition-purchases', { page, perPage }],
    queryFn: () => getAmmunitionPurchases({ page, perPage }),
    keepPreviousData: true, // ページ遷移時に前のデータを保持
  });
};
```

---

## ファイルダウンロード（PDF/CSV）

### PDF出力

**エンドポイント**: `POST /reports/ammunition-ledger/pdf`

**リクエスト**:
```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

**レスポンス**:
```json
{
  "pdf_data": "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC...", // Base64エンコード
  "filename": "ammunition_ledger_20240101_20241231.pdf"
}
```

**フロントエンド実装**:
```typescript
const downloadPdf = async (startDate: string, endDate: string) => {
  const { data } = await axios.post('/reports/ammunition-ledger/pdf', {
    start_date: startDate,
    end_date: endDate,
  });

  // Base64デコードしてBlobに変換
  const byteCharacters = atob(data.pdf_data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  // ダウンロード
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = data.filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
```

### CSV出力

**エンドポイント**: `POST /reports/ammunition-purchases/csv`

**レスポンス**: `text/csv` (直接CSVデータ)

**フロントエンド実装**:
```typescript
const downloadCsv = async (startDate: string, endDate: string) => {
  const response = await axios.post('/reports/ammunition-purchases/csv', {
    start_date: startDate,
    end_date: endDate,
  }, {
    responseType: 'blob', // Blobとして受信
  });

  const blob = new Blob([response.data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ammunition_purchases_${startDate}_${endDate}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
```

---

## 型定義

### API型定義の自動生成

**推奨**: OpenAPI（swagger.yml）から型定義を自動生成

```bash
# openapi-typescript を使用
npx openapi-typescript ../karilog-api/docs/swagger.yml -o src/types/api.ts
```

### 手動型定義（代替案）

```typescript
// src/types/ammunition.ts

export interface AmmunitionType {
  id: string;
  name: string;
  caliber: string;
  shot_size?: string;
  is_slug: boolean;
  created_at: string;
  updated_at: string;
}

export interface AmmunitionPurchase {
  id: string;
  ammunition_type: AmmunitionType;
  firearm?: Firearm;
  purchase_date: string;
  supplier: string;
  quantity: number;
  price?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAmmunitionPurchaseRequest {
  ammunition_type_id: string;
  firearm_id?: string;
  purchase_date: string;
  supplier: string;
  quantity: number;
  price?: number;
  notes?: string;
}

export interface AmmunitionStock {
  ammunition_type: AmmunitionType;
  current_stock: number;
  total_purchased: number;
  total_used: number;
  max_quantity?: number;
  remaining_quota?: number;
}
```

---

## 環境変数設定

**`.env.example`**:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

**`.env.development`**:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

**`.env.production`**:
```env
VITE_API_BASE_URL=https://api.karilog.jp/api/v1
```

**Axiosクライアント設定**:
```typescript
// src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（認証トークン付与）
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

---

## テスト方針

### モックAPIサーバー（MSW）

開発中はMock Service Worker（MSW）でAPIをモック化

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        token_type: 'Bearer',
        expires_in: 3600,
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'テストユーザー',
          email_verified: true,
        },
      })
    );
  }),

  rest.get('/api/v1/ammunition-stock', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        stocks: [
          {
            ammunition_type: {
              id: '1',
              name: '12番 7.5号',
              caliber: '12番',
            },
            current_stock: 150,
            total_purchased: 500,
            total_used: 350,
            max_quantity: 800,
            remaining_quota: 650,
          },
        ],
      })
    );
  }),
];
```

---

## 変更履歴

| バージョン | 日付 | 内容 |
|------------|------|------|
| 1.0 | 2025-12-01 | 初版作成 |
