import { Images, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gallery</h2>
          <p className="text-sm text-muted-foreground">
            Manage your photo gallery
          </p>
        </div>
        <Button>
          <Upload className="size-4 mr-2" />
          Upload Image
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
          >
            <div className="flex h-full items-center justify-center">
              <Images className="size-8 text-muted-foreground/50" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="h-3 w-20 rounded bg-white/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
