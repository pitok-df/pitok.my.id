"use client";

import { GripVertical, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { SortableItem, SortableList } from "@/components/admin/v2/SortableList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateSkill,
  useDeleteSkill,
  useSkills,
  useUpdateSkill,
} from "@/hooks/queries/useSkills";

interface SkillItem {
  id: string;
  name: string;
  category: string;
  level?: number;
  order?: number;
}

export function SkillsEditor() {
  const { data: rawSkills, isLoading } = useSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const [categories, setCategories] = useState<
    { name: string; items: { id: string; name: string }[] }[]
  >([]);
  const [initialized, setInitialized] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCat, setNewSkillCat] = useState("");

  const skillsList = Array.isArray(rawSkills) ? (rawSkills as SkillItem[]) : [];

  if (skillsList.length > 0 && !initialized) {
    const catMap = new Map<
      string,
      { name: string; items: { id: string; name: string }[] }
    >();
    for (const s of skillsList) {
      const cat = s.category || "General";
      if (!catMap.has(cat)) {
        catMap.set(cat, { name: cat, items: [] });
      }
      catMap.get(cat)?.items.push({ id: s.id, name: s.name });
    }
    setCategories(Array.from(catMap.values()));
    setInitialized(true);
  }

  const handleSave = async () => {
    const currentKeys = new Set<string>();
    for (const cat of categories) {
      for (const item of cat.items) {
        currentKeys.add(`${cat.name}::${item.name}`);
      }
    }

    for (const raw of skillsList) {
      const key = `${raw.category}::${raw.name}`;
      if (!currentKeys.has(key)) {
        deleteSkill.mutate(raw.id);
      }
    }

    let order = 0;
    for (const cat of categories) {
      for (const item of cat.items) {
        const existing = skillsList.find(
          (s) => s.category === cat.name && s.name === item.name,
        );
        if (existing) {
          updateSkill.mutate({ id: existing.id, payload: { order } });
        } else {
          createSkill.mutate({ name: item.name, category: cat.name, order });
        }
        order++;
      }
    }
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    if (categories.some((c) => c.name === newCatName.trim())) return;
    setCategories([...categories, { name: newCatName.trim(), items: [] }]);
    setNewCatName("");
  };

  const removeCategory = (name: string) => {
    setCategories(categories.filter((c) => c.name !== name));
  };

  const addSkill = () => {
    if (!newSkillName.trim() || !newSkillCat) return;
    setCategories(
      categories.map((c) =>
        c.name === newSkillCat
          ? {
              ...c,
              items: [
                ...c.items,
                { id: `new-${Date.now()}`, name: newSkillName.trim() },
              ],
            }
          : c,
      ),
    );
    setNewSkillName("");
  };

  const removeSkill = (catName: string, skillId: string) => {
    setCategories(
      categories.map((c) =>
        c.name === catName
          ? { ...c, items: c.items.filter((i) => i.id !== skillId) }
          : c,
      ),
    );
  };

  const handleReorder = (catName: string, orderedIds: string[]) => {
    setCategories(
      categories.map((c) => {
        if (c.name !== catName) return c;
        const map = new Map(c.items.map((i) => [i.id, i]));
        return {
          ...c,
          items: orderedIds
            .map((id) => map.get(id))
            .filter((i): i is { id: string; name: string } => Boolean(i)),
        };
      }),
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
          <CardTitle>Skills Matrix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((cat) => (
            <Card key={cat.name}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-sm">
                  <Badge variant="secondary">{cat.name}</Badge>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    {cat.items.length} skills
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCategory(cat.name)}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <SortableList
                  items={cat.items.map((i) => ({ id: i.id }))}
                  onReorder={(ids) => handleReorder(cat.name, ids)}
                >
                  {cat.items.map((item) => (
                    <SortableItem key={item.id} id={item.id}>
                      <div className="flex items-center gap-2 py-1">
                        <GripVertical className="size-3 text-muted-foreground" />
                        <span className="text-sm flex-1">{item.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSkill(cat.name, item.id)}
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    </SortableItem>
                  ))}
                </SortableList>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-2">
            <Input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="New category name"
              className="w-48"
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCategory}
            >
              <Plus className="size-3" />
              Category
            </Button>
          </div>

          {categories.length > 0 && (
            <div className="flex gap-2 items-end">
              <div className="grid gap-2 flex-1">
                <Label htmlFor="new-skill-name">New Skill</Label>
                <Input
                  id="new-skill-name"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Skill name"
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                />
              </div>
              <div className="grid gap-2 w-48">
                <Label htmlFor="new-skill-cat">Category</Label>
                <select
                  id="new-skill-cat"
                  value={newSkillCat}
                  onChange={(e) => setNewSkillCat(e.target.value)}
                  className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
                >
                  <option value="">Select...</option>
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSkill}
              >
                <Plus className="size-3" />
                Skill
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={
            createSkill.isPending ||
            updateSkill.isPending ||
            deleteSkill.isPending
          }
        >
          {(createSkill.isPending ||
            updateSkill.isPending ||
            deleteSkill.isPending) && (
            <Loader2 className="size-3 animate-spin" />
          )}
          Save Skills
        </Button>
      </div>
    </div>
  );
}
