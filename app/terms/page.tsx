import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function TermsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Legal" title="Terms" copy="Demo terms page placeholder. Final legal language should be reviewed before public launch."><DemoSection title="FindYourTow demo terms"><div className="space-y-4 text-sm font-semibold leading-7 text-white/62"><p>This advanced demo shows roadside rescue, towing, payment authorization, dispatch, provider matching, and tracking workflows without processing real payments or dispatching real providers.</p><p>Future production terms should cover service providers, cancellations, refunds, safety, insurance, roadside limitations, user responsibilities, and marketplace/provider agreements.</p></div></DemoSection></DemoAppShell>;
}
