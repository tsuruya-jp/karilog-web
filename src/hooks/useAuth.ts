import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  getCurrentUser,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
  verifyEmail as verifyEmailApi,
  changePassword as changePasswordApi,
} from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ChangePasswordRequest,
} from "@/types/auth";

/**
 * ログイン
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // 認証情報をストアに保存
      setAuth(data.user, data.access_token, data.refresh_token);
      // ダッシュボードへリダイレクト
      navigate({ to: "/" });
    },
  });
};

/**
 * ログアウト
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // 認証情報をクリア
      clearAuth();
      // クエリキャッシュをクリア
      queryClient.clear();
      // ログイン画面へリダイレクト
      navigate({ to: "/login" });
    },
  });
};

/**
 * ユーザー登録
 */
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      // ログイン画面へリダイレクト（メール確認メッセージを表示）
      navigate({ to: "/login" });
    },
  });
};

/**
 * パスワードリセット要求
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
  });
};

/**
 * パスワードリセット実行
 */
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      // ログイン画面へリダイレクト
      navigate({ to: "/login" });
    },
  });
};

/**
 * メール確認
 */
export const useVerifyEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyEmailApi,
    onSuccess: () => {
      // ログイン画面へリダイレクト
      navigate({ to: "/login" });
    },
  });
};

/**
 * パスワード変更
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePasswordApi,
  });
};

/**
 * 現在のユーザー情報を取得
 */
export const useCurrentUser = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5分キャッシュ
  });
};

/**
 * 認証状態を取得
 */
export const useAuthState = () => {
  return useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  }));
};
