import Link from 'next/link';
import { MapExperience } from '@/components/platform/MapExperience';
import { StatusTimeline } from '@/components/platform/StatusTimeline';
import { DemoList } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { demoProviders, demoRequests } from '@/features/demo/platform-data';
import { buildMockTrip } from '@/features/tow-requests/mock-data';

export default function DriverActivePage() {
  const request = demoRequests[0];
  const provider = demoProviders[0];
  const trip = buildMockTrip({ customerName: request.customer, phone: '+15555550100', serviceType: request.serviceType, pickupAddress: request.pickup, dropoffAddress: request.dropoff, vehicleMake: request.vehicleSnapshot.make, vehicleModel: request.vehicleSnapshot.model, vehicleType: request.vehicleSnapshot.vehicleType });
  return <DemoAppShell activeTab="Account" eyebrow="Active provider job" title="Active job" copy="Driver route, customer, vehicle, and status controls are wired as a complete demo."><div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><MapExperience drivers={[provider]} focus="driver" title="Active job route" progress={46} /><div className="space-y-4"><DemoSection title="Job details"><DemoList items={[{title:'Customer info', subtitle:`${request.customer} · masked phone ready for Twilio`, right:'Contact'}, {title:'Vehicle info', subtitle:`${request.vehicle} · ${request.vehicleSnapshot.color} · ${request.vehicleSnapshot.plate}`, right:'Verified', tone:'green'}, {title:'Pickup', subtitle:request.pickup, right:'Route'}, {title:'Drop-off', subtitle:request.dropoff ?? 'Location service only', right:'Demo'}]} /><div className="mt-4 grid grid-cols-2 gap-3">{['On my way','Arrived','Loaded','Delivered'].map((status) => <button key={status} className="rounded-2xl bg-white/10 px-4 py-4 font-black">{status}</button>)}</div></DemoSection><DemoSection title="Timeline"><StatusTimeline timeline={trip.timeline} /></DemoSection><Link href="/driver/earnings" className="flex min-h-13 items-center justify-center rounded-full bg-blue-500 px-5 font-black text-white">Complete demo job</Link></div></div></DemoAppShell>;
}
