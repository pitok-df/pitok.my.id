import { AppSidebar } from "@/components/app-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Pitok Admin",
    default: "Admin Management",
  },
  description: "Admin Management",
};

export default function AdminManagementLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className="mx-auto w-full max-w-6xl p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
