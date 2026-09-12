"use client";

import { FormBuilder } from "@/components/form";
import { projectSchema, ProjectTypeValues } from "@/schemas/project.schema";
import { useState } from "react";

export function ProjectsPage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
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
        isDialogOpen={isOpen}
        onDialogOpenChange={setIsOpen}
        onSubmit={(data) => {
          console.log("Submitted data:", data);
        }}
        withDialog
      />
    </>
  );
}
