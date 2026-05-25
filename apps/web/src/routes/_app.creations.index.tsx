import { api } from "@remix/backend/convex/_generated/api";
import type { Id } from "@remix/backend/convex/_generated/dataModel";
import { Button } from "@remix/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@remix/ui/components/card";
import { Input } from "@remix/ui/components/input";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/creations/")({
  component: CreationsIndexRoute,
});

function CreationsIndexRoute() {
  const navigate = useNavigate();
  const creations = useQuery(api.creations.list);
  const createCreation = useMutation(api.creations.create);
  const updateCreation = useMutation(api.creations.update);
  const removeCreation = useMutation(api.creations.remove);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<Id<"creations"> | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = newName.trim();

    if (!name) {
      return;
    }

    try {
      const id = await createCreation({ name });
      setNewName("");
      await navigate({
        to: "/creations/$creationId",
        params: { creationId: id },
      });
    } catch {
      toast.error("Could not create creation");
    }
  };

  const handleUpdate = async (id: Id<"creations">) => {
    const name = editingName.trim();

    if (!name) {
      return;
    }

    try {
      await updateCreation({ id, name });
      setEditingId(null);
      setEditingName("");
    } catch {
      toast.error("Could not update creation");
    }
  };

  const handleRemove = async (id: Id<"creations">) => {
    try {
      await removeCreation({ id });
    } catch {
      toast.error("Could not remove creation");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Creations</h1>
        <p className="text-muted-foreground text-sm">
          Create and manage your video ideas.
        </p>
      </div>

      <Card>
        <CardContent>
          <form className="flex gap-2" onSubmit={handleCreate}>
            <Input
              aria-label="Creation name"
              onChange={(event) => setNewName(event.target.value)}
              placeholder="New creation name"
              value={newName}
            />
            <Button type="submit">
              <Plus />
              Create
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {creations === undefined ? (
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-sm">Loading...</p>
            </CardContent>
          </Card>
        ) : null}

        {creations?.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                No creations yet. Create one to get started.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {creations?.map((creation) => {
          const isEditing = editingId === creation._id;

          return (
            <Card key={creation._id}>
              <CardHeader>
                <CardTitle>
                  {isEditing ? (
                    <Input
                      aria-label="Edit creation name"
                      onChange={(event) => setEditingName(event.target.value)}
                      value={editingName}
                    />
                  ) : (
                    <Link
                      className="hover:underline"
                      params={{ creationId: creation._id }}
                      to="/creations/$creationId"
                    >
                      {creation.name}
                    </Link>
                  )}
                </CardTitle>
                <CardDescription>
                  Updated {new Date(creation.updatedAt).toLocaleString()}
                </CardDescription>
                <CardAction className="flex gap-1">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={() => handleUpdate(creation._id)}
                        size="sm"
                        type="button"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingId(null);
                          setEditingName("");
                        }}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        aria-label="Edit creation"
                        onClick={() => {
                          setEditingId(creation._id);
                          setEditingName(creation.name);
                        }}
                        size="icon"
                        type="button"
                        variant="ghost"
                      >
                        <Edit2 />
                      </Button>
                      <Button
                        aria-label="Delete creation"
                        onClick={() => handleRemove(creation._id)}
                        size="icon"
                        type="button"
                        variant="destructive"
                      >
                        <Trash2 />
                      </Button>
                    </>
                  )}
                </CardAction>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
