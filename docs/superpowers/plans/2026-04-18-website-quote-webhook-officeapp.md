# Website Quote Email + Webhook -> OfficeApp Lead Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the existing website quote email delivery in place while adding a webhook flow that creates a new lead automatically in the OfficeApp leads module, then remove email later once the webhook path is proven.

**Architecture:** The Astro website will keep posting the quote form to the Cloudflare Worker after Turnstile validation. For the first rollout, the Cloudflare Worker will continue sending the existing email and will also POST a normalized payload to a new unauthenticated-but-signed OfficeApp webhook endpoint. The OfficeApp backend will validate the webhook secret, translate website fields into the internal `Lead` model, create the lead record, and return a stable response for the worker. The website form will temporarily stop accepting file uploads so the parallel-delivery rollout stays simple and observable.

**Tech Stack:** Astro, Cloudflare Worker, Turnstile, Express, Prisma, PostgreSQL, GitHub Actions, Cloudflare Access.

---

## Current State

- Website quote form submits `multipart/form-data` to `PUBLIC_QUOTE_FORM_ENDPOINT` from [src/components/QuoteForm.astro](/home/chris/github/KestrelStudiosLtd-Website/src/components/QuoteForm.astro:1).
- The worker currently validates Turnstile and sends an email through ForwardEmail from [cloudflare/quote-form-worker/src/index.js](/home/chris/github/KestrelStudiosLtd-Website/cloudflare/quote-form-worker/src/index.js:1).
- OfficeApp lead creation currently exists only behind authenticated UI routes in [backend/src/routes/leads.ts](/home/chris/github/KestrelStudiosLtd-OfficeApp/backend/src/routes/leads.ts:1).
- OfficeApp applies `cfAccessMiddleware` before route mounting in [backend/src/index.ts](/home/chris/github/KestrelStudiosLtd-OfficeApp/backend/src/index.ts:1), and that middleware currently blocks every path except `/health` from [backend/src/middleware/cfAccess.ts](/home/chris/github/KestrelStudiosLtd-OfficeApp/backend/src/middleware/cfAccess.ts:1).

## Key Constraints

- The OfficeApp webhook cannot reuse `POST /api/leads` because that route requires app auth plus CSRF.
- A new public webhook path must either bypass Cloudflare Access or be updated to accept a machine-to-machine credential path. Right now, a worker POST would be rejected before it reaches route code.
- Website service names are free text; OfficeApp `serviceType` is an enum. A mapping layer is required.
- The website currently supports file attachments, but the OfficeApp `Lead` model has no attachment relation. For the initial rollout, the website form should stop accepting file uploads entirely.
- Because email stays enabled during rollout, the worker should treat webhook creation as additive rather than replacing the current success path immediately.

---

### Task 1: Align and verify repo state

**Files:**
- Verify: `/home/chris/github/KestrelStudiosLtd-Website`
- Verify: `/home/chris/github/KestrelStudiosLtd-OfficeApp`

- [ ] Confirm both repos are aligned to `origin/main`

Run:
```bash
git -C /home/chris/github/KestrelStudiosLtd-Website status --short --branch
git -C /home/chris/github/KestrelStudiosLtd-OfficeApp status --short --branch
```

Expected: clean working trees on `main` with no local diffs.

- [ ] Confirm website quote flow still points at the worker endpoint

Run:
```bash
rg -n "PUBLIC_QUOTE_FORM_ENDPOINT|quoteEndpoint" /home/chris/github/KestrelStudiosLtd-Website/src /home/chris/github/KestrelStudiosLtd-Website/.github
```

Expected: the Astro form reads `PUBLIC_QUOTE_FORM_ENDPOINT` and CI exports it during deploy.

---

### Task 2: Remove file uploads from the website form for the first rollout

**Files:**
- Modify: `/home/chris/github/KestrelStudiosLtd-Website/src/components/QuoteForm.astro`

- [ ] Remove the file upload input and related helper copy from the quote form

Delete:
- `referenceFiles` file input
- upload-specific explanatory copy
- client-side file count/type/size validation

Keep:
- `referenceNotes` text field, if you still want users to mention files they can send later

- [ ] Update the form copy so expectations are explicit

Recommended replacement text:
```astro
<label for="quote-reference-notes" ...>
  Reference Notes <span ...>(Optional)</span>
</label>
<input
  id="quote-reference-notes"
  name="referenceNotes"
  type="text"
  placeholder="Optional note about plans, images, or documents you can send later"
  ...
/>
```

- [ ] Remove dead client-side file handling code

Delete the `fileInput` lookup and the `files` validation block from the submit handler so the browser only posts the form fields plus Turnstile token.

---

### Task 3: Add a dedicated OfficeApp webhook contract

**Files:**
- Create: `/home/chris/github/KestrelStudiosLtd-OfficeApp/backend/src/routes/website-quotes.ts`
- Modify: `/home/chris/github/KestrelStudiosLtd-OfficeApp/backend/src/index.ts`
- Modify: `/home/chris/github/KestrelStudiosLtd-OfficeApp/.env.example`
- Test: `/home/chris/github/KestrelStudiosLtd-OfficeApp/backend/src/routes/website-quotes.test.ts` or equivalent backend test location already used by the repo

- [ ] Define the inbound payload schema

Fields to accept:
```ts
{
  fullName: string;
  email: string;
  phone?: string;
  businessName?: string;
  service: string;
  projectLocation: string;
  preferredDate?: string;
  projectDetails: string;
  referenceNotes?: string;
  submittedFrom?: string;
}
```

- [ ] Validate a shared secret on the new route

Route shape:
```ts
POST /api/webhooks/website-quote
Authorization: Bearer <WEBSITE_QUOTE_WEBHOOK_SECRET>
```

Expected behavior:
- reject missing/invalid secret with `401`
- reject invalid payload with `400`
- accept duplicates only if you intentionally add dedupe later; otherwise create one lead per submission

- [ ] Mount the route before CSRF enforcement and before `requireAuth`

Implementation target in `backend/src/index.ts`:
- import the new router
- mount it alongside other webhook routes
- ensure `/api/webhooks/website-quote` is reachable without app session cookies

- [ ] Update Cloudflare Access behavior

One of these must be implemented:
1. Preferred: exempt `/api/webhooks/website-quote` from `cfAccessMiddleware` and rely on the shared secret.
2. Alternative: support Cloudflare Access service-token headers in the worker and middleware.

Recommendation: use option 1 first because it is the smallest safe change for a single machine-to-machine endpoint.

- [ ] Add env documentation

Add to OfficeApp env example:
```env
WEBSITE_QUOTE_WEBHOOK_SECRET=replace_with_random_hex
```

---

### Task 4: Translate website quote submissions into OfficeApp leads

**Files:**
- Modify: `/home/chris/github/KestrelStudiosLtd-OfficeApp/backend/src/routes/website-quotes.ts`
- Reference: `/home/chris/github/KestrelStudiosLtd-OfficeApp/backend/prisma/schema.prisma`
- Reference: `/home/chris/github/KestrelStudiosLtd-OfficeApp/backend/src/routes/leads.ts`

- [ ] Map website service strings to `ServiceType`

Minimum mapping:
```ts
const serviceTypeMap: Array<[RegExp, ServiceType]> = [
  [/photo/i, ServiceType.AERIAL_PHOTOGRAPHY],
  [/video/i, ServiceType.AERIAL_VIDEO],
  [/(mapping|survey|3d)/i, ServiceType.MAPPING_SURVEY],
  [/inspection/i, ServiceType.INSPECTION],
  [/thermal/i, ServiceType.THERMAL_IMAGING],
  [/(construction|progress)/i, ServiceType.CONSTRUCTION_PROGRESS],
  [/(event|coverage)/i, ServiceType.EVENT_COVERAGE],
];
```

Fallback: `ServiceType.OTHER`

- [ ] Normalize lead fields for database insert

Expected `Lead` write shape:
```ts
{
  reference: await generateReference('LEAD'),
  enquirerName: fullName,
  company: businessName || undefined,
  enquirerEmail: email,
  enquirerPhone: phone || undefined,
  serviceType,
  location: projectLocation,
  source: 'WEBSITE',
  status: LeadStatus.NEW,
  enquiryDate: new Date(),
  followUpDate: preferredDate ? new Date(preferredDate) : undefined,
  notes: buildLeadNotes(...)
}
```

- [ ] Preserve non-structured information in `notes`

Recommended note builder:
```ts
[
  `Website quote submission`,
  preferredDate ? `Preferred date: ${preferredDate}` : null,
  submittedFrom ? `Submitted from: ${submittedFrom}` : null,
  referenceNotes ? `Reference notes: ${referenceNotes}` : null,
  '',
  'Project details:',
  projectDetails,
].filter(Boolean).join('\n');
```

- [ ] Return a stable success response to the worker

Response shape:
```json
{ "ok": true, "leadId": "...", "reference": "LEAD-2026-..." }
```

---

### Task 5: Add webhook delivery in the Cloudflare Worker while keeping email

**Files:**
- Modify: `/home/chris/github/KestrelStudiosLtd-Website/cloudflare/quote-form-worker/src/index.js`
- Modify: `/home/chris/github/KestrelStudiosLtd-Website/.github/workflows/deploy-quote-worker.yml`
- Reference: `/home/chris/github/KestrelStudiosLtd-Website/cloudflare/quote-form-worker/wrangler.toml`

- [ ] Keep Turnstile and validation exactly where they are

Do not change:
- payload parsing
- honeypot checks
- CORS behavior

- [ ] Keep the existing ForwardEmail send path intact for rollout phase 1

The worker should still send the current email exactly as it does now.

- [ ] Add a webhook POST after validation and before the final success response

New behavior:
- Turnstile passes
- email send runs
- webhook POST runs
- response returns success only if both succeed

If you want a softer rollout, use:
- email failure => overall failure
- webhook failure => overall failure for staging, or logged error plus success in production only if you explicitly choose that behavior

Recommendation: require both to succeed during initial testing so mismatches are visible immediately.

New worker env:
```txt
OFFICEAPP_QUOTE_WEBHOOK_URL
OFFICEAPP_QUOTE_WEBHOOK_SECRET
```

New worker call:
```js
await fetch(env.OFFICEAPP_QUOTE_WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.OFFICEAPP_QUOTE_WEBHOOK_SECRET}`,
  },
  body: JSON.stringify({
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    businessName: payload.businessName,
    service: payload.service,
    projectLocation: payload.projectLocation,
    preferredDate: payload.preferredDate,
    projectDetails: payload.projectDetails,
    referenceNotes: payload.referenceNotes,
    submittedFrom: payload.submittedFrom,
  }),
});
```

- [ ] Update required-env checks

Require:
- `OFFICEAPP_QUOTE_WEBHOOK_URL`
- `OFFICEAPP_QUOTE_WEBHOOK_SECRET`

Keep:
- `FORWARD_EMAIL_API_TOKEN`
- `FORWARD_EMAIL_FROM_EMAIL`
- `QUOTE_TO_EMAIL`

- [ ] Update GitHub Actions deployment secrets for the worker

Workflow secret puts should write:
```bash
printf '%s' "$OFFICEAPP_QUOTE_WEBHOOK_URL" | wrangler secret put OFFICEAPP_QUOTE_WEBHOOK_URL --config cloudflare/quote-form-worker/wrangler.toml
printf '%s' "$OFFICEAPP_QUOTE_WEBHOOK_SECRET" | wrangler secret put OFFICEAPP_QUOTE_WEBHOOK_SECRET --config cloudflare/quote-form-worker/wrangler.toml
```

---

### Task 6: Decide attachment handling explicitly

**Files:**
- Decide in plan before implementation

- [ ] Use a no-file-upload rollout for phase 1

Recommended phase 1:
- remove file inputs from the website form
- do not accept `referenceFiles` in the worker contract
- keep `referenceNotes` only
- defer any binary upload/storage design until after webhook behavior is validated

- [ ] If true file ingestion is required later, scope it separately

That follow-up would need:
- a storage model for lead attachments
- a public upload intake path or signed-upload design
- antivirus/content-type checks
- UI rendering in the leads module

This should not be mixed into the first webhook conversion unless you want a larger delivery.

---

### Task 7: Verify end-to-end behavior

**Files:**
- Verify website worker locally or in staging
- Verify OfficeApp webhook route locally or in staging

- [ ] Backend verification

Run a direct webhook test:
```bash
curl -i -X POST http://localhost:3001/api/webhooks/website-quote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WEBSITE_QUOTE_WEBHOOK_SECRET" \
  --data '{
    "fullName":"Jane Example",
    "email":"jane@example.com",
    "phone":"07123456789",
    "businessName":"Example Co",
    "service":"Aerial Photography",
    "projectLocation":"Maidstone, Kent",
    "preferredDate":"2026-05-01",
    "projectDetails":"Need marketing stills for a completed development.",
    "referenceNotes":"Site plan available on request",
    "submittedFrom":"https://kestrelstudios.uk/quote"
  }'
```

Expected:
- `200 OK`
- JSON includes `ok: true`
- new `Lead` row visible in OfficeApp leads UI
- the existing quote notification email is still delivered

- [ ] Worker verification

Submit the real quote form in a non-production environment and confirm:
- Turnstile still blocks invalid submissions
- valid form returns success
- quote notification email is delivered as before
- a corresponding lead appears in OfficeApp
- no file upload UI is shown on the website form

- [ ] Access verification

With `CF_ACCESS_ENABLED=true`, confirm the webhook path still works while normal app routes remain protected.

---

### Task 8: Deploy and configure secrets

**Files:**
- Modify OfficeApp deployment env source
- Modify website worker deployment secrets in GitHub

- [ ] Create one shared secret and store it in both systems

Generate:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use as:
- `WEBSITE_QUOTE_WEBHOOK_SECRET` in OfficeApp
- `OFFICEAPP_QUOTE_WEBHOOK_SECRET` in worker secrets

- [ ] Set the worker target URL to the OfficeApp public API hostname

Example:
```txt
https://office-portal.kestrelstudios.uk/api/webhooks/website-quote
```

- [ ] Deploy in this order

1. OfficeApp backend with new webhook route and CF Access exemption
2. Worker with new webhook target and secret while keeping existing email secrets
3. Website with file upload UI removed

---

## Recommended Implementation Order

1. OfficeApp backend webhook route
2. CF Access exemption for that route
3. Website form file-upload removal
4. Worker webhook POST addition alongside email
5. Worker secret/deploy workflow update
6. End-to-end test

## Risks To Watch

- `cfAccessMiddleware` currently blocks webhook traffic before route handling.
- Service text from the website does not match the Prisma enum directly.
- Parallel email + webhook delivery means the worker has two downstream dependencies during rollout.
- If the OfficeApp webhook is slow or unavailable, quote submissions will fail unless you explicitly choose to degrade gracefully.

## Minimal Delivery Recommendation

- Phase 1: remove file uploads from the website form, keep quote emails, add webhook-created leads in parallel.
- Phase 2: once satisfied, remove email delivery and decide separately whether lead attachment storage is needed.

---

Plan complete and saved to `docs/superpowers/plans/2026-04-18-website-quote-webhook-officeapp.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
