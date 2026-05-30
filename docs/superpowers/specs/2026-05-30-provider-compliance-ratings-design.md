# RoadAssistNow Provider Compliance, Guidelines, and Ratings Design

Date: 2026-05-30
Status: Approved by Nir; pending spec review
Owner: Nir / Emily

## Decision

RoadAssistNow provider onboarding must work like an Uber-style marketplace compliance flow, not a lightweight contact form.

Providers may create an account and submit an application, but they cannot receive offers, go online, or be assigned jobs until RoadAssistNow verifies their business identity, required documents, service capabilities, insurance, vehicle/truck readiness, and acceptance of provider terms/guidelines.

Customer signup should also include marketplace terms acceptance, profile completion, and payment setup before placing a service order, as already established in `2026-05-30-auth-payment-required-dispatch-design.md`.

Customer feedback with 1–5 star provider ratings is a required trust feature after job completion.

## Goals

- Make provider signup feel and function like a real regulated marketplace onboarding flow.
- Support both small towing companies and owner-operators.
- Prevent unverified or noncompliant providers from receiving jobs.
- Give admin clear review, approval, rejection, suspension, and re-verification tools.
- Capture enforceable provider agreement/guideline acceptance during signup.
- Add post-job customer feedback with star ratings to improve quality control.
- Keep the existing RoadAssistNow schema direction intact: extend current `users`, `profiles`, `drivers`, `tow_trucks`, `tow_requests`, `tow_status_updates`, and future offer/payment tables instead of replacing them with parallel uploaded-backend names.

## Non-Goals

- This spec does not write final legal terms. It defines product and technical requirements for collecting acceptance and enforcing compliance. Final legal text should be reviewed by counsel before live launch.
- This spec does not enable live Stripe Connect payouts by itself. It reserves the provider payout/compliance shape needed for a later Stripe Connect phase.
- This spec does not implement background checks on day one, but it leaves a document/compliance slot for them if Nir chooses to require them later.

## Provider Types

RoadAssistNow should support both provider models from day one:

1. **Company provider**
   - A legal business account.
   - Can add one or more drivers/operators.
   - Can add one or more trucks/service vehicles.
   - A responsible owner/manager signs provider terms.

2. **Owner-operator**
   - One person operating as their own business.
   - Must still provide legal identity/business details, insurance, license/registration, service capabilities, and terms acceptance.
   - Can later grow into a company account by adding drivers/trucks.

Decision: create `provider_accounts` as a first-class table now. Do not use `drivers` as the company/provider ownership root.

`provider_accounts` is the owner of provider compliance, business identity, terms acceptance, rating aggregates, payout readiness, and admin approval. `drivers` and `tow_trucks` belong to a `provider_account`. This is required for company providers with multiple drivers/trucks and for owner-operators who may later add more drivers/trucks.

Implementation should preserve current `drivers` and `tow_trucks` tables by adding `provider_account_id` relationships rather than replacing those tables.

## Provider Onboarding Flow

### Entry

Provider opens `/provider/apply` or equivalent and chooses:

- Company / fleet provider
- Owner-operator

The app creates an authenticated provider applicant account before submitting sensitive compliance details.

### Required Signup Steps

1. **Account creation**
   - Email/password or approved auth provider.
   - Phone number.
   - Role: provider applicant / driver applicant, not active provider yet.

2. **Provider type**
   - Company provider or owner-operator.

3. **Business / identity information**
   - Legal business name.
   - DBA / public display name, if different.
   - Owner or responsible manager name.
   - Business address.
   - Dispatch/contact phone.
   - Contact email.
   - EIN/tax identifier field where applicable.
   - Service area: cities, counties, ZIPs, radius, or admin-defined market coverage.
   - Operating hours and emergency availability.

4. **Services and capabilities**
   - Towing.
   - Flatbed.
   - Wheel-lift.
   - Tire change.
   - Fuel delivery.
   - Battery jumpstart.
   - Lockout.
   - Winch/recovery, if offered later.
   - Other services only when admin enables them.

5. **Truck / service vehicle details**
   - Truck/vehicle type.
   - Plate number.
   - VIN field where needed.
   - Registration upload.
   - Photos of truck/service vehicle.
   - Capability tags matching offered services.
   - Active/inactive state controlled by compliance and admin.

6. **Driver/operator details**
   - Driver full name.
   - Driver license upload.
   - Phone number.
   - Optional profile photo.
   - Status starts as pending review.

7. **Insurance and licensing documents**
   - Active insurance certificate.
   - Business license where required.
   - Tow/operator license where required by market.
   - Truck/vehicle registration.
   - Driver license for each driver.
   - Additional market-specific documents as configured by admin.

8. **Provider guidelines and agreement acceptance**
   - Provider must review and accept RoadAssistNow provider guidelines.
   - Provider must accept platform terms/commission/payment rules.
   - Store accepted version, timestamp, signer name, account id, IP/user-agent when available.
   - If guidelines change materially, require re-acceptance before the provider can remain online.

9. **Submit for review**
   - Application status becomes `PENDING_REVIEW`.
   - Provider dashboard shows checklist status: submitted, needs info, approved, rejected, expired, suspended.

## Provider Guidelines Content

RoadAssistNow should maintain a provider guideline/agreement screen and versioned document covering these areas.

### Eligibility

- Provider must be legally allowed to operate roadside/towing services in each served market.
- Provider must give accurate identity and business information.
- Provider must pass RoadAssistNow approval before receiving jobs.
- Provider must keep all required insurance, licenses, and registrations current.

### Required Documents

- Business license if applicable.
- Tow/roadside operator license if applicable.
- Active insurance certificate.
- Truck/vehicle registration.
- Driver license for each driver/operator.
- Truck/service vehicle photos.
- Proof of service capability when requested.
- Optional future background-check documentation.

### Insurance Rules

- Insurance must remain active while provider is on the platform.
- Expired insurance automatically blocks provider/truck/driver from going online.
- Admin can mark documents approved, rejected, expired, or needs review.
- Provider must upload renewed insurance before expiration.

### Terms and Marketplace Rules

Provider agrees that:

- They are independent contractors or independent businesses, not RoadAssistNow employees.
- They are responsible for legal compliance, safe operations, taxes, permits, licenses, and insurance.
- RoadAssistNow can charge platform fees/commission.
- Customer payment flows through RoadAssistNow unless admin explicitly authorizes an exception.
- Provider cannot bypass the app to take RoadAssistNow customers privately.
- Provider cannot demand cash or off-app payment for covered services.
- Fraud, fake documents, unsafe work, harassment, discrimination, or noncompliance can lead to suspension or removal.

### Service Conduct

- Arrive professionally and safely.
- Contact customer only for job-related needs.
- No harassment, threats, discrimination, intimidation, or abusive language.
- Keep truck/service vehicle roadworthy and presentable.
- Follow traffic laws, towing laws, parking rules, and safety procedures.
- Update job status honestly and promptly: accepted, en route, arrived, servicing/towing, completed, cancelled/problem.

### Job Acceptance Rules

- Only approved/verified providers can go online.
- Only online providers receive offers.
- Provider must accept/decline within the offer time window.
- Accepted jobs must be completed unless there is a real safety, legal, mechanical, or customer issue.
- Repeated no-shows, late cancellations, or failure to update status can reduce standing or trigger review.

### Pricing and Payment Rules

- Customer pays through RoadAssistNow.
- Provider may not collect extra off-app payment unless admin approves a special case.
- Add-ons must be documented and approved through the platform flow.
- Provider payout occurs after completion and any applicable review/hold period.
- Later Stripe Connect will handle payouts and platform commission.

### Safety and Disputes

- Provider must report accidents, damage, customer conflicts, unsafe scenes, police involvement, or service inability.
- Admin can freeze payout while investigating disputes.
- Provider must cooperate with documentation requests.

### Suspension / Deactivation

Provider can be suspended or removed for:

- Fake or altered documents.
- Expired/rejected insurance.
- Unsafe work.
- Off-app payment attempts.
- Fraud or manipulation.
- Repeated bad ratings or serious complaints.
- No-shows or repeated cancellations.
- Customer harassment/discrimination.
- Legal noncompliance.
- Admin-determined risk to customers or platform operations.

## Compliance Enforcement

Compliance must be a hard gate, not only UI copy.

### Provider Statuses

Recommended provider/account statuses:

- `DRAFT` — account created, application incomplete.
- `PENDING_REVIEW` — submitted, awaiting admin review.
- `NEEDS_INFO` — admin requested more information.
- `APPROVED` — provider account approved.
- `ONLINE` — approved and currently available.
- `OFFLINE` — approved but not available.
- `BUSY` / `ON_JOB` — currently assigned to a job.
- `SUSPENDED` — blocked by admin or compliance issue.
- `REJECTED` — application rejected.

Current `DbDriverStatus` already has `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `ONLINE`, `OFFLINE`, `BUSY`, `SUSPENDED`. Implementation can map the product statuses above onto the existing enum first, then expand if needed.

### Document Statuses

Each required document should have:

- Type: insurance, business license, operator license, vehicle registration, driver license, truck photo, background-check placeholder, other.
- Status: `MISSING`, `UPLOADED`, `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `EXPIRED`, `NEEDS_INFO`.
- Expiration date when applicable.
- Uploaded file reference.
- Reviewed by admin id.
- Reviewed timestamp.
- Rejection/needs-info reason.

### Online Eligibility Rule

Provider/driver/truck can go online only if all are true:

- Provider account is approved.
- Provider guidelines latest required version accepted.
- Required documents are approved and unexpired.
- Driver/operator is approved and active.
- Truck/service vehicle is approved and active.
- Provider is not suspended.
- Provider serves the current market/service area.
- Provider has capability for the offered service type.

Server APIs for provider status, location heartbeat, job offers, manual assignment, and matching must enforce this rule.

## Admin Review Flow

Admin console must support:

- List provider applications by status.
- Open application detail page.
- Review business info, owner/operator info, trucks, drivers, service area, services, and documents.
- Approve, reject, suspend, reinstate, or mark needs-info.
- Approve/reject individual documents.
- Enter rejection/needs-info reasons visible to provider.
- Track document expiration dates.
- See compliance checklist per provider.
- Block online status automatically when a required document expires.
- Audit all admin actions.

## Provider Dashboard Flow

Provider dashboard should show:

- Application status.
- Compliance checklist.
- Missing/rejected/expired documents.
- Guideline/agreement acceptance status.
- Upload/replace document actions.
- Go online/offline only when eligible.
- Job offers when online.
- Active job status updates.
- Job history.
- Rating average and completed job count after ratings launch.

## Customer Signup / Terms Alignment

Customers must also accept marketplace terms before placing service orders.

Customer flow requirements remain:

- Account required.
- Payment method required before service dispatch.
- Terms/privacy acceptance tracked with version and timestamp.
- Customer profile/contact details are tied to the authenticated customer, not trusted from request body.

Customer terms acceptance can be lighter than provider compliance, but it must be versioned and durable.

## Ratings and Feedback

### Customer-to-Provider Rating

After a request reaches `COMPLETED`, the customer is prompted to rate the provider/driver:

- 1–5 star rating required for submitted feedback.
- Optional written review.
- Optional tags, such as:
  - Fast arrival.
  - Professional.
  - Helpful.
  - Clean truck.
  - Clear communication.
  - Poor communication.
  - Late arrival.
  - Unsafe behavior.
  - Pricing concern.
  - Damage concern.
- Feedback links to the completed request, customer, provider account, driver, and truck when available.
- Customer can submit only one rating per completed request, with a limited edit window if desired later.

### Provider Rating Display

Provider-facing and admin-facing displays should include:

- Average star rating.
- Completed job count.
- Recent feedback tags.
- Written reviews in admin/support view.
- Public/provider profile surfaces may show rating + completed job count once enough jobs exist.

### Quality Control Rules

Admin should see:

- Low ratings.
- Serious complaint tags.
- Repeated complaints.
- Rating trend by provider/driver.
- Ability to open an investigation/dispute.
- Ability to warn, suspend, or require retraining/reverification.

Recommended thresholds for later implementation:

- Any 1-star or safety/damage complaint creates an admin review item.
- Average below a configured threshold creates a quality warning.
- Repeated unresolved complaints can block online eligibility.

### Provider-to-Customer Rating

Two-sided ratings may be added later, but initial implementation should prioritize customer-to-provider ratings because it directly protects service quality and launch trust. If provider-to-customer ratings are added, they should remain internal/admin-facing by default.

## Data Model Additions

Required additive tables or equivalent structures:

- `provider_accounts`
  - account/company-level record above drivers/trucks.
  - type: company or owner-operator.
  - legal/public names, tax/business fields, service area, compliance status, availability status, quality status, compliance summary.
  - owns provider terms/guidelines acceptance and rating aggregates.

- `provider_documents`
  - provider/driver/truck document records with status, type, expiration, private storage path, review metadata.
  - references the owning `provider_account_id` and, when applicable, the related `driver_id` or `tow_truck_id`.

- `terms_versions`
  - customer terms, provider terms, privacy policy, provider guidelines.

- `terms_acceptances`
  - user/provider/customer id, terms version, accepted timestamp, signer name, IP/user-agent where available.

- `provider_reviews`
  - completed request id, customer id, provider account id, driver id, truck id, stars, tags, written review, moderation status.

- `provider_quality_actions`
  - admin warnings, suspensions, investigation notes, reinstatements, and reasons.

These should be introduced as schema extensions after review, not as a replacement for existing core tables.

## Sensitive Document Storage and Access Control

Provider documents are sensitive private files. They must not be stored in public buckets or exposed through unauthenticated URLs.

Required rules:

- Store licenses, insurance certificates, registrations, IDs, and business documents in a private Supabase Storage bucket or equivalent private object storage.
- Store only private storage paths/references in `provider_documents`; do not store public URLs for sensitive documents.
- Providers may upload documents only for their own `provider_account` and may view/download only their own submitted documents.
- Admin/support users may view/download documents only through admin-authenticated routes or signed URLs with short expiration.
- Customers must never be able to view provider compliance documents.
- Provider document metadata visible to customers must be limited to safe trust signals, such as "verified provider" or "insurance verified", not document images or personal identifiers.
- Supabase RLS/storage policies must enforce ownership and admin access server-side.
- Signed document URLs should be generated only when needed and should not be persisted in the database.
- Rejected/expired documents remain visible to the provider and admin for audit/replacement, but not to other providers or customers.

## API / Backend Enforcement

Required backend behavior:

- Provider application submission requires authenticated account.
- Provider cannot self-approve.
- Provider cannot set their own verified/approved/compliance/quality/online eligibility flags directly.
- Admin-only routes perform approval/rejection/suspension/document review.
- Provider online route checks full compliance before setting online.
- Matching/offers/manual dispatch check provider online eligibility server-side.
- Expired/rejected/missing documents block online and matching.
- Terms acceptance version is checked before enabling provider online.
- Completed jobs allow exactly one customer rating from the authenticated customer who owns the request.
- Ratings cannot be created for incomplete/cancelled/refunded jobs unless admin later enables exception handling.
- Provider cannot edit/delete customer reviews.

## UI Surfaces

### Provider

- `/provider/apply` upgraded from simple form to compliance wizard.
- `/provider/dashboard` shows checklist, application status, go-online eligibility, jobs, rating summary.
- `/provider/documents` optional route for uploads/renewals.
- `/provider/guidelines` displays the current accepted provider guidelines and acceptance state.

### Admin

- Provider applications list.
- Provider detail/review screen.
- Document review queue.
- Compliance expiration queue.
- Ratings/complaints queue.
- Provider quality action log.

### Customer

- Post-completion rating prompt on tracking/history page.
- Simple star selector and optional tags/comment.
- Completed request history shows submitted rating.

## Error Handling

- If provider tries to go online while noncompliant, return a clear reason list: missing insurance, expired registration, terms not accepted, pending admin approval, suspended, etc.
- If upload fails, keep application draft and allow retry.
- If admin rejects a document, provider sees a clear reason and replacement action.
- If a customer already rated a request, duplicate submit returns a friendly already-rated error.

## Testing / Verification

Required tests before implementation is considered complete:

- Provider applicant can submit application but remains pending.
- Pending provider cannot go online.
- Approved provider with missing/expired document cannot go online.
- Approved provider with accepted latest terms and approved documents can go online.
- Provider cannot self-approve via forged request body.
- Matching/offers exclude pending/suspended/noncompliant providers.
- Admin can approve/reject documents with reasons.
- Expired insurance blocks online eligibility.
- Completed customer request can receive exactly one 1–5 star rating from its customer.
- Ratings cannot be submitted for incomplete jobs.
- Provider cannot modify customer feedback.
- UI copy clearly explains provider compliance requirements and customer post-job feedback.

## Rollout Plan

1. Add the design/spec and align existing provider signup copy with the rule: application is not approval.
2. Add schema extensions for provider accounts, documents, terms acceptance, and reviews.
3. Add private document storage, RLS/storage policies, and admin-only signed document access.
4. Upgrade provider application form into a wizard/checklist.
5. Add admin review/document approval queue.
6. Enforce provider online eligibility server-side.
7. Add completed-job rating flow.
8. Add quality alerts/suspension workflow.
9. Add Stripe Connect onboarding/payout rules in a later payment-specific spec.

## Success Criteria

- Provider signup collects business, service, insurance/license/registration, truck, driver, and agreement acceptance details.
- Provider cannot receive jobs until approved and compliant.
- Admin can approve/reject/suspend providers and documents.
- Expired/rejected/missing compliance items block online status.
- Customer can rate completed provider service with 1–5 stars.
- Admin can monitor low ratings/complaints.
- Existing RoadAssistNow demo remains separate and untouched unless explicitly updated.
