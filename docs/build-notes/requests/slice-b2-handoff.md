# Slice B2 handoff (8 Nov)

All 16 pages Ready and copycheck missing 0 against live hanzo.ai: /engine /enterprise /extension /features /flow /founder
/functions /gallery /gateway /gen /grants /guard /gui /help/privacy/model-training /history /hsm. npm run build exits 0.

What's left (all shared, outside slice B2's files):
- components/Ask.jsx: on phones the header keeps "Try Hanzo" instead of the page's own ask (flow, gen, gallery, engine, founder, grants).
- Shared header clips "Try Hanzo" at 320 px wide.
- /flow: Hanzo has no Flow photos or film in the repo; its panels stay drawn diagrams.
- Running copycheck in the cloud: hanzo.ai must be allowed (environment "hanzo-site"), and Chromium needs --no-sandbox as root
  (CHROME=<wrapper adding --no-sandbox --proxy-server=$HTTPS_PROXY>).
