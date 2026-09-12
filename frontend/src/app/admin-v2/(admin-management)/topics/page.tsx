import { MessagesSquare } from "lucide-react";

export default function TopicsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Topics</h2>
        <p className="text-sm text-muted-foreground">
          Guestbook discussion topics
        </p>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <MessagesSquare className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="h-4 w-48 rounded bg-muted" />
                <div className="mt-1 h-3 w-32 rounded bg-muted" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-8 rounded bg-muted" />
                <div className="h-5 w-14 rounded bg-muted" />
              </div>
            </div>
            <div className="pl-11 space-y-1">
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-2/3 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
