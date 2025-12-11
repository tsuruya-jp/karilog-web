import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { redirectIfAuthenticated } from "@/utils/auth";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    redirectIfAuthenticated();
  },
  component: RegisterPage,
});
