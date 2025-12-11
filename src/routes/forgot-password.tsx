import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { redirectIfAuthenticated } from "@/utils/auth";

export const Route = createFileRoute("/forgot-password")({
  beforeLoad: () => {
    redirectIfAuthenticated();
  },
  component: ForgotPasswordPage,
});
