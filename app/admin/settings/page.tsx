import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function AdminSettingsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Admin" title="Settings" copy="Demo operations settings for marketplace dispatch, approvals, assignment, and payment controls."><DemoSection title="Operations settings"><DemoList items={[{title:'Demo operations', subtitle:'Supabase, Stripe, and Mapbox keys are optional in demo mode', right:'On', tone:'green'}, {title:'Provider approval required', subtitle:'Drivers cannot go online until approved', right:'On'}, {title:'Manual assignment', subtitle:'Dispatchers can override closest-provider matching', right:'On'}, {title:'Cash/manual payment', subtitle:'Visible as an admin-controlled fallback', right:'Demo', tone:'amber'}]} /></DemoSection></DemoAppShell>;
}
