import Link from 'next/link';
import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function AdminRefundsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Admin" title="Refund demo screen" copy="Refund workflow placeholder for Stripe refunds, disputes, and audit logs."><DemoSection title="Refund queue"><DemoList items={[{title:'FYT-9218 partial refund', subtitle:'Lockout completed, customer requested fee review', right:'Review', tone:'amber'}, {title:'FYT-9180 service credit', subtitle:'Fuel delivery delay credit demo', right:'Credit'}]} /><Link href="/admin/payments" className="mt-5 flex min-h-13 items-center justify-center rounded-full bg-blue-500 px-5 font-black text-white">Back to payment records</Link></DemoSection></DemoAppShell>;
}
