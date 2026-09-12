import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ProfileSummary() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-semibold">
          {/* <User className="size-6" /> */}
          <img
            src="/pito-desri-pauzi.webp"
            alt="Avatar"
            className="absolute rounded-full size-14 object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold leading-tight">
            Pito Desri Pauzi
          </h2>
          <p className="text-sm text-muted-foreground">Full Stack Developer</p>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            Building intuitive and high-performance digital experiences
          </p>
        </div>
        <Link
          href="/admin-v2/settings"
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Edit
          <ArrowRight className="size-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
