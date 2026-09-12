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
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "@/hooks/queries/useServices";

interface Service {
  id: string;
  title: string;
  description: string;
}

const emptyService: Omit<Service, "id"> = {
  title: "",
  description: "",
};

export function ServicesEditor() {
  const { data: services, isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [items, setItems] = useState<Service[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const rawList = Array.isArray(services)
    ? (services as Record<string, unknown>[])
    : [];

  if (rawList.length > 0 && !initialized) {
    setItems(
      rawList.map((s) => ({
        id: String(s.id),
        title: String(s.title || ""),
        description: String(s.description || ""),
      })),
    );
    setInitialized(true);
  }

  const handleSave = () => {
    for (const svc of items) {
      const payload = { title: svc.title, description: svc.description };
      if (svc.id && !svc.id.startsWith("new-")) {
        updateService.mutate({ id: svc.id, payload });
      } else {
        createService.mutate(payload);
      }
    }
  };

  const openNew = () => {
    setEditing({ id: "", ...emptyService });
    setDialogOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing({ ...s });
    setDialogOpen(true);
  };

  const handleSaveDialog = () => {
    if (!editing) return;
    if (editing.id && !editing.id.startsWith("new-")) {
      setItems(items.map((s) => (s.id === editing.id ? editing : s)));
    } else {
      setItems([...items, { ...editing, id: `new-${Date.now()}` }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (id && !id.startsWith("new-")) {
      deleteService.mutate(id);
    }
    setItems(items.filter((s) => s.id !== id));
  };

  const handleReorder = (orderedIds: string[]) => {
    const map = new Map(items.map((s) => [s.id, s]));
    setItems(
      orderedIds
        .map((id) => map.get(id))
        .filter((s): s is Service => Boolean(s)),
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
        <h2 className="text-lg font-semibold">Services ({items.length})</h2>
        <Button size="sm" onClick={openNew}>
          <Plus className="size-3" />
          Add Service
        </Button>
      </div>

      <SortableList
        items={items.map((s) => ({ id: s.id }))}
        onReorder={handleReorder}
      >
        {items.map((svc) => (
          <SortableItem key={svc.id} id={svc.id}>
            <Card className="mb-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">{svc.title}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(svc)}
                  >
                    <Pencil className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(svc.id)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {svc.description}
                </p>
              </CardContent>
            </Card>
          </SortableItem>
        ))}
      </SortableList>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No services yet.
        </p>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={createService.isPending || updateService.isPending}
        >
          {(createService.isPending || updateService.isPending) && (
            <Loader2 className="size-3 animate-spin" />
          )}
          Save Services
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing?.id && !editing.id.startsWith("new-")
                ? "Edit Service"
                : "New Service"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  placeholder="Service title"
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
