import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/creations")({
  component: CreationsLayout,
});

function CreationsLayout() {
  return <Outlet />;
}
