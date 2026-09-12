"use client";

import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormBuilder } from "@/components/form";
import { projectSchema, ProjectTypeValues } from "@/schemas/project.schema";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-sm text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        <Button>
          <Plus className="size-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
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
      </div>

      <FormBuilder<ProjectTypeValues>
        className="w-full max-w-3xl"
        dialogTitle="Add Project"
        dialogDescription="Add a new project to your portfolio"
        gridCols={12}
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
            name: "technologies",
            label: "Technologies",
            type: "multi-select",
            colSpan: 12,
            options: [
              { label: "React", value: "react" },
              { label: "Next.js", value: "nextjs" },
              { label: "TypeScript", value: "typescript" },
              { label: "Tailwind CSS", value: "tailwindcss" },
              { label: "Node.js", value: "nodejs" },
              { label: "Express.js", value: "expressjs" },
              { label: "MongoDB", value: "mongodb" },
              { label: "PostgreSQL", value: "postgresql" },
              { label: "GraphQL", value: "graphql" },
              { label: "REST API", value: "restapi" },
            ],
          },
          { name: "demoUrl", label: "Demo URL", colSpan: 12, type: "text" },
          {
            name: "thumbnail",
            label: "Thumbnail",
            type: "text",
            colSpan: 12,
            // maxSizes: 1 * 1024 * 1024,
          },
        ]}
        schema={projectSchema}
        isDialogOpen={true}
        onDialogOpenChange={() => {}}
        onSubmit={(data) => {
          console.log("Submitted data:", data);
        }}
        withDialog
      />
    </div>
  );
}
