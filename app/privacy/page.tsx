import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function PrivacyPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Legal" title="Privacy" copy="Demo privacy page placeholder for future production policy."><DemoSection title="Privacy overview"><div className="space-y-4 text-sm font-semibold leading-7 text-white/62"><p>This demo stores temporary local browser state for vehicles, payments, request flow, and preferences. It does not require Supabase, Stripe, Mapbox, or messaging credentials.</p><p>Production privacy language should cover account data, vehicle data, precise location, provider location, payment metadata, communications, retention, deletion, and support workflows.</p></div></DemoSection></DemoAppShell>;
}
