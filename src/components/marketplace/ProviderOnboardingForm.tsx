"use client";

import { useState } from "react";
import { completeServiceCatalog } from "@/features/demo/platform-data";
import type { ServiceTypeId } from "@/features/tow-requests/types";

const defaultServices: ServiceTypeId[] = ["standard_tow", "flatbed_tow"];

export function ProviderOnboardingForm() {
  const [services, setServices] = useState<ServiceTypeId[]>(defaultServices);
  const [status, setStatus] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(formData: FormData) {
    setSubmitting(true);
    setStatus("Submitting provider application…");
    const payload = {
      providerType: String(formData.get("providerType") ?? "COMPANY"),
      companyName: String(formData.get("companyName") ?? ""),
      contactName: String(formData.get("contactName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      businessAddress: String(formData.get("businessAddress") ?? ""),
      serviceArea: String(formData.get("serviceArea") ?? ""),
      truckType: String(formData.get("truckType") ?? ""),
      plateNumber: String(formData.get("plateNumber") ?? ""),
      services,
      guidelinesVersion: "provider-guidelines-v1",
      agreementAccepted: formData.get("agreementAccepted") === "on",
      signerName: String(formData.get("signerName") ?? formData.get("contactName") ?? ""),
    };

    try {
      const response = await fetch("/api/drivers/onboarding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "Could not submit application");
      setStatus("Application submitted. Admin approval is now required before dispatch can assign jobs.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not submit application");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleService(service: ServiceTypeId) {
    setServices((current) => current.includes(service) ? current.filter((item) => item !== service) : [...current, service]);
  }

  return (
    <form action={submit} className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <select name="providerType" required defaultValue="COMPANY" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold">
          <option value="COMPANY">Company / fleet provider</option>
          <option value="OWNER_OPERATOR">Owner-operator</option>
        </select>
        <input name="companyName" required placeholder="Company name" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold" />
        <input name="contactName" required placeholder="Contact name" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold" />
        <input name="email" required type="email" placeholder="Dispatch email" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold" />
        <input name="phone" required placeholder="Dispatch phone" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold" />
        <input name="businessAddress" required placeholder="Business address" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold sm:col-span-2" />
        <input name="serviceArea" required placeholder="Service area" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold" />
        <input name="truckType" required placeholder="Truck type" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold" />
        <input name="plateNumber" required placeholder="Plate number" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold sm:col-span-2" />
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Service capabilities</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {completeServiceCatalog.slice(0, 10).map((service) => (
            <label key={service.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.055] p-3 text-sm font-bold text-white/76">
              <input
                type="checkbox"
                checked={services.includes(service.id)}
                onChange={() => toggleService(service.id)}
                className="h-4 w-4 accent-blue-500"
              />
              {service.label}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100/70">Provider guidelines</p>
        <p className="mt-2 text-sm font-bold text-white/72">I confirm this provider is legally allowed to operate, will keep insurance/licenses current, will not take customers off-app, and accepts RoadAssistNow provider rules pending full legal terms.</p>
        <input name="signerName" required placeholder="Signer full name" className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold" />
        <label className="mt-3 flex items-start gap-3 text-sm font-bold text-white/76">
          <input name="agreementAccepted" required type="checkbox" className="mt-1 h-4 w-4 accent-blue-500" />
          I accept RoadAssistNow provider guidelines v1 and understand admin approval is required before receiving jobs.
        </label>
      </div>

      <button type="submit" disabled={submitting || services.length === 0} className="min-h-13 w-full rounded-full bg-blue-500 px-5 font-black text-white disabled:cursor-not-allowed disabled:opacity-50">
        {submitting ? "Submitting…" : "Submit provider application"}
      </button>
      {status ? <p className="rounded-2xl bg-white/[0.055] p-4 text-sm font-bold text-white/70">{status}</p> : null}
    </form>
  );
}
