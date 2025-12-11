import { Link, Outlet } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useLogout, useAuthState } from "@/hooks/useAuth";

export function AppLayout() {
  const { mutate: logout } = useLogout();
  const { user } = useAuthState();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold text-primary">
                Karilog
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  ダッシュボード
                </Link>
                <Link
                  to="/ammunition"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  実包管理
                </Link>
                <Link
                  to="/hunting"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  出猟管理
                </Link>
                <Link
                  to="/firearms"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  銃砲管理
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {user.username}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={() => logout()}>
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-xs text-muted-foreground">
            © 2024 Karilog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
