import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { demoServiceAreas } from '@/features/demo/platform-data';

export default function DriverServiceAreaPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Provider zones" title="Service area" copy="Service zones used by demo dispatch, pricing, and provider matching."><DemoSection title="Active zones"><DemoList items={demoServiceAreas.map((area) => ({ title: area, subtitle: 'Available for demo dispatch matching', right: 'On', tone: 'green' }))} /></DemoSection></DemoAppShell>;
}
