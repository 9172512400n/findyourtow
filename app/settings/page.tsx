import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function SettingsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Preferences" title="Settings" copy="Account preferences for location sharing, trip updates, receipts, and business billing."><DemoSection title="App settings"><DemoList items={[{title:'Location sharing', subtitle:'Enabled for active requests only', right:'On', tone:'green'}, {title:'SMS updates', subtitle:'Text message trip updates', right:'Demo'}, {title:'Email receipts', subtitle:'Email receipt delivery', right:'Demo'}, {title:'Business account billing', subtitle:'Show business payment method in checkout', right:'On', tone:'green'}]} /></DemoSection></DemoAppShell>;
}
