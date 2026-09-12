"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SortableItem, SortableList } from "@/components/admin/v2/SortableList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  useCertificates,
  useCreateCertificate,
  useDeleteCertificate,
  useUpdateCertificate,
} from "@/hooks/queries/useCertificates";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string | null;
}

const emptyCert: Omit<Certificate, "id"> = {
  title: "",
  issuer: "",
  date: "",
  imageUrl: null,
};

export function CertificatesEditor() {
  const { data: certificates, isLoading } = useCertificates();
  const createCert = useCreateCertificate();
  const updateCert = useUpdateCertificate();
  const deleteCert = useDeleteCertificate();

  const [items, setItems] = useState<Certificate[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const rawList = Array.isArray(certificates)
    ? (certificates as Record<string, unknown>[])
    : [];

  if (rawList.length > 0 && !initialized) {
    setItems(
      rawList.map((c) => ({
        id: String(c.id),
        title: String(c.title || ""),
        issuer: String(c.issuer || ""),
        date: String(c.date || ""),
        imageUrl: (c.imageUrl as string) || null,
      })),
    );
    setInitialized(true);
  }

  const handleSave = () => {
    for (const cert of items) {
      const payload = {
        title: cert.title,
        issuer: cert.issuer,
        date: cert.date,
        imageUrl: cert.imageUrl || null,
      };
      if (cert.id && !cert.id.startsWith("new-")) {
        updateCert.mutate({ id: cert.id, payload });
      } else {
        createCert.mutate(payload);
      }
    }
  };

  const openNew = () => {
    setEditing({ id: "", ...emptyCert });
    setDialogOpen(true);
  };

  const openEdit = (c: Certificate) => {
    setEditing({ ...c });
    setDialogOpen(true);
  };

  const handleSaveDialog = () => {
    if (!editing) return;
    if (editing.id && !editing.id.startsWith("new-")) {
      setItems(items.map((c) => (c.id === editing.id ? editing : c)));
    } else {
      setItems([...items, { ...editing, id: `new-${Date.now()}` }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (id && !id.startsWith("new-")) {
      deleteCert.mutate(id);
    }
    setItems(items.filter((c) => c.id !== id));
  };

  const handleReorder = (orderedIds: string[]) => {
    const map = new Map(items.map((c) => [c.id, c]));
    setItems(
      orderedIds
        .map((id) => map.get(id))
        .filter((c): c is Certificate => Boolean(c)),
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
        <h2 className="text-lg font-semibold">Credentials ({items.length})</h2>
        <Button size="sm" onClick={openNew}>
          <Plus className="size-3" />
          Add Certificate
        </Button>
      </div>

      <SortableList
        items={items.map((c) => ({ id: c.id }))}
        onReorder={handleReorder}
      >
        {items.map((cert) => (
          <SortableItem key={cert.id} id={cert.id}>
            <Card className="mb-3">
              <CardHeader>
                <CardTitle className="text-sm">{cert.title}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(cert)}
                  >
                    <Pencil className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {cert.issuer} · {cert.date}
                </p>
              </CardContent>
            </Card>
          </SortableItem>
        ))}
      </SortableList>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No certificates yet.
        </p>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={createCert.isPending || updateCert.isPending}
        >
          {(createCert.isPending || updateCert.isPending) && (
            <Loader2 className="size-3 animate-spin" />
          )}
          Save Certificates
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing?.id && !editing.id.startsWith("new-")
                ? "Edit Certificate"
                : "New Certificate"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <ImageUpload
                value={editing.imageUrl}
                onChange={(url) => setEditing({ ...editing, imageUrl: url })}
                uploadType="certificate"
              />
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  placeholder="Certificate title"
                />
              </div>
              <div className="grid gap-2">
                <Label>Issuer</Label>
                <Input
                  value={editing.issuer}
                  onChange={(e) =>
                    setEditing({ ...editing, issuer: e.target.value })
                  }
                  placeholder="Issuing organization"
                />
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input
                  value={editing.date}
                  onChange={(e) =>
                    setEditing({ ...editing, date: e.target.value })
                  }
                  placeholder="Jan 2024"
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
