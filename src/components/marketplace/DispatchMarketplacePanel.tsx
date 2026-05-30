"use client";

import { useEffect, useMemo, useState } from "react";
import { formatMoney } from "@/features/pricing/pricing-engine";
import type { DispatchRequestSummary, MarketplaceDriverSummary } from "@/features/marketplace/supabase-repository";

type Props = {
  initialRequests: DispatchRequestSummary[];
  initialDrivers: MarketplaceDriverSummary[];
};

export function DispatchMarketplacePanel({ initialRequests, initialDrivers }: Props) {
  const [requests, setRequests] = useState(initialRequests);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/dispatch")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (cancelled || !data) return;
        if (Array.isArray(data.requests)) setRequests(data.requests);
        if (Array.isArray(data.drivers)) setDrivers(data.drivers);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  const approvedDrivers = useMemo(() => drivers.filter((driver) => ["APPROVED", "ONLINE", "OFFLINE"].includes(driver.status)), [drivers]);
  const pendingDrivers = drivers.filter((driver) => driver.status === "PENDING_APPROVAL");

  async function approve(driverId: string, status: "APPROVED" | "REJECTED") {
    setMessage("Updating provider approval…");
    const response = await fetch("/api/admin/drivers", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ driverId, status }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) return setMessage(data?.error ?? "Could not update provider");
    setDrivers((current) => current.map((driver) => driver.id === driverId ? data.driver : driver));
    setMessage(status === "APPROVED" ? "Provider approved for manual dispatch." : "Provider rejected.");
  }

  async function assign(towRequestId: string, driverId: string) {
    setMessage("Assigning provider…");
    const response = await fetch("/api/admin/dispatch", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ towRequestId, driverId }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) return setMessage(data?.error ?? "Could not assign provider");
    setRequests((current) => current.map((request) => request.id === towRequestId ? data.request : request));
    setMessage("Provider assigned. Driver can now accept and update the job.");
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/50">Real dispatch queue</p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.03em]">Customer requests</h2>
          </div>
          <span className="rounded-full bg-emerald-300/12 px-3 py-1 text-xs font-black text-emerald-200">{requests.length} live</span>
        </div>
        <div className="mt-4 space-y-3">
          {requests.length ? requests.map((request) => (
            <article key={request.id} className="rounded-2xl bg-black/24 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-black">{request.customer}</p>
                  <p className="text-sm font-bold text-white/54">{request.shortId} · {request.service} · {request.status.replaceAll("_", " ")}</p>
                  <p className="mt-1 text-sm font-bold text-white/44">{request.pickup}{request.dropoff ? ` → ${request.dropoff}` : ""}</p>
                </div>
                <p className="rounded-full bg-emerald-300/12 px-3 py-1 text-sm font-black text-emerald-200">{formatMoney(request.totalCents)}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {approvedDrivers.map((driver) => (
                  <button key={driver.id} onClick={() => assign(request.id, driver.id)} className="rounded-full bg-blue-500 px-4 py-2 text-sm font-black text-white">
                    Assign {driver.name}
                  </button>
                ))}
                {request.assignedDriver ? <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/70">Assigned: {request.assignedDriver}</span> : null}
              </div>
            </article>
          )) : <p className="rounded-2xl bg-black/24 p-4 text-sm font-bold text-white/54">No persisted requests yet. Create one from the customer request flow.</p>}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/50">Provider approval queue</p>
        <div className="mt-4 space-y-3">
          {pendingDrivers.length ? pendingDrivers.map((driver) => (
            <div key={driver.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-black/24 p-4">
              <div><p className="font-black">{driver.name}</p><p className="text-sm font-bold text-white/50">{driver.truck} · {driver.phone}</p></div>
              <div className="flex gap-2"><button onClick={() => approve(driver.id, "APPROVED")} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-black">Approve</button><button onClick={() => approve(driver.id, "REJECTED")} className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">Reject</button></div>
            </div>
          )) : <p className="rounded-2xl bg-black/24 p-4 text-sm font-bold text-white/54">No pending providers.</p>}
        </div>
      </section>
      {message ? <p className="rounded-2xl bg-blue-500/12 p-4 text-sm font-bold text-blue-100">{message}</p> : null}
    </div>
  );
}
