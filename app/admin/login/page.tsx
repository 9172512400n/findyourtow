import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function AdminLoginPage() {
  return (
    <DemoAppShell activeTab="Account" eyebrow="Admin access" title="Admin login" copy="Owner and dispatcher access for RoadAssistNow support, user visibility, password resets, and dispatch operations.">
      <div className="mx-auto max-w-md">
        <DemoSection title="Command center">
          <AdminLoginForm />
        </DemoSection>
      </div>
    </DemoAppShell>
  );
}
