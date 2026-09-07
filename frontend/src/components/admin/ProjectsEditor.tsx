"use client";

import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
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
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "@/hooks/queries/useProjects";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  featured: boolean;
  gradient: string;
  imageUrl: string | null;
}

const emptyProject: Omit<Project, "id"> = {
  title: "",
  description: "",
  tags: [],
  link: "",
  featured: false,
  gradient: "",
  imageUrl: null,
};

export function ProjectsEditor() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [items, setItems] = useState<Project[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const rawList = Array.isArray(projects)
    ? (projects as Record<string, unknown>[])
    : [];

  if (rawList.length > 0 && !initialized) {
    setItems(
      rawList.map((p) => ({
        id: String(p.id),
        title: String(p.title || ""),
        description: String(p.description || ""),
        tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
        link: String(p.link || ""),
        featured: Boolean(p.featured),
        gradient: String(p.gradient || ""),
        imageUrl: (p.imageUrl as string) || null,
      })),
    );
    setInitialized(true);
  }

  const handleSave = () => {
    for (const p of items) {
      const payload = {
        title: p.title,
        description: p.description,
        tags: p.tags,
        link: p.link || null,
        gradient: p.gradient || null,
        featured: p.featured,
        imageUrl: p.imageUrl || null,
      };
      if (p.id && !p.id.startsWith("new-")) {
        updateProject.mutate({ id: p.id, payload });
      } else {
        createProject.mutate(payload);
      }
    }
  };

  const openNew = () => {
    setEditing({ id: "", ...emptyProject });
    setTagInput("");
    setDialogOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing({ ...p });
    setTagInput("");
    setDialogOpen(true);
  };

  const handleSaveDialog = () => {
    if (!editing) return;
    if (editing.id && !editing.id.startsWith("new-")) {
      setItems(items.map((p) => (p.id === editing.id ? editing : p)));
    } else {
      setItems([...items, { ...editing, id: `new-${Date.now()}` }]);
    }
    setDialogOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    if (id && !id.startsWith("new-")) {
      deleteProject.mutate(id);
    }
    setItems(items.filter((p) => p.id !== id));
  };

  const addTag = () => {
    if (!tagInput.trim() || !editing) return;
    if (editing.tags.includes(tagInput.trim())) return;
    setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] });
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    if (!editing) return;
    setEditing({ ...editing, tags: editing.tags.filter((t) => t !== tag) });
  };

  const handleReorder = (orderedIds: string[]) => {
    const map = new Map(items.map((p) => [p.id, p]));
    setItems(
      orderedIds
        .map((id) => map.get(id))
        .filter((p): p is Project => Boolean(p)),
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
        <h2 className="text-lg font-semibold">Projects ({items.length})</h2>
        <Button size="sm" onClick={openNew}>
          <Plus className="size-3" />
          Add Project
        </Button>
      </div>

      <SortableList
        items={items.map((p) => ({ id: p.id }))}
        onReorder={handleReorder}
      >
        {items.map((project) => (
          <SortableItem key={project.id} id={project.id}>
            <Card className="mb-3">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  {project.title || "Untitled"}
                  {project.featured && (
                    <Badge variant="default">Featured</Badge>
                  )}
                </CardTitle>
                <CardAction>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => openEdit(project)}
                    >
                      <Pencil className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDeleteItem(project.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </SortableItem>
        ))}
      </SortableList>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No projects yet. Click "Add Project" to create one.
        </p>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={createProject.isPending || updateProject.isPending}
        >
          {(createProject.isPending || updateProject.isPending) && (
            <Loader2 className="size-3 animate-spin" />
          )}
          Save Projects
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing?.id && !editing.id.startsWith("new-")
                ? "Edit Project"
                : "New Project"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <ImageUpload
                value={editing.imageUrl}
                onChange={(url) => setEditing({ ...editing, imageUrl: url })}
                uploadType="project"
              />
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  placeholder="Project title"
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
                  placeholder="Describe the project..."
                />
              </div>
              <div className="grid gap-2">
                <Label>Link URL</Label>
                <Input
                  value={editing.link}
                  onChange={(e) =>
                    setEditing({ ...editing, link: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-2">
                <Label>Gradient</Label>
                <Input
                  value={editing.gradient}
                  onChange={(e) =>
                    setEditing({ ...editing, gradient: e.target.value })
                  }
                  placeholder="from-blue-500 to-purple-600"
                />
              </div>
              <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {editing.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X className="size-2" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="project-featured">Featured</Label>
                <input
                  id="project-featured"
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) =>
                    setEditing({ ...editing, featured: e.target.checked })
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
