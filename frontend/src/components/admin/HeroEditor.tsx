"use client";

import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useHero, useUpdateHero } from "@/hooks/queries/useHero";

export function HeroEditor() {
  const { data: hero, isLoading } = useHero();
  const updateHero = useUpdateHero();

  const [greeting, setGreeting] = useState<string | null>(null);
  const [titles, setTitles] = useState<string[]>([]);
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [ctaPrimaryLabel, setCtaPrimaryLabel] = useState<string | null>(null);
  const [ctaPrimaryHref, setCtaPrimaryHref] = useState<string | null>(null);
  const [ctaSecondaryLabel, setCtaSecondaryLabel] = useState<string | null>(
    null,
  );
  const [ctaSecondaryHref, setCtaSecondaryHref] = useState<string | null>(null);
  const [availableForWork, setAvailableForWork] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const data = hero as Record<string, unknown> | undefined;

  if (data && !initialized) {
    setGreeting((data.greeting as string) ?? null);
    setTitles(Array.isArray(data.titles) ? (data.titles as string[]) : []);
    setSubtitle((data.subtitle as string) ?? null);
    setCtaPrimaryLabel((data.ctaPrimaryLabel as string) ?? null);
    setCtaPrimaryHref((data.ctaPrimaryHref as string) ?? null);
    setCtaSecondaryLabel((data.ctaSecondaryLabel as string) ?? null);
    setCtaSecondaryHref((data.ctaSecondaryHref as string) ?? null);
    setAvailableForWork(Boolean(data.availableForWork));
    setInitialized(true);
  }

  const handleSave = () => {
    updateHero.mutate({
      greeting,
      titles,
      subtitle,
      ctaPrimaryLabel,
      ctaPrimaryHref,
      ctaSecondaryLabel,
      ctaSecondaryHref,
      availableForWork,
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
          <CardTitle>Hero Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="hero-greeting">Greeting</Label>
            <Input
              id="hero-greeting"
              value={greeting ?? ""}
              onChange={(e) => setGreeting(e.target.value || null)}
              placeholder="Hello"
            />
          </div>

          <div className="grid gap-2">
            <Label>Titles</Label>
            {titles.map((title, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={title}
                  onChange={(e) => {
                    const next = [...titles];
                    next[i] = e.target.value;
                    setTitles(next);
                  }}
                  placeholder={`Title ${i + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setTitles(titles.filter((_, j) => j !== i))}
                >
                  <X className="size-3" />
                </Button>
              </div>
            ))}
            {titles.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => setTitles([...titles, ""])}
              >
                <Plus className="size-3" />
                Add Title
              </Button>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Input
              id="hero-subtitle"
              value={subtitle ?? ""}
              onChange={(e) => setSubtitle(e.target.value || null)}
              placeholder="Brief description"
            />
          </div>

          <div className="flex items-center gap-3">
            <Label htmlFor="hero-available">Available for work</Label>
            <input
              id="hero-available"
              type="checkbox"
              checked={availableForWork}
              onChange={(e) => setAvailableForWork(e.target.checked)}
              className="size-4 rounded border-input"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Call to Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Primary CTA</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={ctaPrimaryLabel ?? ""}
                onChange={(e) => setCtaPrimaryLabel(e.target.value || null)}
                placeholder="Label"
              />
              <Input
                value={ctaPrimaryHref ?? ""}
                onChange={(e) => setCtaPrimaryHref(e.target.value || null)}
                placeholder="URL"
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label>Secondary CTA</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={ctaSecondaryLabel ?? ""}
                onChange={(e) => setCtaSecondaryLabel(e.target.value || null)}
                placeholder="Label"
              />
              <Input
                value={ctaSecondaryHref ?? ""}
                onChange={(e) => setCtaSecondaryHref(e.target.value || null)}
                placeholder="URL"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateHero.isPending}>
          {updateHero.isPending && <Loader2 className="size-3 animate-spin" />}
          Save Hero
        </Button>
      </div>
    </div>
  );
}
