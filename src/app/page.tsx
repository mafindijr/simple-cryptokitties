import { AppShell } from "@/components/app-shell";
import { KittiesDashboard } from "@/components/kitties-dashboard";

export default function Page() {
  return (
    <AppShell>
      <KittiesDashboard />
    </AppShell>
  );
}
