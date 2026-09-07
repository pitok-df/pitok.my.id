"use client";

import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { SortableItem, SortableList } from "@/components/admin/v2/SortableList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAbout, useUpdateAbout } from "@/hooks/queries/useAbout";

interface Fact {
  key: string;
  label: string;
  value: string;
}

export function AboutEditor() {
  const { data: about, isLoading } = useAbout();
  const updateAbout = useUpdateAbout();

  const [bio, setBio] = useState("");
  const [facts, setFacts] = useState<Fact[]>([]);
  const [initialized, setInitialized] = useState(false);

  const data = about as Record<string, unknown> | undefined;

  if (data && !initialized) {
    setBio(String(data.bio || ""));
    const rawFacts = Array.isArray(data.facts)
      ? (data.facts as Record<string, unknown>[])
      : [];
    setFacts(
      rawFacts.map((f) => ({
        key: String(f.key || crypto.randomUUID()),
        label: String(f.label || ""),
        value: String(f.value || ""),
      })),
    );
    setInitialized(true);
  }

  const handleSave = () => {
    updateAbout.mutate({
      bio,
      facts: facts.map((f, i) => ({
        key: f.key,
        label: f.label,
        value: f.value,
        order: i,
      })),
    });
  };

  const addFact = () => {
    setFacts([...facts, { key: crypto.randomUUID(), label: "", value: "" }]);
  };

  const removeFact = (key: string) => {
    setFacts(facts.filter((f) => f.key !== key));
  };

  const updateFact = (key: string, field: "label" | "value", val: string) => {
    setFacts(facts.map((f) => (f.key === key ? { ...f, [field]: val } : f)));
  };

  const handleReorder = (orderedIds: string[]) => {
    const map = new Map(facts.map((f) => [f.key, f]));
    setFacts(
      orderedIds.map((id) => map.get(id)).filter((f): f is Fact => Boolean(f)),
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
      <Card>
        <CardHeader>
          <CardTitle>About Bio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="about-bio">Biography</Label>
            <Textarea
              id="about-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={6}
              placeholder="Tell us about yourself..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Facts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <SortableList
            items={facts.map((f) => ({ id: f.key }))}
            onReorder={handleReorder}
          >
            {facts.map((fact) => (
              <SortableItem key={fact.key} id={fact.key}>
                <div className="flex gap-2 py-1">
                  <Input
                    value={fact.label}
                    onChange={(e) =>
                      updateFact(fact.key, "label", e.target.value)
                    }
                    placeholder="Label"
                    className="w-1/3"
                  />
                  <Input
                    value={fact.value}
                    onChange={(e) =>
                      updateFact(fact.key, "value", e.target.value)
                    }
                    placeholder="Value"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeFact(fact.key)}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              </SortableItem>
            ))}
          </SortableList>
          <Button type="button" variant="outline" size="sm" onClick={addFact}>
            <Plus className="size-3" />
            Add Fact
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateAbout.isPending}>
          {updateAbout.isPending && <Loader2 className="size-3 animate-spin" />}
          Save About
        </Button>
      </div>
    </div>
  );
}
