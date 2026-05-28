import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function DriverTruckPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Provider truck" title="Truck info" copy="Provider truck capability setup used by dispatch matching."><DemoSection title="Truck 204"><DemoList items={[{title:'Truck type', subtitle:'Flatbed', right:'Active', tone:'green'}, {title:'Plate', subtitle:'DMO 204', right:'Verified'}, {title:'Capacity', subtitle:'10,000 lbs demo capacity', right:'Ready'}, {title:'Services', subtitle:'Standard tow, flatbed, motorcycle, transport', right:'4'}, {title:'Equipment', subtitle:'Winch, soft straps, dollies, jump pack', right:'Ready'}]} /></DemoSection></DemoAppShell>;
}
