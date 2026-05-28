import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function DriverAccountPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Provider profile" title="Provider account" copy="Provider profile and dispatch preferences."><DemoSection title="Account readiness"><DemoList items={[{title:'Marcus Reed', subtitle:'Flatbed operator · Truck 204', right:'Online', tone:'green'}, {title:'Phone and email', subtitle:'Verified for customer and dispatch messages', right:'Verified'}, {title:'Payout account', subtitle:'Payout account ready', right:'Ready'}, {title:'Dispatch preferences', subtitle:'Flatbed, tow, motorcycle transport', right:'Active'}]} /></DemoSection></DemoAppShell>;
}
