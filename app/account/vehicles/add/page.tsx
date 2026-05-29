import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DemoAppShell } from '@/components/app/DemoAppShell';
import { VehicleProfileManager } from '@/components/app/VehicleProfileManager';

export default function AddVehiclePage() {
  return (
    <DemoAppShell activeTab="Account" eyebrow="Garage" title="Add vehicle" copy="Create, edit, default, and reuse saved vehicle profiles for faster roadside requests.">
      <div className="mx-auto max-w-3xl space-y-4">
        <Link href="/account/vehicles" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm font-black text-white/72">
          <ArrowLeft size={16} /> Back to vehicles
        </Link>
        <VehicleProfileManager />
      </div>
    </DemoAppShell>
  );
}
