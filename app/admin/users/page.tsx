import Link from 'next/link';
import { AdminUsersPanel } from '@/components/admin/AdminUsersPanel';
import { DemoAppShell } from '@/components/app/DemoAppShell';

export default function AdminUsersPage() {
  return (
    <DemoAppShell
      activeTab="Account"
      eyebrow="Admin support"
      title="Users & passwords"
      copy="A FindYourTow-style support panel for free app accounts: view users, inspect roles, and reset passwords when someone is locked out."
      actions={<Link href="/admin/dispatch" className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">Dispatch</Link>}
    >
      <AdminUsersPanel />
    </DemoAppShell>
  );
}
