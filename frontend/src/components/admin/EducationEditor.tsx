"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { SortableItem, SortableList } from "@/components/admin/v2/SortableList";
import { Button } from "@/components/ui/button";
import {
  Card,
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
  useCreateEducation,
  useDeleteEducation,
  useEducations,
  useUpdateEducation,
} from "@/hooks/queries/useEducations";

interface Education {
  id: string;
  degree: string;
  school: string;
  period: string;
  description: string;
}

const emptyEdu: Omit<Education, "id"> = {
  degree: "",
  school: "",
  period: "",
  description: "",
};

export function EducationEditor() {
  const { data: educations, isLoading } = useEducations();
  const createEdu = useCreateEducation();
  const updateEdu = useUpdateEducation();
  const deleteEdu = useDeleteEducation();

  const [items, setItems] = useState<Education[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const rawList = Array.isArray(educations)
    ? (educations as Record<string, unknown>[])
    : [];

  if (rawList.length > 0 && !initialized) {
    setItems(
      rawList.map((e) => ({
        id: String(e.id),
        degree: String(e.degree || ""),
        school: String(e.school || ""),
        period: String(e.period || ""),
        description: String(e.description || ""),
      })),
    );
    setInitialized(true);
  }

  const handleSave = () => {
    for (const edu of items) {
      const payload = {
        degree: edu.degree,
        school: edu.school,
        period: edu.period,
        description: edu.description || null,
      };
      if (edu.id && !edu.id.startsWith("new-")) {
        updateEdu.mutate({ id: edu.id, payload });
      } else {
        createEdu.mutate(payload);
      }
    }
  };

  const openNew = () => {
    setEditing({ id: "", ...emptyEdu });
    setDialogOpen(true);
  };

  const openEdit = (e: Education) => {
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
      deleteEdu.mutate(id);
    }
    setItems(items.filter((e) => e.id !== id));
  };

  const handleReorder = (orderedIds: string[]) => {
    const map = new Map(items.map((e) => [e.id, e]));
    setItems(
      orderedIds
        .map((id) => map.get(id))
        .filter((e): e is Education => Boolean(e)),
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
        <h2 className="text-lg font-semibold">Education ({items.length})</h2>
        <Button size="sm" onClick={openNew}>
          <Plus className="size-3" />
          Add Education
        </Button>
      </div>

      <SortableList
        items={items.map((e) => ({ id: e.id }))}
        onReorder={handleReorder}
      >
        {items.map((edu) => (
          <SortableItem key={edu.id} id={edu.id}>
            <Card className="mb-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">{edu.degree}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(edu)}
                  >
                    <Pencil className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(edu.id)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {edu.school} · {edu.period}
                </p>
              </CardContent>
            </Card>
          </SortableItem>
        ))}
      </SortableList>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No education entries yet.
        </p>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={createEdu.isPending || updateEdu.isPending}
        >
          {(createEdu.isPending || updateEdu.isPending) && (
            <Loader2 className="size-3 animate-spin" />
          )}
          Save Education
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing?.id && !editing.id.startsWith("new-")
                ? "Edit Education"
                : "New Education"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Degree</Label>
                <Input
                  value={editing.degree}
                  onChange={(e) =>
                    setEditing({ ...editing, degree: e.target.value })
                  }
                  placeholder="Bachelor of Computer Science"
                />
              </div>
              <div className="grid gap-2">
                <Label>School</Label>
                <Input
                  value={editing.school}
                  onChange={(e) =>
                    setEditing({ ...editing, school: e.target.value })
                  }
                  placeholder="University name"
                />
              </div>
              <div className="grid gap-2">
                <Label>Period</Label>
                <Input
                  value={editing.period}
                  onChange={(e) =>
                    setEditing({ ...editing, period: e.target.value })
                  }
                  placeholder="2020 - 2024"
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
