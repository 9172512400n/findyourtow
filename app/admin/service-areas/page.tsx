import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { demoServiceAreas } from '@/features/demo/platform-data';

export default function AdminServiceAreasPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Admin" title="Service areas" copy="Dispatch zones for coverage, pricing, and provider matching."><DemoSection title="Coverage zones"><DemoList items={demoServiceAreas.map((area) => ({ title: area, subtitle: 'Pricing and provider matching active in demo mode', right: 'Active', tone: 'green' }))} /></DemoSection></DemoAppShell>;
}
