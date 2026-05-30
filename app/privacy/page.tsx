import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function PrivacyPage() {
  return (
    <DemoAppShell activeTab="Account" eyebrow="Legal" title="Privacy" copy="How RoadAssistNow protects account data, vehicle details, precise location, payment metadata, and support communications.">
      <DemoSection title="Privacy overview">
        <div className="space-y-4 text-sm font-semibold leading-7 text-white/62">
          <p>RoadAssistNow collects only the information needed to quote, dispatch, track, support, and complete roadside service requests.</p>
          <p>Location data is used for pickup accuracy, provider matching, ETA updates, trip safety, and support review. Payment details are handled through secure payment providers; RoadAssistNow stores payment metadata rather than full card numbers.</p>
          <p>Customers can request account, vehicle, payment-method, and trip-history support through the help center.</p>
        </div>
      </DemoSection>
    </DemoAppShell>
  );
}
