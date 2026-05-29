import Link from 'next/link';
import { Apple, BriefcaseBusiness, CarFront, CheckCircle2, ChevronRight, CreditCard, Edit3, Plus, ShieldCheck, UserRound, WalletCards } from 'lucide-react';
import { AppBottomNav } from '@/components/app/AppBottomNav';
import { BrandHomeLink } from '@/components/app/BrandHomeLink';

const progressSteps = [
  { label: 'Profile', status: 'complete' },
  { label: 'Vehicle', status: 'complete' },
  { label: 'Payment', status: 'complete' },
  { label: 'Ready', status: 'pending' },
] as const;

const checklistItems = [
  { title: 'Profile verified', copy: 'Name, phone, and email are ready for dispatch.', status: 'completed' },
  { title: 'Default vehicle selected', copy: 'Tow providers know what they are coming for.', status: 'completed' },
  { title: 'Payment ready', copy: 'Authorization can happen before provider matching.', status: 'completed' },
  { title: 'Emergency contact', copy: 'Optional, but recommended for safer roadside support.', status: 'optional' },
  { title: 'Start first request', copy: 'One more tap and the account becomes request-ready.', status: 'pending' },
] as const;

export default function AccountSetupPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] pb-28 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,.34),transparent_28%),radial-gradient(circle_at_15%_42%,rgba(16,185,129,.16),transparent_24%),linear-gradient(180deg,#050608_0%,#07101a_52%,#020306_100%)]" />
      <div className="fixed left-1/2 top-12 -z-10 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
      <div className="fixed inset-0 -z-10 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:54px_54px]" />

      <section className="mx-auto min-h-screen w-full max-w-6xl px-5 pb-10 pt-4 sm:px-8">
        <nav className="flex items-center justify-between gap-3 py-2">
          <BrandHomeLink />
          <Link href="/request" className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">Request help</Link>
        </nav>

        <header className="relative mt-8 overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.065] p-5 shadow-2xl shadow-blue-950/30 backdrop-blur-2xl sm:p-7">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-400/24 blur-3xl" />
          <div className="absolute bottom-4 left-8 h-24 w-24 rounded-full bg-emerald-300/14 blur-2xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="inline-flex rounded-full border border-white/10 bg-black/24 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.26em] text-white/56">Premium setup</p>
              <h1 className="mt-5 max-w-[18rem] text-balance text-5xl font-black leading-[0.88] tracking-[-0.07em] sm:max-w-2xl sm:text-7xl">Your account is almost ready.</h1>
              <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-white/58 sm:text-base">Finish the essentials once, then every roadside request can move straight into quote, payment authorization, and provider matching.</p>
            </div>
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[1.7rem] border border-white/12 bg-gradient-to-br from-white to-blue-100 text-blue-950 shadow-[0_22px_80px_rgba(59,130,246,.36)]">
              <UserRound size={34} />
            </div>
          </div>

          <div className="relative mt-6 rounded-[1.5rem] border border-white/10 bg-black/24 p-4">
            <div className="mb-3 flex items-center justify-between text-sm font-black">
              <span>80% complete</span>
              <span className="text-emerald-200">Almost there</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-emerald-300 via-blue-300 to-blue-500 shadow-[0_0_24px_rgba(96,165,250,.55)]" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {progressSteps.map((step) => (
                <div key={step.label} className="text-center">
                  <div className={`mx-auto grid h-9 w-9 place-items-center rounded-2xl border ${step.status === 'complete' ? 'border-emerald-200/30 bg-emerald-300 text-emerald-950 shadow-[0_0_24px_rgba(110,231,183,.28)]' : 'border-orange-200/30 bg-orange-300/16 text-orange-100'}`}>
                    {step.status === 'complete' ? <CheckCircle2 size={17} /> : <ShieldCheck size={17} />}
                  </div>
                  <p className="mt-2 text-[0.68rem] font-black text-white/62">{step.label}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-100/45">Checklist</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Setup checklist</h2>
              </div>
              <span className="rounded-full bg-emerald-300/14 px-3 py-1 text-xs font-black text-emerald-100">3 done</span>
            </div>
            <div className="space-y-3">
              {checklistItems.map((item) => <ChecklistCard key={item.title} {...item} />)}
            </div>
          </section>

          <div className="grid gap-5">
            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.10] to-white/[0.045] p-5 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-100/45">Default vehicle</p>
                  <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Vehicle preview</h2>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-black"><CarFront size={23} /></div>
              </div>
              <div className="mt-5 rounded-[1.6rem] border border-blue-200/16 bg-black/30 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-black tracking-[-0.035em]">2021 Toyota Camry</p>
                    <p className="mt-1 font-bold text-white/58">Black • Sedan</p>
                    <p className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/70">Plate: KRF-2048</p>
                  </div>
                  <Link href="/account/vehicles" className="grid h-11 w-11 place-items-center rounded-full bg-white text-black" aria-label="Edit vehicle"><Edit3 size={17} /></Link>
                </div>
                <Link href="/account/vehicles/add" className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.065] px-4 py-3 text-sm font-black text-white/78"><Plus size={16} /> Add another vehicle</Link>
              </div>
            </section>

            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111d]/88 p-5 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-100/45">Wallet</p>
                  <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Payment ready</h2>
                </div>
                <WalletCards className="text-blue-200" size={27} />
              </div>
              <div className="rounded-[1.7rem] bg-gradient-to-br from-slate-100 to-blue-100 p-4 text-black shadow-[0_24px_80px_rgba(59,130,246,.28)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-black/42">Primary card</p>
                    <p className="mt-6 text-xl font-black tracking-[-0.04em]">Visa ending in 4242</p>
                    <p className="mt-1 text-sm font-bold text-black/50">Authorized for demo requests</p>
                  </div>
                  <CreditCard size={26} />
                </div>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl bg-white/[0.065] p-4"><Apple size={20} /><span className="text-sm font-black">Apple Pay enabled</span></div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/[0.065] p-4"><BriefcaseBusiness size={20} /><span className="text-sm font-black">Business account option</span></div>
              </div>
              <Link href="/account/payments/add" className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-black"><Plus size={16} /> Add payment method</Link>
            </section>
          </div>
        </div>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-emerald-200/18 bg-gradient-to-br from-emerald-300/18 via-blue-500/12 to-white/[0.06] p-5 shadow-[0_28px_100px_rgba(16,185,129,.16)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100/62">Ready when you are</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">Complete setup by starting a request.</h2>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-white/56">The demo account has the core pieces in place. Start a service request now, or fine-tune profile, vehicle, and payment details first.</p>
            </div>
            <div className="grid gap-2 sm:min-w-64">
              <Link href="/request" aria-label="Start roadside request" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-black text-black shadow-[0_18px_60px_rgba(255,255,255,.18)]">Start roadside request <ChevronRight size={17} /></Link>
              <div className="grid grid-cols-3 gap-2 text-center text-[0.68rem] font-black text-white/58">
                <Link href="/account/profile" className="rounded-full bg-white/[0.06] px-2 py-2">Profile</Link>
                <Link href="/account/vehicles" className="rounded-full bg-white/[0.06] px-2 py-2">Vehicle</Link>
                <Link href="/account/payments" className="rounded-full bg-white/[0.06] px-2 py-2">Payment</Link>
              </div>
            </div>
          </div>
        </section>
      </section>
      <AppBottomNav activeTab="Account" />
    </main>
  );
}

function ChecklistCard({ title, copy, status }: { title: string; copy: string; status: 'completed' | 'pending' | 'optional' }) {
  const styles = {
    completed: 'border-emerald-200/22 bg-emerald-300/10 shadow-[0_0_34px_rgba(16,185,129,.12)] text-emerald-100',
    pending: 'border-orange-200/22 bg-orange-300/10 text-orange-100',
    optional: 'border-white/10 bg-white/[0.045] text-white/58',
  }[status];
  const label = status === 'completed' ? 'Complete' : status === 'pending' ? 'Pending' : 'Optional';

  return (
    <div className={`flex items-start gap-3 rounded-[1.35rem] border p-4 transition ${styles}`}>
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${status === 'completed' ? 'bg-emerald-300 text-emerald-950' : status === 'pending' ? 'bg-orange-300 text-orange-950' : 'bg-white/10 text-white/60'}`}>
        <CheckCircle2 size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="font-black text-white">{title}</p>
          <span className="rounded-full bg-black/20 px-2.5 py-1 text-[0.63rem] font-black">{label}</span>
        </div>
        <p className="mt-1 text-sm font-bold leading-5 text-white/48">{copy}</p>
      </div>
    </div>
  );
}
