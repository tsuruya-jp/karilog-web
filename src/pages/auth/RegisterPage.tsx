import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
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
import { useRegister } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormValues } from "@/schemas/authSchema";
import { useState } from "react";

export function RegisterPage() {
  const { mutate: register, isPending, isError, error, isSuccess } = useRegister();
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    register(
      {
        email: values.email,
        username: values.username,
        password: values.password,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
        },
      }
    );
  };

  if (showSuccess || isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">Karilog</h1>
            <p className="text-muted-foreground">射撃・狩猟帳簿管理システム</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>登録完了</CardTitle>
              <CardDescription>
                ユーザー登録が完了しました
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 text-sm bg-primary/10 rounded-md">
                <p className="mb-2">
                  確認メールを送信しました。メールに記載されたリンクをクリックして、アカウントを有効化してください。
                </p>
              </div>

              <Link to="/login">
                <Button className="w-full">ログイン画面へ</Button>
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
            <CardTitle>新規登録</CardTitle>
            <CardDescription>
              アカウント情報を入力して登録してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {isError && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    {error?.message || "登録に失敗しました。入力内容を確認してください。"}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@example.com"
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ユーザー名</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="太郎"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>パスワード</FormLabel>
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
                      <FormLabel>パスワード（確認）</FormLabel>
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
                  {isPending ? "登録中..." : "登録"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                すでにアカウントをお持ちの方は
                <Link
                  to="/login"
                  className="text-primary hover:underline ml-1"
                >
                  ログイン
                </Link>
              </p>
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
