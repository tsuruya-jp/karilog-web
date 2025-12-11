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
import { useForgotPassword } from "@/hooks/useAuth";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/schemas/authSchema";
import { useState } from "react";

export function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending, isError, error, isSuccess } = useForgotPassword();
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPassword(values, {
      onSuccess: () => {
        setShowSuccess(true);
      },
    });
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
              <CardTitle>メール送信完了</CardTitle>
              <CardDescription>
                パスワードリセット用のメールを送信しました
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 text-sm bg-primary/10 rounded-md">
                <p className="mb-2">
                  登録されているメールアドレスにパスワードリセット用のリンクを送信しました。
                </p>
                <p>
                  メールに記載されたリンクをクリックして、パスワードをリセットしてください。
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
            <CardTitle>パスワードリセット</CardTitle>
            <CardDescription>
              登録したメールアドレスを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {isError && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    {error?.message || "メール送信に失敗しました。メールアドレスを確認してください。"}
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

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "送信中..." : "リセットリンクを送信"}
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
