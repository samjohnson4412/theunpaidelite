/* Site configuration. Edit this file, not the pages. */
window.SITE = {
  contactEmail: "sam@crossroadstechnology.co",

  /* Initial claim intake stays on Google Forms. Note the published URL carries no
     'ouid' parameter — that identifies the form owner's Google account and does
     not belong on a public page. */
  googleForm: "https://docs.google.com/forms/d/e/1FAIpQLSfvVS6ftVTspNXRPTfunV57VHzhTQbl-O4Ogdi2JAfwHV0DXA/viewform",

  tally: {
    /* Document upload + permission choices. A Tally URL looks like
       https://tally.so/r/wABC12 — the ID is the part after /r/. */
    evidence: "REPLACE_WITH_EVIDENCE_FORM_ID"
  },

  /* Public court record. */
  judgment: {
    court: "Pasco County, Florida",
    case: "51-2025-SC-004786-SCAX-WS",
    note: "Small claims judgment, paid in full only after a motion for contempt was filed."
  }
};
