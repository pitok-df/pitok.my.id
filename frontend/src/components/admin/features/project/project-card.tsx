import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "@/hooks/queries/useProjects";
import { MoreVertical, Pencil, Star, Trash2 } from "lucide-react";

export function ProjectCard({
  project,
  onUpdate,
  onDelete,
}: {
  project: Project;
  onUpdate: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  return (
    <div
      key={project.id}
      className="group relative rounded-lg border bg-card p-4 space-y-4"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-3 top-3 z-10 h-7 w-7 rounded-full md:opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onUpdate(project)}>
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(project)}>
            <Trash2 className="h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="relative -mx-4 -mt-4 overflow-hidden rounded-t-lg">
        <img
          className="aspect-video w-full bg-muted object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          src={project.thumbnail}
          alt={project.title}
        />

        {project.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-background/0 p-1 text-xs font-medium shadow-sm backdrop-blur">
            <Star className="h-5 w-5 text-amber-600" fill="orange" />
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-semibold leading-tight tracking-tight">
          {project.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.skills.map((skill) => (
          <span
            key={skill.id}
            className="rounded-full h-5 border border-amber-400 px-2 bg-amber-400/10 text-xs font-medium"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}
