"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSiteMeta, useUpdateSiteMeta } from "@/hooks/queries/useSiteMeta";

export function SiteMetaEditor() {
  const { data: meta, isLoading } = useSiteMeta();
  const updateMeta = useUpdateSiteMeta();

  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [initialized, setInitialized] = useState(false);

  const data = meta as Record<string, unknown> | undefined;

  if (data && !initialized) {
    setSiteTitle(String(data.siteTitle || ""));
    setSiteDescription(String(data.siteDescription || ""));
    setSiteUrl(String(data.siteUrl || ""));
    setInitialized(true);
  }

  const handleSave = () => {
    updateMeta.mutate({
      siteTitle,
      siteDescription,
      siteUrl,
    });
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
      <Card>
        <CardHeader>
          <CardTitle>SEO Registry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="meta-title">Site Title</Label>
            <Input
              id="meta-title"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="My Portfolio"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="meta-description">Site Description</Label>
            <Input
              id="meta-description"
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              placeholder="A brief description of your site"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="meta-url">Site URL</Label>
            <Input
              id="meta-url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateMeta.isPending}>
          {updateMeta.isPending && <Loader2 className="size-3 animate-spin" />}
          Save SEO
        </Button>
      </div>
    </div>
  );
}
