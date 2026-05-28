import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function AdminNotificationsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Admin" title="Notifications" copy="Operational messages for customers, providers, dispatchers, SMS, and email."><DemoSection title="Message log"><DemoList items={[{title:'Driver assigned SMS', subtitle:'Customer SMS sent for FYT-9284', right:'Demo', tone:'green'}, {title:'Receipt email', subtitle:'Receipt email queued for completed request', right:'Queued'}, {title:'Provider job push', subtitle:'Provider push job offer delivered', right:'Live'}]} /></DemoSection></DemoAppShell>;
}
