import type { ReactNode } from "react";
import { AppBottomNav, type AppTabLabel } from "@/components/app/AppBottomNav";
import { BrandHomeLink } from "@/components/app/BrandHomeLink";

export function AppTabPageShell({ activeTab, eyebrow, title, copy, children }: { activeTab: AppTabLabel; eyebrow: string; title: string; copy: string; children: ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] pb-28 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_9%,rgba(59,130,246,.25),transparent_24%),radial-gradient(circle_at_15%_44%,rgba(16,185,129,.12),transparent_22%),linear-gradient(180deg,#050608_0%,#07101a_50%,#020306_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:54px_54px]" />

      <section className="mx-auto min-h-screen w-full max-w-5xl px-5 pb-10 pt-4 sm:px-8">
        <nav className="flex items-center justify-between py-2">
          <BrandHomeLink />
        </nav>

        <header className="pt-10 sm:pt-14">
          <p className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.26em] text-white/52">{eyebrow}</p>
          <h1 className="mt-4 text-balance text-5xl font-black leading-[0.9] tracking-[-0.065em] sm:text-7xl">{title}</h1>
          <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-white/58 sm:text-lg">{copy}</p>
        </header>

        <div className="mt-8 sm:mt-10">{children}</div>
      </section>

      <AppBottomNav activeTab={activeTab} />
    </main>
  );
}
