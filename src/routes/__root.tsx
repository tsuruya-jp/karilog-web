import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const router = useRouterState();
  const pathname = router.location.pathname;

  // 認証ページの場合はレイアウトなし、それ以外はAppLayoutを使用
  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"].some(
    (path) => pathname.startsWith(path)
  );

  if (isAuthPage) {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </>
    );
  }

  return (
    <>
      <AppLayout />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
