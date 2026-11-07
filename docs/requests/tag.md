# /tag: requests to shared owners

1. **Memoji mirror** (`public/memoji/`, media-mirror owner). `dev.svg` and `sci.svg` were unreachable (hanzo.ai blocked, proxy 403). The shared `slackData.js` `Face` now draws initial discs and makes no request. Set `MEMOJI = true` there once the files are mirrored.
2. **A2Lines hydration under reduced motion** (`components/v2/A2Lines.jsx`). Same issue as on /slack: the server sends `translateY(105%)` and the client sends `none`. This was the "1 Issue" that showed on the reduced-motion and phone loads. /tag now imports `components/pages/skills/Lines.jsx` (as the coordinator asked) and gates its own reduced-motion state behind a mounted flag. The shared component still needs the fix.
3. **Header ask on phone** (shared header). It keeps "Try Hanzo" instead of "Set up Hanzo Tag" after the hero leaves.
4. **Cookie card on phone** (shared consent). It is about 400px tall at 375x812, against MASTER's 220px.
5. **Header solid plus the close's solid** (shared header). After the hero, the header's solid "Set up Hanzo Tag" shares the closing viewport with "Connect Slack Workspace". The page itself now has one solid fill there.
