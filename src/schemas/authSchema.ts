import { z } from "zod";

// ログインフォームスキーマ
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("正しいメールアドレスを入力してください"),
  password: z
    .string()
    .min(1, "パスワードを入力してください")
    .min(8, "パスワードは8文字以上で入力してください"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ユーザー登録フォームスキーマ
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "メールアドレスを入力してください")
      .email("正しいメールアドレスを入力してください"),
    username: z
      .string()
      .min(1, "ユーザー名を入力してください")
      .min(3, "ユーザー名は3文字以上で入力してください")
      .max(50, "ユーザー名は50文字以内で入力してください"),
    password: z
      .string()
      .min(1, "パスワードを入力してください")
      .min(8, "パスワードは8文字以上で入力してください")
      .max(100, "パスワードは100文字以内で入力してください"),
    confirmPassword: z.string().min(1, "パスワード（確認）を入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

// パスワードリセット要求フォームスキーマ
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("正しいメールアドレスを入力してください"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// パスワードリセット実行フォームスキーマ
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "パスワードを入力してください")
      .min(8, "パスワードは8文字以上で入力してください")
      .max(100, "パスワードは100文字以内で入力してください"),
    confirmPassword: z.string().min(1, "パスワード（確認）を入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// パスワード変更フォームスキーマ
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "現在のパスワードを入力してください"),
    newPassword: z
      .string()
      .min(1, "新しいパスワードを入力してください")
      .min(8, "パスワードは8文字以上で入力してください")
      .max(100, "パスワードは100文字以内で入力してください"),
    confirmPassword: z.string().min(1, "パスワード（確認）を入力してください"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
