import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@remix/ui/components/sidebar";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { authClient } from "@/lib/auth-client";
import { buildAuthPageSearch } from "@/lib/auth-routing";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { data: session, isPending } = authClient.useSession();

  const hasBetterAuthIdentity = !!session?.session && !!session.user;

  useEffect(() => {
    if (isLoading || isPending) {
      return;
    }

    if (isAuthenticated || hasBetterAuthIdentity) {
      return;
    }

    navigate({
      to: "/login",
      search: buildAuthPageSearch(window.location.pathname),
      replace: true,
    }).catch(() => undefined);
  }, [hasBetterAuthIdentity, isAuthenticated, isLoading, isPending, navigate]);

  if (isLoading || isPending || (hasBetterAuthIdentity && !isAuthenticated)) {
    return (
      <div className="flex h-svh items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
