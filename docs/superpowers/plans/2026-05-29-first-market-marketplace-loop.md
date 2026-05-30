# First-Market Marketplace Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first real RoadAssistNow marketplace loop: customer request → provider onboarding → admin approval/manual dispatch → driver status updates → customer/admin visibility.

**Architecture:** Add a focused `src/features/marketplace` unit for workflow rules and Supabase persistence. Add API routes for provider onboarding, driver approval, manual dispatch, and driver jobs. Upgrade the existing provider/admin/driver UI to call those routes with demo fallbacks.

**Tech Stack:** Next.js App Router, TypeScript, Zod, Supabase service-role client, Vitest, React Testing Library.

---

## File Structure

- Create `src/features/marketplace/schemas.ts`: Zod input schemas for provider onboarding, driver approval, assignment, and status updates.
- Create `src/features/marketplace/workflow.ts`: pure status transition helpers, display mapping, provider onboarding normalization.
- Create `src/features/marketplace/supabase-repository.ts`: Supabase reads/writes for providers, approval, assignment, driver jobs, status timeline.
- Create `src/features/marketplace/workflow.test.ts`: failing-first tests for validation and status transitions.
- Create `app/api/drivers/onboarding/route.ts`: create/list provider applications.
- Create `app/api/admin/drivers/route.ts`: list/approve/reject drivers.
- Create `app/api/admin/dispatch/route.ts`: list operational dispatch data and assign driver to request.
- Create `app/api/driver/jobs/route.ts`: list driver jobs and advance job status.
- Modify `app/driver/onboarding/page.tsx`: real provider application form.
- Modify `app/admin/dispatch/page.tsx`: real queue/driver assignment controls.
- Modify `app/driver/jobs/page.tsx`: real assigned jobs and status actions.
- Modify docs/access record after verification.

## Tasks

### Task 1: Workflow rules
- [ ] Write failing tests for provider payload normalization and allowed job status transitions.
- [ ] Run `npx vitest run src/features/marketplace/workflow.test.ts` and verify RED.
- [ ] Implement schemas/workflow helpers.
- [ ] Re-run targeted test and verify GREEN.

### Task 2: Supabase repository and APIs
- [ ] Write failing tests where possible for exported pure mappers.
- [ ] Implement repository functions and API routes.
- [ ] Verify route TypeScript via `npm run build`.

### Task 3: UI integration
- [ ] Add provider onboarding form POSTing to `/api/drivers/onboarding`.
- [ ] Add dispatch dashboard client controls for approving/assigning.
- [ ] Add driver job controls for status updates.
- [ ] Add smoke tests for key visible labels/actions.

### Task 4: Verification and deploy
- [ ] Run `git diff --check`.
- [ ] Run targeted Vitest tests.
- [ ] Run full `npx vitest run`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Commit to main, push, and deploy production.
