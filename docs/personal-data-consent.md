# Personal data consent

## Implementation

- `/consent` is a prerendered RU/EN page, linked from the form, policy and footer.
- `src/data/personalDataConsent.ts` contains the text and its version. Bump `CONSENT_VERSION` whenever the legal text changes; retain previous versions in Git.
- The required checkbox starts unchecked, is not persisted and resets after a successful submission. Reading either document does not select it. Links open in new tabs to preserve the draft.
- Both client and API enforce consent. `/api/lead` requires boolean `consent: true`, the current `consentVersion`, and `lang: ru | en` before making external requests.
- The Telegram notification records the consent version, document URL, language, server receipt timestamp and request ID alongside the submitted data. No new database or IP-address logging was added.
- Delivery errors are returned as errors, not simulated successes. Long notifications are split into correlated plain-text messages. A failed multi-part delivery can leave partial messages; a retry may duplicate a request. There is no transactional store or deduplication service.
- Vite development uses the production API handler, including consent and Turnstile validation.

## Checks

```sh
node --test tests/lead.test.mjs
npm run build
npm run lint
```

API tests mock Turnstile and Telegram and do not send actual messages. Browser checks should use a test Turnstile site key and intercept the Turnstile script and `/api/lead`; never send real personal data during testing.

Manual/browser checklist:
- RU/EN document, direct load, policy links, return navigation, mobile/desktop overflow.
- Checkbox initially empty; submit without it focuses the control and shows an error without a network request.
- Space toggles the focused checkbox; focus remains visible.
- Opening documents preserves the form draft.
- Failed delivery preserves input and shows an error; success resets consent for a new request.
- API rejects absent, false, string-valued and stale consent without external calls.

## Legal and operational review still required

This implements a separate consent flow, not a legal certification. Operator details currently use the name and contact already published on the site; the owner should confirm the full legally required details and have the texts reviewed for their situation.

Review the actual hosting, Telegram and Cloudflare data flows, localisation requirements, cross-border transfer rules and any Roskomnadzor notification obligations. Consent alone does not resolve these matters. The existing policy's claims about Telegram and storage have not been independently verified.

Deletion and withdrawal requests must be handled by the owner at `hello@ilyaarkov.com`, including relevant Telegram messages. There is no automatic deletion job. Retaining a versioned consent text in Git is separate from retaining a user's consent record in Telegram; preserve or delete records according to the applicable legal basis and retention obligations.
