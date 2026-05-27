# FindYourTow Premium Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the default Next scaffold with a premium Uber-style landing page for FindYourTow.

**Architecture:** Keep this Task 1 scope static and self-contained. Use a server component page with structured content arrays and Tailwind utility styling, plus global theme polish and metadata updates.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, Vitest + Testing Library.

---

### Task 1: Premium Landing Smoke Test

**Files:**
- Create: `tests/premium-landing.test.tsx`

- [ ] Write a failing render test for headline, CTA, app status UI, and role cards.
- [ ] Run `npx vitest run tests/premium-landing.test.tsx` and confirm it fails because the page is still scaffold/default.

### Task 2: Premium Landing Implementation

**Files:**
- Modify: `app/(marketing)/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] Replace scaffold with premium mobile-first landing page.
- [ ] Update metadata to FindYourTow positioning.
- [ ] Polish globals for premium dark app styling and accessibility.
- [ ] Include `src` paths in Tailwind config.

### Task 3: Verification

- [ ] Run `npx vitest run tests/premium-landing.test.tsx` and confirm pass.
- [ ] Run `npm run lint` and confirm pass.
- [ ] Run `npm run build` and confirm pass.
