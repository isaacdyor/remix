import { createFileRoute } from "@tanstack/react-router";

import SignUpForm from "@/components/sign-up-form";
import { parseAuthRedirectSearch } from "@/lib/auth-routing";

export const Route = createFileRoute("/_auth/signup")({
  component: SignupRoute,
  validateSearch: (search) =>
    parseAuthRedirectSearch(search as Record<string, unknown>),
});

function SignupRoute() {
  const search = Route.useSearch();

  return <SignUpForm redirect={search.redirect} />;
}
