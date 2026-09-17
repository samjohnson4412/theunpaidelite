# The Unpaid Elite — theunpaidelite.com

A public record and recovery toolkit for independent contractors who performed
mystery shops for **Elite CX Solutions, LLC (dba Elite CXS)** and were not paid.

Run by an unincorporated group of affected contractors. Contact: Samuel Johnson,
sam@crossroadstechnology.co.

## What's here

| Page | Purpose |
|---|---|
| `index.html` | Overview, live totals, the two things to do today |
| `claim.html` | Claim intake (Google Form), plus what documents to email and how they may be used |
| `get-paid.html` | Recovery playbook, ordered by what actually works |
| `record.html` | The documented pattern: scale, duration, responses, court record, methodology |
| `about.html` | Who runs this, privacy, corrections |

## Stack

Static HTML, one stylesheet, one script. No build step, no framework, no
dependencies, no cookies, no analytics.

Deployed to **Cloudflare Workers** via Workers Builds. `main` is the production
branch; every other branch gets a preview deployment. Configuration lives in
`wrangler.jsonc`, and `.assetsignore` keeps repo housekeeping out of the served
site.

Every figure on the site is read at runtime from `data/stats.json` — edit that file
to update the numbers, not the HTML.

## Editing

Pages are plain HTML with a duplicated header and footer. If you change the nav,
change it in all six files (`index`, `claim`, `get-paid`, `record`, `about`, `404`).

Data files:

- `data/stats.json` — aggregate figures (no personal data)
- `data/quotes.json` — anonymized quotes: location and amount only, never names
- `data/claims.json` — public roster, opt-in only, starts empty

## Before you commit

This repository is **public**. Never commit the claimant list — no CSVs, names,
emails or phone numbers. See the end of [SETUP.md](SETUP.md).

## Setup

See [SETUP.md](SETUP.md) for the claim form, DNS and Cloudflare configuration.

## Accuracy

The site makes factual claims about a named company. Figures come from claim forms
submitted by contractors and are documented in the methodology section of
`record.html`. Corrections go to sam@crossroadstechnology.co and get made.
