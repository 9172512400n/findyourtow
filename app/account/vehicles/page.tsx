import Link from 'next/link';
import { VehicleProfileManager } from '@/components/app/VehicleProfileManager';
import { DemoAppShell } from '@/components/app/DemoAppShell';

export default function AccountVehiclesPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Garage" title="My Vehicles" copy="Save multiple vehicles, set a default, and reuse vehicle snapshots during demo requests." actions={<Link href="/account/vehicles/add" className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">Add vehicle</Link>}><VehicleProfileManager /></DemoAppShell>;
}
