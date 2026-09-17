# Setup

The site has no build step and no third-party form to configure. All that is left
is pointing the domain at Cloudflare.

---

## 1. The claim form

The claim form stays on Google Forms. `claim.html` links to it, and the URL lives in
`assets/config.js` under `googleForm`.

The published URL deliberately omits the `ouid=` parameter Google adds to share
links — that identifies the form owner's Google account and has no business on a
public page.

By default the page shows a button that opens the form in a new tab. Set
`embedClaimForm: true` in `assets/config.js` to embed it inline instead; it keeps
Google's own light styling, so the page frames it as an inset document rather than
pretending it matches. Either way, phones get the button — a tall iframe with its own
scrollbar inside a scrolling page makes the submit button hard to reach.

**Documents arrive by email**, not through an upload form. `claim.html` explains what
to send, asks people to state in their email how the documents may be used, and tells
them to redact bank details and Social Security numbers first.

Three things worth fixing on the Google Form itself:

- **The title still says "Elite CSX."** Wrong letter order, on the form where people
  report the company by name.
- **The date field only accepts one date.** At least six people worked around it by
  writing extra dates into the final free-text question. Allowing a list would save
  everyone the guesswork.
- **Two submissions put a surname in the email field**, which makes them unreachable.
  Setting that question to validate as an email address prevents it. Also confirm
  *Settings → Responses → Collect email addresses* is not set to "Verified" — that
  forces a Google sign-in and will cost you responses.

## 2. Publish the site (Cloudflare Workers)

The repo is configured for **Cloudflare Workers Builds**. In the Cloudflare
dashboard, under the Worker's **Build configuration**:

| Field | Value |
|---|---|
| Build command | *leave empty* — there is no build step |
| Deploy command | `npx wrangler deploy` |
| Version command | `npx wrangler versions upload` |
| Root directory | `/` |

`wrangler.jsonc` does the rest. It serves the repo root as static files, sends
unknown URLs to `404.html`, and makes tidy URLs work (`/get-paid` as well as
`/get-paid.html`).

`.assetsignore` keeps repo housekeeping — this file, the README, the wrangler
config — from being served as part of the site.

### Branches

Cloudflare deploys the **production branch** you select when connecting the
repo. Point it at `main`. Pushes to any other branch produce a preview
deployment, not a production one, so work can be reviewed on a preview URL
before it reaches the real domain.

### The domain

In the Cloudflare dashboard: **Workers & Pages → theunpaidelite → Settings →
Domains & Routes → Add → Custom domain**, and add both `theunpaidelite.com` and
`www.theunpaidelite.com`.

If the domain's DNS is already on Cloudflare, records are created automatically
and TLS is issued within a few minutes. If it is registered elsewhere, move the
nameservers to Cloudflare first.

There is no `CNAME` file in this repo — that is a GitHub Pages mechanism and
Cloudflare does not use it.

## 3. Keeping it current

**The numbers.** `data/stats.json` drives every figure on the site. Update it when
claims come in — nothing is hardcoded in the HTML.

**The public roster.** `data/claims.json` starts empty. Add an entry **only** for
someone who checked the public-listing box:

```json
{ "name": "Jane Doe", "shopped": "Madison, WI", "dates": "May–Aug 2024", "amount": 1053.68 }
```

Remove anyone who asks, immediately and without discussion.

**Quotes.** `data/quotes.json` — keep them anonymous (location and amount only) and
quoted accurately.

---

## 4. The rule that matters

**Never commit the claimant list.** Not the CSV, not names, not emails, not phone
numbers. GitHub Pages serves this entire repository to the public, and git history
keeps deleted files forever. `.gitignore` blocks the obvious filenames, but it
cannot save you from `git add -f`.

The roster lives in Google Forms and in your email. This repo holds aggregate
figures and consented entries only.
