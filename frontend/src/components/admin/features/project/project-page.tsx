"use client";

import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormBuilder } from "@/components/form";
import {
  projectSchema,
  ProjectTypeValues,
  updateProjectSchema,
} from "@/schemas/project.schema";
import { useSkills } from "@/hooks/queries/useSkills";
import {
  Project,
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "@/hooks/queries/useProjects";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProjectCard } from "./project-card";

export function ProjectPage() {
  const { data } = useSkills();
  const { data: projects, isLoading } = useProjects();
  const { mutateAsync: deleteProject, isPending: deleteLoading } =
    useDeleteProject();
  const { mutateAsync: updateProject } = useUpdateProject();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { mutateAsync, isPending } = useCreateProject();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [projectToProsess, setProjectToProcess] = useState<Project | null>(
    null,
  );

  const handleSave = async (data: FormData) => {
    try {
      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }
      if (projectToProsess?.id) {
        await updateProject({ id: projectToProsess.id, payload: data });
        toast.success("Project berhasil diperbarui");
      } else {
        await mutateAsync(data);
        toast.success("Project berhasil ditambahkan");
      }
      setIsFormOpen(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-sm text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} variant="default">
          <Plus className="size-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                <FolderOpen className="size-8 text-muted-foreground/50" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="h-5 w-12 rounded-full bg-muted" />
                  <div className="h-5 w-16 rounded-full bg-muted" />
                </div>
                <div className="h-4 w-4 rounded bg-muted" />
              </div>
            </div>
          ))}

        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onUpdate={(project) => {
              setProjectToProcess(project);
              setIsFormOpen(true);
            }}
            onDelete={(project) => {
              setProjectToProcess(project);
              setConfirmOpen(true);
            }}
          />
        ))}
      </div>

      <FormBuilder<ProjectTypeValues>
        className="w-full max-w-3xl"
        dialogTitle="Add Project"
        dialogDescription="Add a new project to your portfolio"
        gridCols={12}
        resetFormOnClose
        isLoading={isPending}
        useFormData
        schema={projectToProsess ? updateProjectSchema : projectSchema}
        isDialogOpen={isFormOpen}
        onDialogOpenChange={setIsFormOpen}
        onSubmit={handleSave}
        withDialog
        defaultValues={
          projectToProsess
            ? {
                title: projectToProsess.title,
                description: projectToProsess.description,
                skills: projectToProsess.skills.map((skill) => skill.name),
                demoUrl: projectToProsess.demoUrl,
                featured: projectToProsess.featured,
              }
            : { featured: false }
        }
        fields={[
          {
            name: "title",
            label: "Judul",
            placeholder: "Judul project",
            type: "text",
            colSpan: 12,
          },
          {
            name: "featured",
            label: "Featured",
            type: "dual-option-switch",
            className: "w-32",
            colSpan: 12,
            switchOptions: {
              left: { label: "No", value: false },
              right: { label: "Yes", value: true },
            },
          },
          {
            name: "description",
            label: "Deskripsi",
            colSpan: 12,
            type: "textarea",
          },
          {
            name: "skills",
            label: "Technologies",
            type: "multi-select",
            colSpan: 12,
            options:
              data?.map((skill) => ({
                label: skill.name,
                value: skill.name,
              })) || [],
          },
          { name: "demoUrl", label: "Demo URL", colSpan: 12, type: "text" },
          {
            name: "thumbnail",
            label: "Thumbnail",
            type: "file",
            colSpan: 12,
            maxSizes: 3 * 1024 * 1024,
          },
        ]}
      />

      {confirmOpen && projectToProsess?.id && (
        <ConfirmDialog
          title="Delete Project"
          description="Are you sure to delete this project?"
          open={confirmOpen}
          loading={deleteLoading}
          onOpenChange={setConfirmOpen}
          variant="destructive"
          onConfirm={async () => {
            await deleteProject(projectToProsess?.id);
            setConfirmOpen(false);
            toast.success("Project berhasil dihapus");
          }}
        />
      )}
    </div>
  );
}
