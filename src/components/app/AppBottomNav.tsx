import Link from "next/link";
import { CarFront, Home, MapPinned, Plus, UserRound, Wrench } from "lucide-react";

export const appTabs = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Request", href: "/request", Icon: Plus },
  { label: "Track", href: "/track", Icon: MapPinned },
  { label: "Services", href: "/services", Icon: Wrench },
  { label: "Account", href: "/account", Icon: UserRound },
] as const;

export type AppTabLabel = (typeof appTabs)[number]["label"];

export function AppBottomNav({ activeTab }: { activeTab: AppTabLabel }) {
  return (
    <nav aria-label="Main app navigation" className="fixed inset-x-0 bottom-0 z-[70] translate-y-0 transform-gpu border-t border-white/10 bg-black/72 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur-2xl lg:hidden">
      <div className="mx-auto grid max-w-[460px] grid-cols-5 gap-1">
        {appTabs.map((tab) => {
          const isActive = tab.label === activeTab;
          const Icon = tab.Icon;
          return (
            <Link key={tab.label} href={tab.href} aria-current={isActive ? "page" : undefined} className={`relative flex h-14 w-full overflow-hidden rounded-2xl px-0 text-xs font-black transition ${isActive ? "text-black" : "text-white/52"}`}>
              {isActive && <span data-testid="active-tab-pill" aria-hidden="true" className="absolute inset-0 rounded-2xl bg-white" />}
              <span className="relative z-10 flex h-full w-full flex-col items-center justify-center">
                <Icon aria-hidden="true" size={19} strokeWidth={2.4} />
                <span className="mt-1">{tab.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function VehicleIcon() {
  return <CarFront aria-hidden="true" size={20} />;
}
