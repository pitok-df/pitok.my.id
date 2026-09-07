"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SortableItem, SortableList } from "@/components/admin/v2/SortableList";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateGallery,
  useDeleteGallery,
  useGallery,
  useUpdateGallery,
} from "@/hooks/queries/useGallery";

interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  date: string;
}

const emptyItem: Omit<GalleryItem, "id"> = {
  url: "",
  caption: "",
  date: "",
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export function GalleryEditor() {
  const { data: gallery, isLoading } = useGallery();
  const createGallery = useCreateGallery();
  const updateGallery = useUpdateGallery();
  const deleteGallery = useDeleteGallery();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const rawList = Array.isArray(gallery)
    ? (gallery as Record<string, unknown>[])
    : [];

  if (rawList.length > 0 && !initialized) {
    setItems(
      rawList.map((g) => ({
        id: String(g.id),
        url: String(g.url || ""),
        caption: String(g.caption || ""),
        date: String(g.date || ""),
      })),
    );
    setInitialized(true);
  }

  const handleSave = () => {
    for (const item of items) {
      const payload = {
        url: item.url,
        caption: item.caption,
        date: item.date || undefined,
      };
      if (item.id && !item.id.startsWith("new-")) {
        updateGallery.mutate({ id: item.id, payload });
      } else {
        createGallery.mutate(payload);
      }
    }
  };

  const openNew = () => {
    setEditing({ id: "", ...emptyItem });
    setDialogOpen(true);
  };

  const openEdit = (g: GalleryItem) => {
    setEditing({ ...g });
    setDialogOpen(true);
  };

  const handleSaveDialog = () => {
    if (!editing) return;
    if (editing.id && !editing.id.startsWith("new-")) {
      setItems(items.map((g) => (g.id === editing.id ? editing : g)));
    } else {
      setItems([...items, { ...editing, id: `new-${Date.now()}` }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (id && !id.startsWith("new-")) {
      deleteGallery.mutate(id);
    }
    setItems(items.filter((g) => g.id !== id));
  };

  const handleReorder = (orderedIds: string[]) => {
    const map = new Map(items.map((g) => [g.id, g]));
    setItems(
      orderedIds
        .map((id) => map.get(id))
        .filter((g): g is GalleryItem => Boolean(g)),
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
        <h2 className="text-lg font-semibold">
          Image Gallery ({items.length})
        </h2>
        <Button size="sm" onClick={openNew}>
          <Plus className="size-3" />
          Add Image
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SortableList
          items={items.map((g) => ({ id: g.id }))}
          onReorder={handleReorder}
        >
          {items.map((item) => {
            const src = item.url.startsWith("/")
              ? `${backendUrl}${item.url}`
              : item.url;
            return (
              <SortableItem key={item.id} id={item.id}>
                <Card className="overflow-hidden">
                  {src && (
                    <img
                      src={src}
                      alt={item.caption}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <CardHeader className="p-3">
                    <CardTitle className="text-xs line-clamp-1">
                      {item.caption}
                    </CardTitle>
                    <CardAction>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => openEdit(item)}
                        >
                          <Pencil className="size-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </CardAction>
                  </CardHeader>
                </Card>
              </SortableItem>
            );
          })}
        </SortableList>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No images yet.
        </p>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={createGallery.isPending || updateGallery.isPending}
        >
          {(createGallery.isPending || updateGallery.isPending) && (
            <Loader2 className="size-3 animate-spin" />
          )}
          Save Gallery
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing?.id && !editing.id.startsWith("new-")
                ? "Edit Image"
                : "New Image"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <ImageUpload
                value={editing.url || null}
                onChange={(url) => setEditing({ ...editing, url: url || "" })}
                uploadType="gallery"
              />
              <div className="grid gap-2">
                <Label>Caption</Label>
                <Input
                  value={editing.caption}
                  onChange={(e) =>
                    setEditing({ ...editing, caption: e.target.value })
                  }
                  placeholder="Image caption"
                />
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input
                  value={editing.date}
                  onChange={(e) =>
                    setEditing({ ...editing, date: e.target.value })
                  }
                  placeholder="Optional date"
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
