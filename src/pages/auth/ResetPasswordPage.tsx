import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/useAuth";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/schemas/authSchema";

export function ResetPasswordPage() {
  const search = useSearch({ from: "/reset-password" });
  const token = (search as any)?.token || "";

  const { mutate: resetPassword, isPending, isError, error } = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPassword({
      token,
      new_password: values.password,
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">Karilog</h1>
            <p className="text-muted-foreground">射撃・狩猟帳簿管理システム</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>エラー</CardTitle>
              <CardDescription>
                無効なリンクです
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md mb-4">
                パスワードリセット用のトークンが無効です。メールに記載されたリンクを確認してください。
              </div>

              <Link to="/forgot-password">
                <Button className="w-full">パスワードリセット画面へ</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Karilog</h1>
          <p className="text-muted-foreground">射撃・狩猟帳簿管理システム</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>パスワード再設定</CardTitle>
            <CardDescription>
              新しいパスワードを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {isError && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    {error?.message || "パスワードリセットに失敗しました。もう一度お試しください。"}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>新しいパスワード</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>新しいパスワード（確認）</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "リセット中..." : "パスワードをリセット"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Link
                to="/login"
                className="text-primary hover:underline"
              >
                ログイン画面に戻る
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>© 2024 Karilog. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
