import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { requireAuth } from "@/utils/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    requireAuth();
  },
  component: DashboardPage,
});
