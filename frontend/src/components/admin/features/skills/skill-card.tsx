import { Code2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Skill } from "@/hooks/queries/useSkills";
import { mapCategoryIcon } from "@/lib/utils";

interface SkillCardProps {
  skill: Skill;
  onEdit?: (skill: Skill) => void;
  onDelete?: (skill: Skill) => void;
}

export function SkillCard({ skill, onEdit, onDelete }: SkillCardProps) {
  const Icon = mapCategoryIcon[skill.category] || Code2;
  return (
    <div className="group relative rounded-lg border bg-card p-4 space-y-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-3 top-3 z-10 h-7 w-7 rounded-full opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit?.(skill)}>
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete?.(skill)}>
            <Trash2 className="h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-base font-semibold leading-tight tracking-tight">
            {skill.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {skill.category}
          </p>
        </div>
      </div>
    </div>
  );
}
