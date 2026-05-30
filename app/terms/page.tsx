import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function TermsPage() {
  return (
    <DemoAppShell activeTab="Account" eyebrow="Legal" title="Terms" copy="RoadAssistNow service terms for customers, providers, payments, cancellations, refunds, and roadside safety.">
      <div className="grid gap-4 lg:grid-cols-2">
        <DemoSection title="Service terms">
          <div className="space-y-4 text-sm font-semibold leading-7 text-white/62">
            <p>Customers receive an estimated quote before confirming a roadside request. Final service availability depends on provider acceptance, location, road safety, vehicle condition, and local regulations.</p>
            <p>Providers are responsible for licensing, insurance, equipment readiness, accurate status updates, and safe service completion.</p>
          </div>
        </DemoSection>
        <DemoSection title="Refunds and cancellations">
          <div id="refunds-cancellations" className="space-y-4 text-sm font-semibold leading-7 text-white/62 scroll-mt-24">
            <p>Customers may cancel before provider dispatch without a service charge. After a provider accepts or arrives, cancellation, wait-time, mileage, and completed-service fees may apply.</p>
            <p>Refund reviews cover duplicate charges, provider no-shows, incomplete service, pricing disputes, and safety-related escalations.</p>
          </div>
        </DemoSection>
      </div>
    </DemoAppShell>
  );
}
