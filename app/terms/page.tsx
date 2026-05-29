import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function TermsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Legal" title="Terms" copy="Terms for the roadside marketplace demo, written as a production handoff baseline for legal review before public launch."><DemoSection title="RoadAssistNow demo terms"><div className="space-y-4 text-sm font-semibold leading-7 text-white/62"><p>This advanced demo shows roadside rescue, towing, payment authorization, dispatch, provider matching, and tracking workflows without processing real payments or dispatching real providers.</p><p>The marketplace terms cover service providers, cancellations, refunds, safety, insurance, roadside limitations, user responsibilities, and provider agreements for legal review.</p></div></DemoSection></DemoAppShell>;
}
