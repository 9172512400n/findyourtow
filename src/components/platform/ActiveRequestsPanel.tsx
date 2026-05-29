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
    <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/10">
      <div className="grid grid-cols-5 bg-white/[0.055] px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-white/36"><span>Job</span><span>Customer</span><span>Service</span><span>Status</span><span className="text-right">Total</span></div>
      {requests.map((request) => <div key={request.id} className="grid grid-cols-5 items-center border-t border-white/10 px-4 py-4 text-sm font-bold text-white/72"><span className="text-white">{request.id}</span><span>{request.customer}</span><span>{request.service}</span><span className="capitalize">{request.status}</span><span className="text-right text-emerald-200">{formatMoney(request.total)}</span></div>)}
    </div>
  );
}
