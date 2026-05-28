import { ActionCard, DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function DriverSupportPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Provider support" title="Support" copy="Provider support flow for dispatch issues, payments, documents, and safety."><div className="grid gap-4 lg:grid-cols-2"><DemoSection title="Get help"><div className="grid gap-3"><ActionCard title="Dispatch issue" copy="Contact demo dispatch for active job support." href="/admin/dispatch" /><ActionCard title="Payout question" copy="Review driver earnings and future Stripe Connect payouts." href="/driver/earnings" /><ActionCard title="Document review" copy="Check approval status." href="/driver/documents" /></div></DemoSection><DemoSection title="Support tickets"><DemoList items={[{title:'Missing gate code', subtitle:'Dispatch note sent to provider', right:'Open'}, {title:'Payout estimate', subtitle:'Connect payout will calculate after job completion', right:'Demo'}]} /></DemoSection></div></DemoAppShell>;
}
