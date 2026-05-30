import { ActionCard } from "@/components/app/DemoCards";
import { AppTabPageShell } from "@/components/app/AppTabPageShell";

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

      <p className="mt-5 rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5 text-sm font-bold leading-6 text-white/48">
        Customer vehicles, profile details, and payment setup stay inside Customer Account. Provider onboarding stays inside Provider Account. Tracking stays inside Track Request.
      </p>
    </AppTabPageShell>
  );
}
