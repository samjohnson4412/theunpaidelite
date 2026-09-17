/* Site configuration. Edit this file, not the pages. */
window.SITE = {
  contactEmail: "sam@crossroadstechnology.co",

  /* Initial claim intake stays on Google Forms. Note the published URL carries no
     'ouid' parameter — that identifies the form owner's Google account and does
     not belong on a public page. */
  googleForm: "https://docs.google.com/forms/d/e/1FAIpQLSfvVS6ftVTspNXRPTfunV57VHzhTQbl-O4Ogdi2JAfwHV0DXA/viewform",

  /* false  -> a button that opens the form in a new tab (default).
              Looks right in both light and dark, and avoids a 1200px iframe with
              its own scrollbar inside a scrolling page.
     true   -> embed the form inline. It keeps Google's own light styling, so the
              page frames it as an inset document rather than pretending it matches. */
  embedClaimForm: false,


  /* Public court record. */
  judgment: {
    court: "Pasco County, Florida",
    case: "51-2025-SC-004786-SCAX-WS",
    note: "Small claims judgment, paid in full only after a motion for contempt was filed."
  }
};
