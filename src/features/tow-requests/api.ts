import type { QuoteRequest, QuoteResponse, TowRequestPayload, TowTrip } from "./types";

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T;
  if (!response.ok) {
    throw new Error((data as { error?: string }).error ?? "Request failed");
  }
  return data;
}

export async function createQuote(payload: QuoteRequest): Promise<QuoteResponse> {
  const response = await fetch("/api/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<QuoteResponse>(response);
}

export async function createTowRequest(payload: TowRequestPayload): Promise<TowTrip> {
  const response = await fetch("/api/tow-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<TowTrip>(response);
}
