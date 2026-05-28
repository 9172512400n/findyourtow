import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function PrivacyPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Legal" title="Privacy" copy="Privacy commitments for account data, vehicle details, location sharing, payments, and support."><DemoSection title="Privacy overview"><div className="space-y-4 text-sm font-semibold leading-7 text-white/62"><p>This demo stores temporary local browser state for vehicles, payments, request flow, and preferences. It does not require Supabase, Stripe, Mapbox, or messaging credentials.</p><p>This policy covers account data, vehicle data, precise location, provider location, payment metadata, communications, retention, deletion, and support workflows for the production handoff.</p></div></DemoSection></DemoAppShell>;
}
