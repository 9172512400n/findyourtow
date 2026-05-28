import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function NotificationsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Updates" title="Notifications" copy="Demo notification center for customer, provider, payment, and dispatch updates."><DemoSection title="Recent alerts"><DemoList items={[{title:'Provider assigned', subtitle:'Marcus Reed is 6 minutes away', right:'Now', tone:'green'}, {title:'Payment authorized', subtitle:'Visa ending 4242 authorized for demo request', right:'Wallet'}, {title:'Vehicle profile saved', subtitle:'Toyota Camry remains your default vehicle', right:'Account'}, {title:'Receipt ready', subtitle:'Past lockout receipt available in request history', right:'History'}]} /></DemoSection></DemoAppShell>;
}
