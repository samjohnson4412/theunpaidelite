# Setup

Two things stand between this repo and a working site: creating the Tally forms,
and pointing the domain at GitHub Pages.

---

## 1. Forms

### Claim intake — Google Forms (already live)

The initial claim form stays on Google Forms. It is embedded on `claim.html` and the
URL lives in `assets/config.js` under `googleForm`.

The published URL deliberately omits the `ouid=` parameter that Google adds to
share links — that parameter identifies the form owner's Google account and has no
business on a public page.

Two things worth fixing on that form when you get a chance:

- **The date field only accepts one date.** At least six people worked around it by
  writing extra dates into the final free-text question. Allowing a list would save
  everyone the guesswork.
- **Two submissions put a surname in the email field**, which makes them
  unreachable. Setting the email question to validate as an email address prevents it.

### Document upload — Tally (still to create)

This is the one form you need to build. Go to [tally.so](https://tally.so) and
create a free account; free covers unlimited forms, unlimited responses and file
uploads. **Turn off "Require respondents to sign in"** — every sign-in wall costs
responses, and these are people already tired of being asked for things.

| Field | Type | Required |
|---|---|---|
| Full name | Short answer | yes |
| Email | Email | yes |
| Upload your documents | **File upload**, allow multiple, 10MB+ | no |
| What are you sending? | Checkboxes: portal invoices / assignment confirmations / emails about payment / receipts / shop report screenshots / 1099 / texts or messages / other | no |
| Which client or location did you shop? | Short answer | no |
| Anything we should know about these files? | Long answer | no |

Then four **separate** permission questions. Separate, not one combined checkbox — a
single "I agree to everything" box is not meaningful consent and will not hold up if
anyone challenges it.

| Permission question | Type |
|---|---|
| May we use your documents **privately**, to understand the pattern and help you? | Yes / No |
| May we include them in complaints to **regulators** (attorneys general, labor agencies, law enforcement)? | Yes / No |
| May we show them to the **client company** whose locations you shopped? | Yes / No |
| May we list your **name, city and amount publicly** on this site? | Yes / No |

Add a closing note on the form:

> You can withdraw any of these permissions at any time by emailing
> sam@crossroadstechnology.co. Please black out bank details and Social Security
> numbers before uploading — we never need them.

### Then wire them up

The Tally form's share URL looks like `https://tally.so/r/wABC12`. The form ID is
the part after `/r/`. Put it into `assets/config.js`:

```js
tally: {
  evidence: "wABC12"
}
```

Until you do, `evidence.html` shows a visible "not connected yet" panel instead of a
broken form — so a half-finished setup can never look like a working one.

---

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

The roster lives in Google Forms and Tally. This repo holds aggregates and
consented entries only.
