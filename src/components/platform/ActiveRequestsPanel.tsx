"use client";

import { useEffect, useState } from "react";
import { formatMoney } from "@/features/pricing/pricing-engine";
import { serviceOptions } from "@/features/tow-requests/mock-data";
import type { TowTrip } from "@/features/tow-requests/types";

type TowTripWithCustomer = TowTrip & { customer?: { name?: string; phone?: string } };

type ActiveRequestRow = {
  id: string;
  customer: string;
  service: string;
  status: string;
  total: number;
};

type ActiveRequestsPanelProps = {
  fallbackRequests: ActiveRequestRow[];
};

export function ActiveRequestsPanel({ fallbackRequests }: ActiveRequestsPanelProps) {
  const [requests, setRequests] = useState<ActiveRequestRow[]>(fallbackRequests);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/tow-requests")
      .then((response) => response.ok ? response.json() : null)
      .then((data: { requests?: TowTripWithCustomer[] } | null) => {
        if (cancelled || !data?.requests?.length) return;
        setRequests(data.requests.map((request) => ({
          id: request.id.slice(0, 8).toUpperCase(),
          customer: request.customer?.name || "Guest customer",
          service: serviceOptions.find((service) => service.id === request.quote.serviceType)?.label ?? request.quote.serviceType,
          status: request.status.replaceAll("_", " "),
          total: request.quote.totalCents,
        })));
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="mt-4">
      <div data-testid="active-requests-mobile-list" className="space-y-3 sm:hidden">
        {requests.map((request) => (
          <article key={request.id} className="rounded-[1.35rem] border border-white/10 bg-black/24 p-4 shadow-xl shadow-black/20">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-blue-200/52">Job</p>
                <p className="mt-1 break-all text-base font-black text-white">{request.id}</p>
              </div>
              <p className="shrink-0 rounded-full bg-emerald-300/12 px-3 py-1 text-sm font-black text-emerald-200">{formatMoney(request.total)}</p>
            </div>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="grid grid-cols-[5.6rem_1fr] gap-3">
                <dt className="font-black uppercase tracking-[0.16em] text-white/34">Customer</dt>
                <dd className="min-w-0 font-bold text-white/78">{request.customer}</dd>
              </div>
              <div className="grid grid-cols-[5.6rem_1fr] gap-3">
                <dt className="font-black uppercase tracking-[0.16em] text-white/34">Service</dt>
                <dd className="min-w-0 font-bold text-white/78">{request.service}</dd>
              </div>
              <div className="grid grid-cols-[5.6rem_1fr] gap-3">
                <dt className="font-black uppercase tracking-[0.16em] text-white/34">Status</dt>
                <dd className="min-w-0 font-bold capitalize text-white/78">{request.status}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div data-testid="active-requests-desktop-table" className="hidden overflow-hidden rounded-[1.5rem] border border-white/10 sm:block">
        <div className="grid grid-cols-[1fr_1.35fr_1.05fr_1.15fr_.8fr] bg-white/[0.055] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white/36"><span>Job</span><span>Customer</span><span>Service</span><span>Status</span><span className="text-right">Total</span></div>
        {requests.map((request) => <div key={request.id} className="grid grid-cols-[1fr_1.35fr_1.05fr_1.15fr_.8fr] items-center gap-3 border-t border-white/10 px-4 py-4 text-sm font-bold text-white/72"><span className="break-all text-white">{request.id}</span><span className="min-w-0">{request.customer}</span><span className="min-w-0">{request.service}</span><span className="min-w-0 capitalize">{request.status}</span><span className="text-right text-emerald-200">{formatMoney(request.total)}</span></div>)}
      </div>
    </div>
  );
}
