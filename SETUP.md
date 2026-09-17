# Setup

Two things stand between this repo and a working site: creating the Tally forms,
and pointing the domain at GitHub Pages.

---

## 1. Create the two Tally forms

Go to [tally.so](https://tally.so) and create a free account. Free covers unlimited
forms, unlimited responses, and file uploads.

**Turn off "Require respondents to sign in" on both forms.** Every sign-in wall
costs you responses, and these are people who are already tired of being asked for
things.

### Form A — "Elite CXS claim"

| Field | Type | Required |
|---|---|---|
| Full name | Short answer | yes |
| Email | Email | yes |
| Phone | Phone | no |
| City & state you live in | Short answer | yes |
| Where the shops took place (city/county/state) | Short answer | yes |
| Which client or location did you shop? | Short answer | no |
| Total owed (unpaid fees + unreimbursed purchases) | Number, prefix `$` | yes |
| Dates of work | Short answer — *label it "list all of them"* | yes |
| Did you contact Elite CXS? What happened? | Long answer | no |
| Did you receive a 1099 for income you never received? | Yes / No / Not sure | no |
| Have you filed a police report? | Yes / No | no |
| Have you filed in small claims? | Yes / No | no |
| Anything else we should know? | Long answer | no |

> The old Google form only accepted **one** date. Six people worked around it by
> writing extra dates into the free-text box. Make this field accept a list.

### Form B — "Elite CXS documents" ← *this is the one the outreach email links to*

| Field | Type | Required |
|---|---|---|
| Full name | Short answer | yes |
| Email | Email | yes |
| Upload your documents | **File upload**, allow multiple, 10MB+ | no |
| What are you sending? | Checkboxes: portal invoices / assignment confirmations / emails about payment / receipts / shop report screenshots / 1099 / texts or messages / other | no |
| Which client or location did you shop? | Short answer | no |
| Anything we should know about these files? | Long answer | no |

Then three **separate** permission questions. Separate, not one combined checkbox —
a single "I agree to everything" box is not meaningful consent and will not hold up
if anyone challenges it.

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

Each Tally form has a share URL like `https://tally.so/r/wABC12`. The form ID is the
part after `/r/`. Put both into `assets/config.js`:

```js
tally: {
  claim:    "wABC12",
  evidence: "wXYZ89"
}
```

Until you do, both pages show a visible "not connected yet" panel instead of a
broken form — so a half-finished setup can never look like a working one.

---

## 2. Publish the site

In the GitHub repo: **Settings → Pages → Source: GitHub Actions**. The included
workflow deploys on every push to `main`.

Then, at your domain registrar, point `theunpaidelite.com` at GitHub Pages:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | samjohnson4412.github.io |

Back in **Settings → Pages**, set the custom domain to `theunpaidelite.com` and
tick **Enforce HTTPS** once the certificate is issued (takes a few minutes to an hour).

The `CNAME` file in this repo already holds the domain, so it survives redeploys.

---

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
