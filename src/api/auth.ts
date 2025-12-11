import apiClient from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  User,
} from "@/types/auth";

/**
 * ログイン
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);
  return response.data;
};

/**
 * ログアウト
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
  // ローカルストレージのトークンを削除
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

/**
 * ユーザー登録
 */
export const register = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    data,
  );
  return response.data;
};

/**
 * トークンリフレッシュ
 */
export const refreshToken = async (
  data: RefreshTokenRequest,
): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>(
    "/auth/refresh",
    data,
  );
  return response.data;
};

/**
 * パスワードリセット要求
 */
export const forgotPassword = async (
  data: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    data,
  );
  return response.data;
};

/**
 * パスワードリセット実行
 */
export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post<ResetPasswordResponse>(
    "/auth/reset-password",
    data,
  );
  return response.data;
};

/**
 * メール確認
 */
export const verifyEmail = async (
  data: VerifyEmailRequest,
): Promise<VerifyEmailResponse> => {
  const response = await apiClient.post<VerifyEmailResponse>(
    "/auth/verify-email",
    data,
  );
  return response.data;
};

/**
 * パスワード変更
 */
export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<ChangePasswordResponse> => {
  const response = await apiClient.post<ChangePasswordResponse>(
    "/auth/change-password",
    data,
  );
  return response.data;
};

/**
 * 現在のユーザー情報を取得
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
};

/**
 * メール確認の再送信
 */
export const resendVerificationEmail = async (): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    "/auth/resend-verification",
  );
  return response.data;
};
