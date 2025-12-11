import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";

/**
 * 認証が必要なルートで使用する認証チェック関数
 */
export const requireAuth = () => {
  const { isAuthenticated } = useAuthStore.getState();

  if (!isAuthenticated) {
    throw redirect({
      to: "/login",
      search: {
        redirect: window.location.pathname,
      },
    });
  }
};

/**
 * 認証済みの場合にリダイレクトする関数（ログイン画面など）
 */
export const redirectIfAuthenticated = () => {
  const { isAuthenticated } = useAuthStore.getState();

  if (isAuthenticated) {
    throw redirect({
      to: "/",
    });
  }
};
