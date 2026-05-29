import Link from 'next/link';
import type { ReactNode } from 'react';
import { AppBottomNav, type AppTabLabel } from '@/components/app/AppBottomNav';

export function DemoAppShell({ activeTab = 'Account', eyebrow, title, copy, children, actions }: { activeTab?: AppTabLabel; eyebrow: string; title: string; copy: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] pb-28 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_9%,rgba(59,130,246,.25),transparent_24%),radial-gradient(circle_at_15%_44%,rgba(16,185,129,.12),transparent_22%),linear-gradient(180deg,#050608_0%,#07101a_50%,#020306_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:54px_54px]" />
      <section className="mx-auto min-h-screen w-full max-w-6xl px-5 pb-10 pt-4 sm:px-8">
        <nav className="flex items-center justify-between gap-3 py-2">
          <Link href="/" aria-label="FindYourTow home" className="flex items-center gap-2.5">
            <span className="grid h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] shadow-[0_0_28px_rgba(56,189,248,0.18)] backdrop-blur-xl">
              <img src="/brand/findyourtow-logo-mark.png" alt="FindYourTow logo mark" className="h-full w-full scale-[1.55] object-cover drop-shadow-[0_0_18px_rgba(56,189,248,0.42)]" />
            </span>
            <span className="text-lg font-black tracking-[-0.045em] text-white">FindYourTow</span>
          </Link>
          {actions ?? <Link href="/request" className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">Request help</Link>}
        </nav>
        <header className="pt-10 sm:pt-14">
          <p className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.26em] text-white/52">{eyebrow}</p>
          <h1 className="mt-4 text-balance text-5xl font-black leading-[0.9] tracking-[-0.065em] sm:text-7xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white/58 sm:text-lg">{copy}</p>
        </header>
        <div className="mt-8 sm:mt-10">{children}</div>
      </section>
      <AppBottomNav activeTab={activeTab} />
    </main>
  );
}

export function DemoSection({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-2xl font-black tracking-[-0.04em]">{title}</h2>{action}</div>{children}</section>;
}
