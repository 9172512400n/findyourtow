"use client";

import { useEffect, useState } from "react";
import { formatMoney } from "@/features/pricing/pricing-engine";
import type { DispatchRequestSummary } from "@/features/marketplace/supabase-repository";
import type { DbTowStatus } from "@/features/marketplace/workflow";

type Props = { initialJobs: DispatchRequestSummary[] };

export function DriverJobsPanel({ initialJobs }: Props) {
  const [jobs, setJobs] = useState(initialJobs);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/driver/jobs")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!cancelled && Array.isArray(data?.jobs)) setJobs(data.jobs);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  async function advance(towRequestId: string, nextStatus: DbTowStatus) {
    setMessage("Updating job status…");
    const response = await fetch("/api/driver/jobs", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ towRequestId, nextStatus }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) return setMessage(data?.error ?? "Could not update job");
    setJobs((current) => current.map((job) => job.id === towRequestId ? data.job : job));
    setMessage("Job status updated. Customer/admin tracking now reflects the latest status.");
  }

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/50">Real assigned jobs</p>
          <h2 className="mt-1 text-2xl font-black tracking-[-0.03em]">Provider work queue</h2>
        </div>
        <span className="rounded-full bg-blue-300/12 px-3 py-1 text-xs font-black text-blue-100">{jobs.length} jobs</span>
      </div>
      <div className="mt-4 space-y-3">
        {jobs.length ? jobs.map((job) => (
          <article key={job.id} className="rounded-2xl bg-black/24 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-black">{job.service}</p>
                <p className="text-sm font-bold text-white/54">{job.shortId} · {job.customer} · {job.status.replaceAll("_", " ")}</p>
                <p className="mt-1 text-sm font-bold text-white/44">{job.pickup}{job.dropoff ? ` → ${job.dropoff}` : ""}</p>
              </div>
              <p className="rounded-full bg-emerald-300/12 px-3 py-1 text-sm font-black text-emerald-200">{formatMoney(job.totalCents)}</p>
            </div>
            {job.action ? <button onClick={() => advance(job.id, job.action!.nextStatus)} className="mt-4 rounded-full bg-blue-500 px-4 py-2 text-sm font-black text-white">{job.action.label}</button> : <p className="mt-4 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/60">No driver action available</p>}
          </article>
        )) : <p className="rounded-2xl bg-black/24 p-4 text-sm font-bold text-white/54">No assigned jobs yet. Dispatch must assign an approved provider first.</p>}
      </div>
      {message ? <p className="mt-4 rounded-2xl bg-blue-500/12 p-4 text-sm font-bold text-blue-100">{message}</p> : null}
    </section>
  );
}
