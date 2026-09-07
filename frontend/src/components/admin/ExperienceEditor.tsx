"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { SortableItem, SortableList } from "@/components/admin/v2/SortableList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateExperience,
  useDeleteExperience,
  useExperiences,
  useUpdateExperience,
} from "@/hooks/queries/useExperiences";

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  current: boolean;
}

const emptyExp: Omit<Experience, "id"> = {
  role: "",
  company: "",
  period: "",
  description: "",
  current: false,
};

export function ExperienceEditor() {
  const { data: experiences, isLoading } = useExperiences();
  const createExp = useCreateExperience();
  const updateExp = useUpdateExperience();
  const deleteExp = useDeleteExperience();

  const [items, setItems] = useState<Experience[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const rawList = Array.isArray(experiences)
    ? (experiences as Record<string, unknown>[])
    : [];

  if (rawList.length > 0 && !initialized) {
    setItems(
      rawList.map((e) => ({
        id: String(e.id),
        role: String(e.role || ""),
        company: String(e.company || ""),
        period: String(e.period || ""),
        description: String(e.description || ""),
        current: Boolean(e.current),
      })),
    );
    setInitialized(true);
  }

  const handleSave = () => {
    for (const exp of items) {
      const payload = {
        role: exp.role,
        company: exp.company,
        period: exp.period,
        description: exp.description,
        current: exp.current,
      };
      if (exp.id && !exp.id.startsWith("new-")) {
        updateExp.mutate({ id: exp.id, payload });
      } else {
        createExp.mutate(payload);
      }
    }
  };

  const openNew = () => {
    setEditing({ id: "", ...emptyExp });
    setDialogOpen(true);
  };

  const openEdit = (e: Experience) => {
    setEditing({ ...e });
    setDialogOpen(true);
  };

  const handleSaveDialog = () => {
    if (!editing) return;
    if (editing.id && !editing.id.startsWith("new-")) {
      setItems(items.map((e) => (e.id === editing.id ? editing : e)));
    } else {
      setItems([...items, { ...editing, id: `new-${Date.now()}` }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (id && !id.startsWith("new-")) {
      deleteExp.mutate(id);
    }
    setItems(items.filter((e) => e.id !== id));
  };

  const handleReorder = (orderedIds: string[]) => {
    const map = new Map(items.map((e) => [e.id, e]));
    setItems(
      orderedIds
        .map((id) => map.get(id))
        .filter((e): e is Experience => Boolean(e)),
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Work History ({items.length})</h2>
        <Button size="sm" onClick={openNew}>
          <Plus className="size-3" />
          Add Experience
        </Button>
      </div>

      <SortableList
        items={items.map((e) => ({ id: e.id }))}
        onReorder={handleReorder}
      >
        {items.map((exp) => (
          <SortableItem key={exp.id} id={exp.id}>
            <Card className="mb-3">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  {exp.role}
                  {exp.current && <Badge variant="default">Current</Badge>}
                </CardTitle>
                <CardAction>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => openEdit(exp)}
                    >
                      <Pencil className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {exp.company} · {exp.period}
                </p>
              </CardContent>
            </Card>
          </SortableItem>
        ))}
      </SortableList>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No experiences yet.
        </p>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={createExp.isPending || updateExp.isPending}
        >
          {(createExp.isPending || updateExp.isPending) && (
            <Loader2 className="size-3 animate-spin" />
          )}
          Save Experience
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing?.id && !editing.id.startsWith("new-")
                ? "Edit Experience"
                : "New Experience"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Role</Label>
                <Input
                  value={editing.role}
                  onChange={(e) =>
                    setEditing({ ...editing, role: e.target.value })
                  }
                  placeholder="Software Engineer"
                />
              </div>
              <div className="grid gap-2">
                <Label>Company</Label>
                <Input
                  value={editing.company}
                  onChange={(e) =>
                    setEditing({ ...editing, company: e.target.value })
                  }
                  placeholder="Company name"
                />
              </div>
              <div className="grid gap-2">
                <Label>Period</Label>
                <Input
                  value={editing.period}
                  onChange={(e) =>
                    setEditing({ ...editing, period: e.target.value })
                  }
                  placeholder="Jan 2024 - Present"
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="exp-current">Currently working here</Label>
                <input
                  id="exp-current"
                  type="checkbox"
                  checked={editing.current}
                  onChange={(e) =>
                    setEditing({ ...editing, current: e.target.checked })
                  }
                  className="size-4 rounded border-input"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDialog}>
              {editing?.id && !editing.id.startsWith("new-") ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
