import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { demoServiceAreas } from '@/features/demo/platform-data';

export default function AdminServiceAreasPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Admin" title="Service areas" copy="Demo dispatch zones ready for future geospatial Postgres/Mapbox polygons."><DemoSection title="Coverage zones"><DemoList items={demoServiceAreas.map((area) => ({ title: area, subtitle: 'Pricing and provider matching active in demo mode', right: 'Active', tone: 'green' }))} /></DemoSection></DemoAppShell>;
}
