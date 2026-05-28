import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function SettingsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Preferences" title="Settings" copy="Demo account preferences ready for profile storage later."><DemoSection title="App settings"><DemoList items={[{title:'Location sharing', subtitle:'Enabled for active requests only', right:'On', tone:'green'}, {title:'SMS updates', subtitle:'Future Twilio messages', right:'Demo'}, {title:'Email receipts', subtitle:'Future Resend receipts', right:'Demo'}, {title:'Business account billing', subtitle:'Show business payment method in checkout', right:'On', tone:'green'}]} /></DemoSection></DemoAppShell>;
}
