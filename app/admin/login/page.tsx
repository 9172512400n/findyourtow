import Link from 'next/link';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function AdminLoginPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Admin access" title="Admin login" copy="Demo dispatcher/admin login for future RBAC."><div className="mx-auto max-w-md"><DemoSection title="Command center"><input defaultValue="admin@findyourtow.app" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4" /><input type="password" defaultValue="demo-password" className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4" /><Link href="/admin/dispatch" className="mt-5 flex min-h-13 items-center justify-center rounded-full bg-blue-500 px-5 font-black text-white">Open dispatch</Link></DemoSection></div></DemoAppShell>;
}
