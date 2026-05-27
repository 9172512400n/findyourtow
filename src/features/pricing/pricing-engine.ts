import type { QuoteLineItem, QuoteRequest, QuoteResponse, ServiceTypeId } from "../tow-requests/types";

type PricingRule = {
  label: string;
  baseFeeCents: number;
  minimumCents?: number;
  towService: boolean;
};

const DOLLARS = 100;

export const DEFAULT_PRICE_PER_MILE_CENTS = 5 * DOLLARS;
export const DEFAULT_ADMIN_FEE_RATE = 0.1;

export const pricingRules: Record<ServiceTypeId, PricingRule> = {
  standard_tow: { label: "Standard tow", baseFeeCents: 95 * DOLLARS, minimumCents: 125 * DOLLARS, towService: true },
  flatbed_tow: { label: "Flatbed tow", baseFeeCents: 125 * DOLLARS, minimumCents: 125 * DOLLARS, towService: true },
  jump_start: { label: "Jump start", baseFeeCents: 75 * DOLLARS, towService: false },
  flat_tire: { label: "Flat tire", baseFeeCents: 85 * DOLLARS, towService: false },
  lockout: { label: "Lockout", baseFeeCents: 80 * DOLLARS, towService: false },
  fuel_delivery: { label: "Fuel delivery", baseFeeCents: 80 * DOLLARS, towService: false },
  winch_out: { label: "Winch out", baseFeeCents: 150 * DOLLARS, towService: true },
  accident_tow: { label: "Accident tow", baseFeeCents: 175 * DOLLARS, towService: true },
  vehicle_transport: { label: "Vehicle transport", baseFeeCents: 175 * DOLLARS, minimumCents: 175 * DOLLARS, towService: true },
};

export function calculateQuote(request: QuoteRequest): QuoteResponse {
  const rule = pricingRules[request.serviceType];
  const distanceMiles = normalizeDistance(request.distanceMiles);
  const lineItems: QuoteLineItem[] = [
    { code: "base_fee", label: rule.label, amountCents: rule.baseFeeCents },
  ];

  const distanceFeeCents = Math.round(distanceMiles * DEFAULT_PRICE_PER_MILE_CENTS);
  if (distanceFeeCents > 0) {
    lineItems.push({ code: "distance_fee", label: `${distanceMiles.toFixed(1)} miles`, amountCents: distanceFeeCents });
  }

  const subtotalBeforeMinimum = sumLineItems(lineItems);
  if (rule.minimumCents && subtotalBeforeMinimum < rule.minimumCents) {
    lineItems.push({
      code: "minimum_adjustment",
      label: "Minimum tow adjustment",
      amountCents: rule.minimumCents - subtotalBeforeMinimum,
    });
  }

  if (request.afterHours) {
    lineItems.push({ code: "after_hours_fee", label: "After-hours fee", amountCents: 35 * DOLLARS });
  }

  if (request.heavyVehicle) {
    lineItems.push({ code: "heavy_vehicle_fee", label: "Heavy vehicle fee", amountCents: 50 * DOLLARS });
  }

  if (request.rush) {
    lineItems.push({ code: "rush_fee", label: "Rush priority", amountCents: 40 * DOLLARS });
  }

  const subtotalCents = sumLineItems(lineItems);
  const adminFeeCents = Math.round(subtotalCents * DEFAULT_ADMIN_FEE_RATE);
  lineItems.push({ code: "admin_service_fee", label: "FindYourTow service fee", amountCents: adminFeeCents });

  return {
    serviceType: request.serviceType,
    distanceMiles,
    subtotalCents,
    adminFeeCents,
    totalCents: subtotalCents + adminFeeCents,
    currency: "usd",
    lineItems,
    estimatedEtaMinutes: estimateEtaMinutes(request.serviceType, distanceMiles, Boolean(request.rush)),
  };
}

function normalizeDistance(distanceMiles: number): number {
  if (!Number.isFinite(distanceMiles) || distanceMiles < 0) {
    return 0;
  }

  return Math.round(distanceMiles * 10) / 10;
}

function sumLineItems(lineItems: QuoteLineItem[]): number {
  return lineItems.reduce((total, item) => total + item.amountCents, 0);
}

function estimateEtaMinutes(serviceType: ServiceTypeId, distanceMiles: number, rush: boolean): number {
  const baseEta = pricingRules[serviceType].towService ? 12 : 9;
  const distanceEta = Math.ceil(distanceMiles * 1.8);
  const rushReduction = rush ? 4 : 0;
  return Math.max(6, baseEta + distanceEta - rushReduction);
}

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
