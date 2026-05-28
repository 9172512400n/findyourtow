import Link from "next/link";

export const appTabs = [
  { label: "Home", href: "/", icon: "⌂" },
  { label: "Request", href: "/request", icon: "+" },
  { label: "Track", href: "/track", icon: "◉" },
  { label: "Services", href: "/services", icon: "▦" },
  { label: "Account", href: "/account", icon: "◌" },
] as const;

export type AppTabLabel = (typeof appTabs)[number]["label"];

export function AppBottomNav({ activeTab }: { activeTab: AppTabLabel }) {
  return (
    <nav aria-label="Main app navigation" className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-black/72 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur-2xl lg:hidden">
      <div className="mx-auto grid max-w-[460px] grid-cols-5 gap-1">
        {appTabs.map((tab) => {
          const isActive = tab.label === activeTab;
          return (
            <Link key={tab.label} href={tab.href} aria-current={isActive ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center rounded-2xl text-xs font-black transition ${isActive ? "bg-white text-black" : "text-white/52"}`}>
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className="mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
