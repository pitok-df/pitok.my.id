export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account and site settings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-muted" />
              <div className="h-9 w-full rounded-md bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-9 w-full rounded-md bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-14 rounded bg-muted" />
              <div className="h-9 w-full rounded-md bg-muted" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5 space-y-4">
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="h-3 w-12 rounded bg-muted" />
              <div className="h-9 w-full rounded-md bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-9 w-full rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
