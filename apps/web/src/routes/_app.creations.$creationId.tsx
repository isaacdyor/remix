// biome-ignore-all lint/style/useFilenamingConvention: TanStack Router uses $ in dynamic route filenames.
import { api } from "@remix/backend/convex/_generated/api";
import type { Id } from "@remix/backend/convex/_generated/dataModel";
import { Button } from "@remix/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@remix/ui/components/card";
import { Input } from "@remix/ui/components/input";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/creations/$creationId")({
  component: CreationDetailRoute,
});

function CreationDetailRoute() {
  const navigate = useNavigate();
  const { creationId } = Route.useParams();
  const id = creationId as Id<"creations">;
  const creation = useQuery(api.creations.get, {
    id,
  });
  const updateCreation = useMutation(api.creations.update);
  const removeCreation = useMutation(api.creations.remove);
  const [name, setName] = useState("");

  useEffect(() => {
    if (creation) {
      setName(creation.name);
    }
  }, [creation]);

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextName = name.trim();

    if (!nextName) {
      return;
    }

    try {
      await updateCreation({ id, name: nextName });
      toast.success("Creation updated");
    } catch {
      toast.error("Could not update creation");
    }
  };

  const handleDelete = async () => {
    try {
      await removeCreation({ id });
      await navigate({ to: "/creations" });
    } catch {
      toast.error("Could not delete creation");
    }
  };

  if (creation === undefined) {
    return <p className="text-muted-foreground text-sm">Loading...</p>;
  }

  if (!creation) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <Button render={<Link to="/creations" />} variant="outline">
          <ArrowLeft />
          Back
        </Button>
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-sm">Creation not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <div>
        <Button render={<Link to="/creations" />} variant="outline">
          <ArrowLeft />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit creation</CardTitle>
          <CardDescription>
            Created {new Date(creation.createdAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-2" onSubmit={handleUpdate}>
            <Input
              aria-label="Creation name"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
            <Button type="submit">
              <Save />
              Save
            </Button>
            <Button onClick={handleDelete} type="button" variant="destructive">
              <Trash2 />
              Delete
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generations</CardTitle>
          <CardDescription>
            Updated {new Date(creation.updatedAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Generation history will live here next.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
