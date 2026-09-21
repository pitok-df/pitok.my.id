"use client";

import { Code2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FormBuilder } from "@/components/form";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  type Skill,
  useCreateSkill,
  useDeleteSkill,
  useSkills,
  useUpdateSkill,
} from "@/hooks/queries/useSkills";
import { skillCategories } from "@/lib/utils";
import { createSkillSchema } from "@/schemas/skill.schema";
import { SkillCard } from "./skill-card";

export default function SkillPage() {
  const { data: skills, isPending } = useSkills();
  const { mutateAsync: createSkill } = useCreateSkill();
  const { mutateAsync: updateSkill } = useUpdateSkill();
  const { mutateAsync: deleteSkill, isPending: isDeleting } = useDeleteSkill();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [formKey, setFormKey] = useState(1);

  const [deleting, setDeleting] = useState<Skill | null>(null);

  const isEditing = !!editing;

  const handleOpenCreate = () => {
    setEditing(null);
    setFormKey((prev) => prev + 1);
    setFormOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditing(skill);
    setFormKey((prev) => prev + 1);
    setFormOpen(true);
  };

  const handleSubmit = async (values: { name: string; category: string }) => {
    if (editing) {
      await updateSkill({ id: editing.id, payload: values });
      toast.success("Skill berhasil diupdate");
    } else {
      const res = await createSkill(values);
      toast.success(res.data.message);
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteSkill(deleting.id, {
      onSuccess: () => {
        toast.success("Skill berhasil dihapus");
        setDeleting(null);
      },
      onError: () => {
        toast.error("Gagal menghapus skill");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Skills</h2>
          <p className="text-sm text-muted-foreground">
            Manage your technical skills
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="size-4 mr-2" />
          Add Skill
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isPending &&
          Array.from({ length: 9 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: loading skeleton, stable order
              key={i}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Code2 className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-3 w-16 rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}

        {skills &&
          skills.length > 0 &&
          skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={handleOpenEdit}
              onDelete={setDeleting}
            />
          ))}
      </div>

      {/* Create / Edit Form */}
      <FormBuilder
        key={formKey}
        schema={createSkillSchema}
        defaultValues={
          editing
            ? { name: editing.name, category: editing.category }
            : { name: "", category: "" }
        }
        isDialogOpen={formOpen}
        onDialogOpenChange={setFormOpen}
        withDialog
        dialogTitle={isEditing ? "Edit Skill" : "Add Skill"}
        onSubmit={handleSubmit}
        fields={[
          { label: "Name", name: "name", type: "text" },
          {
            label: "Category",
            name: "category",
            type: "select",
            options: skillCategories.map((category) => ({
              label: category.name,
              value: category.name,
            })),
          },
        ]}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus skill?"
        description={`Skill "${deleting?.name}" akan dihapus permanen.`}
        confirmText="Hapus"
        icon={<Trash2 className="size-5 text-destructive" />}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
