# Requests from /zen/zen6-max (and /zen/7)

- content/ui-strings.json: "Breadcrumb" as the accessible name of the crumb `nav` (both Zen pages show one under their asks), and "Server" for the DGX B300/B200 radiogroup. Both are unnamed until approved.
- components/Ask.jsx: on desktop the ask bar floats over content (MASTER 3.2 rule 6 and 3.3 ban floating pill bars on desktop); on /zen/zen6-max it passes over the rack panel and sheet while scrolling.
- app/tokens.css: deck values (sizes, radii 6/20/24, durations 90/150/300/400/500, curves) are page tokens in ZenMax.css and ZenSeven.css until the shared tokens land; swap then.
- lib/cta.js and lib/track.js: not built yet; the pages use the kit Cta (data-cta zen6max.*, zen7.*).
