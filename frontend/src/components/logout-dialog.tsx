"use client";

import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLogout } from "@/hooks/queries/useAuth";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Berhasil keluar");
        onOpenChange(false);
        router.push("/admin-v2/login");
        router.refresh();
      },
      onError: () => {
        toast.error("Gagal keluar, coba lagi");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10 sm:mx-0">
            <LogOut className="size-5 text-destructive" />
          </div>
          <DialogTitle>Keluar dari Admin?</DialogTitle>
          <DialogDescription>
            Anda akan keluar dari sesi admin dan perlu login kembali untuk
            mengakses dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <LogOut className="size-4" />
                Keluar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper trigger button - opsional, bisa dipakai di sidebar/footer
interface LogoutButtonProps extends React.ComponentProps<typeof Button> {
  onLoggedOut?: () => void;
}

export function LogoutButton({ onLoggedOut, ...props }: LogoutButtonProps) {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();

  const handleClick = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Berhasil keluar");
        onLoggedOut?.();
        router.push("/admin-v2/login");
        router.refresh();
      },
      onError: () => toast.error("Gagal keluar, coba lagi"),
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending} {...props}>
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}
      Keluar
    </Button>
  );
}
