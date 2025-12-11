import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { redirectIfAuthenticated } from "@/utils/auth";

export const Route = createFileRoute("/reset-password")({
  beforeLoad: () => {
    redirectIfAuthenticated();
  },
  component: ResetPasswordPage,
});
