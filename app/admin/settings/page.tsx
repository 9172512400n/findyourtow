import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function AdminSettingsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Admin" title="Settings" copy="Demo admin settings for marketplace operations."><DemoSection title="Operations settings"><DemoList items={[{title:'Demo mode', subtitle:'Supabase, Stripe, Mapbox keys not required', right:'On', tone:'green'}, {title:'Provider approval required', subtitle:'Drivers cannot go online until approved', right:'On'}, {title:'Manual assignment', subtitle:'Dispatchers can override closest-provider matching', right:'On'}, {title:'Cash/manual payment', subtitle:'Visible in demo mode only', right:'Demo', tone:'amber'}]} /></DemoSection></DemoAppShell>;
}
