import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { completeServiceCatalog } from '@/features/demo/platform-data';
import { formatMoney } from '@/features/pricing/pricing-engine';

export default function AdminPricingPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Admin" title="Pricing rules" copy="Demo pricing table ready for real database-controlled service rules."><DemoSection title="Service pricing"><DemoList items={completeServiceCatalog.map((service) => ({ title: service.label, subtitle: service.description, right: `${formatMoney(service.baseCents)} base`, tone: service.routeRequired ? 'blue' : 'green' }))} /></DemoSection></DemoAppShell>;
}
