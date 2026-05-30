import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { ProviderOnboardingForm } from '@/components/marketplace/ProviderOnboardingForm';

export default function ProviderOnboardingPage() {
  return (
    <DemoAppShell activeTab="Account" eyebrow="Provider onboarding" title="Provider onboarding" copy="Submit a real provider application for admin approval, including company, truck, service-area, and service capability details.">
      <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <DemoSection title="Approval path">
          <DemoList items={[
            { title: 'Business profile', subtitle: 'Company, contact, dispatch phone/email', right: 'Required', tone: 'blue' },
            { title: 'Truck capability', subtitle: 'Truck type, plate, service capabilities', right: 'Required', tone: 'blue' },
            { title: 'Admin approval', subtitle: 'Dispatcher approves before assignment', right: 'Gate', tone: 'green' },
            { title: 'Manual dispatch', subtitle: 'Approved providers can receive first-market jobs', right: 'Live' },
          ]} />
        </DemoSection>
        <DemoSection title="Real provider application">
          <ProviderOnboardingForm />
        </DemoSection>
      </div>
    </DemoAppShell>
  );
}
