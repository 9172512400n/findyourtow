import { describe, expect, it } from "vitest";
import {
  allowedNextStatuses,
  buildProviderApplicationRecord,
  canProviderReceiveJobs,
  dbStatusToDriverAction,
  isAllowedDriverStatusTransition,
  normalizeProviderApplication,
} from "./workflow";

describe("marketplace workflow", () => {
  it("normalizes provider applications into a pending driver and truck profile", () => {
    const normalized = normalizeProviderApplication({
      companyName: "  North Shore Towing  ",
      contactName: "Sam Driver",
      email: "SAM@EXAMPLE.COM ",
      phone: "(917) 251-2400",
      serviceArea: "Queens / Nassau",
      truckType: "Flatbed",
      plateNumber: " tow-22 ",
      services: ["flatbed_tow", "jump_start"],
    });

    expect(normalized.email).toBe("sam@example.com");
    expect(normalized.phone).toBe("+19172512400");
    expect(normalized.companyName).toBe("North Shore Towing");
    expect(normalized.plateNumber).toBe("TOW-22");
    expect(normalized.status).toBe("PENDING_APPROVAL");
  });

  it("builds stable Supabase rows for a provider onboarding application", () => {
    const now = "2026-05-29T20:00:00.000Z";
    const rows = buildProviderApplicationRecord({
      now,
      userId: "user_1",
      profileId: "profile_1",
      providerAccountId: "provider_1",
      termsAcceptanceId: "terms_1",
      driverId: "driver_1",
      truckId: "truck_1",
      input: {
        providerType: "COMPANY",
        companyName: "North Shore Towing",
        contactName: "Sam Driver",
        email: "sam@example.com",
        phone: "+19172512400",
        businessAddress: "42 Queens Blvd, Queens, NY",
        serviceArea: "Queens",
        truckType: "Flatbed",
        plateNumber: "TOW22",
        services: ["standard_tow", "flatbed_tow"],
        guidelinesVersion: "provider-guidelines-v1",
        agreementAccepted: true,
        signerName: "Sam Driver",
      },
    });

    expect(rows.user).toMatchObject({ id: "user_1", email: "sam@example.com", phone: "+19172512400", role: "DRIVER" });
    expect(rows.profile).toMatchObject({ id: "profile_1", userId: "user_1", firstName: "Sam", lastName: "Driver" });
    expect(rows.providerAccount).toMatchObject({
      id: "provider_1",
      ownerUserId: "user_1",
      providerType: "COMPANY",
      legalBusinessName: "North Shore Towing",
      businessAddress: "42 Queens Blvd, Queens, NY",
      complianceStatus: "PENDING_REVIEW",
      guidelinesVersionAccepted: "provider-guidelines-v1",
      ratingAverage: 5,
      ratingCount: 0,
    });
    expect(rows.termsAcceptance).toMatchObject({
      id: "terms_1",
      providerAccountId: "provider_1",
      version: "provider-guidelines-v1",
      signerName: "Sam Driver",
      acceptedAt: now,
    });
    expect(rows.driver).toMatchObject({ id: "driver_1", userId: "user_1", providerAccountId: "provider_1", status: "PENDING_APPROVAL" });
    expect(rows.truck).toMatchObject({ id: "truck_1", driverId: "driver_1", providerAccountId: "provider_1", label: "North Shore Towing Flatbed", services: ["STANDARD_TOW", "FLATBED_TOW"] });
  });

  it("blocks job eligibility until provider compliance, documents, and latest guideline acceptance are complete", () => {
    expect(canProviderReceiveJobs({
      driverStatus: "APPROVED",
      providerComplianceStatus: "APPROVED",
      acceptedGuidelinesVersion: "provider-guidelines-v1",
      latestGuidelinesVersion: "provider-guidelines-v1",
      requiredDocumentsApproved: true,
      hasActiveTruck: true,
    })).toBe(true);

    expect(canProviderReceiveJobs({
      driverStatus: "APPROVED",
      providerComplianceStatus: "APPROVED",
      acceptedGuidelinesVersion: "provider-guidelines-v1",
      latestGuidelinesVersion: "provider-guidelines-v2",
      requiredDocumentsApproved: true,
      hasActiveTruck: true,
    })).toBe(false);

    expect(canProviderReceiveJobs({
      driverStatus: "ONLINE",
      providerComplianceStatus: "PENDING_REVIEW",
      acceptedGuidelinesVersion: "provider-guidelines-v1",
      latestGuidelinesVersion: "provider-guidelines-v1",
      requiredDocumentsApproved: true,
      hasActiveTruck: true,
    })).toBe(false);
  });

  it("allows drivers to advance jobs only through the operating sequence", () => {
    expect(allowedNextStatuses("DRIVER_ASSIGNED")).toEqual(["DRIVER_ON_THE_WAY"]);
    expect(isAllowedDriverStatusTransition("DRIVER_ASSIGNED", "DRIVER_ON_THE_WAY")).toBe(true);
    expect(isAllowedDriverStatusTransition("DRIVER_ASSIGNED", "COMPLETED")).toBe(false);
    expect(isAllowedDriverStatusTransition("VEHICLE_DELIVERED", "COMPLETED")).toBe(true);
  });

  it("maps database job statuses to provider action labels", () => {
    expect(dbStatusToDriverAction("DRIVER_ASSIGNED")).toEqual({ nextStatus: "DRIVER_ON_THE_WAY", label: "Accept / en route" });
    expect(dbStatusToDriverAction("COMPLETED")).toBeNull();
  });
});
