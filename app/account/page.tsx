import Link from "next/link";
import { ActionCard } from "@/components/app/DemoCards";
import { AppTabPageShell } from "@/components/app/AppTabPageShell";
import { VehicleProfileManager } from "@/components/app/VehicleProfileManager";

const gatewayCards = [
  {
    title: "Customer Account",
    copy: "Request help, save vehicles, track service, manage profile and payment preferences.",
    href: "/account/customer",
    meta: "Request help · Saved vehicles · Live tracking",
  },
  {
    title: "Provider Account",
    copy: "Apply to join, manage jobs, set availability, and view provider status.",
    href: "/account/provider",
    meta: "Apply · Jobs · Availability",
  },
  {
    title: "Track Request",
    copy: "Enter phone or order number and track driver ETA, provider info, and route status.",
    href: "/track",
    meta: "Phone · Order number · ETA",
  },
];

export default function AccountPage() {
  return (
    <AppTabPageShell activeTab="Account" eyebrow="Access" title="Account" copy="Choose customer, provider, or tracking access from one clean RoadAssistNow account gateway.">
      <section className="grid gap-3 lg:grid-cols-3">
        {gatewayCards.map((card) => <ActionCard key={card.title} {...card} action={card.title} />)}
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/login" className="rounded-[1.6rem] border border-white/10 bg-white/[0.055] p-5 font-black text-white">Sign up / login</Link>
        <Link href="/request-service" className="rounded-[1.6rem] border border-white/10 bg-blue-500/16 p-5 font-black text-blue-100">Request service</Link>
        <Link href="/provider/apply" className="rounded-[1.6rem] border border-white/10 bg-white/[0.055] p-5 font-black text-white">Become a provider</Link>
        <Link href="/help" className="rounded-[1.6rem] border border-white/10 bg-white/[0.055] p-5 font-black text-white">Support</Link>
      </section>

      <div className="mt-5"><VehicleProfileManager /></div>
    </AppTabPageShell>
  );
}
