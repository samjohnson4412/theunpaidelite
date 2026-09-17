/* Site configuration. Edit this file, not the pages.
   Tally: create the two forms, then paste their form IDs here.
   A Tally URL looks like https://tally.so/r/wABC12 — the ID is the part after /r/. */
window.SITE = {
  contactEmail: "sam@crossroadstechnology.co",

  tally: {
    claim:    "REPLACE_WITH_CLAIM_FORM_ID",      // "I'm owed money" intake
    evidence: "REPLACE_WITH_EVIDENCE_FORM_ID"    // document upload + permission to share
  },

  // Shown on the record page. Public court record.
  judgment: {
    court: "Pasco County, Florida",
    case: "51-2025-SC-004786-SCAX-WS",
    note: "Small claims judgment obtained; payment followed only after a motion for contempt was filed."
  }
};
