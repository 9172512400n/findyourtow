import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function MetricCard({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'green' | 'blue' | 'amber' }) {
  const toneClass = tone === 'green' ? 'text-emerald-200' : tone === 'blue' ? 'text-blue-200' : tone === 'amber' ? 'text-amber-200' : 'text-white';
  return <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.055] p-4"><p className={`text-2xl font-black ${toneClass}`}>{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/42">{label}</p></div>;
}

export function ActionCard({ title, copy, href, action, meta }: { title: string; copy: string; href?: string; action?: string; meta?: string }) {
  const content = <div className="group flex min-h-24 items-center justify-between gap-4 rounded-[1.6rem] border border-white/10 bg-white/[0.055] p-5 text-left transition hover:border-blue-300/40 hover:bg-blue-500/10"><div><p className="font-black text-white">{title}</p><p className="mt-1 text-sm font-bold leading-5 text-white/48">{copy}</p>{meta && <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-blue-100/52">{meta}</p>}</div><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-black transition group-hover:scale-105"><ArrowRight size={18} /></span></div>;
  if (href) return <Link href={href} aria-label={action ?? title}>{content}</Link>;
  return content;
}

export function StatusPill({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' | 'red' | 'white' }) {
  const cls = tone === 'green' ? 'bg-emerald-300/14 text-emerald-100' : tone === 'amber' ? 'bg-amber-300/14 text-amber-100' : tone === 'red' ? 'bg-red-300/14 text-red-100' : tone === 'white' ? 'bg-white text-black' : 'bg-blue-400/14 text-blue-100';
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${cls}`}>{tone === 'green' && <CheckCircle2 size={13} />}{children}</span>;
}

export function DemoList({ items }: { items: Array<{ title: string; subtitle: string; right?: string; tone?: 'green' | 'blue' | 'amber' | 'red' | 'white' }> }) {
  return <div className="space-y-3">{items.map((item) => <div key={`${item.title}-${item.subtitle}`} className="flex items-center justify-between gap-3 rounded-[1.35rem] border border-white/10 bg-black/20 p-4"><div><p className="font-black text-white">{item.title}</p><p className="mt-1 text-sm font-bold text-white/46">{item.subtitle}</p></div>{item.right && <StatusPill tone={item.tone ?? 'blue'}>{item.right}</StatusPill>}</div>)}</div>;
}
