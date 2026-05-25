import { api } from "@remix/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardRoute,
});

function DashboardRoute() {
  const privateData = useQuery(api.privateData.get);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Your private workspace overview.
        </p>
      </div>
      <section className="rounded-lg border bg-card p-4 text-card-foreground">
        <h2 className="font-medium text-sm">Private data</h2>
        <p className="mt-2 text-muted-foreground text-sm">
          {privateData?.message ?? "Loading..."}
        </p>
      </section>
    </div>
  );
}
