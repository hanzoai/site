# /agents/* (template) — James-eye review

Reviewed: branch `claude/inspiring-lamport-6re0ay`, page files at `dd80650` (7 Nov 13:25), before it reached main. Members walked: `/agents/crew` and `/agents/sdk`, moving, at 1470×801 and 375×812 (videos, hovers, presses, idle checks).

Verdict: 5/10 (the lower member; /agents/crew alone would be 6)

First complaint: "There's a little label over the headline again, and one page is orange and green, the other blue and pink. Hanzo is black and white. It looks like every other AI site."

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** Crew: yes on both sizes, the ring of agents turns by itself (Antje, Des, Dev…). SDK desktop: yes, the console types a request and the agent answers. **SDK phone: no.** Nothing moves on the first screen; the console sits below the buttons, still.
2. **One in, one out?** Crew: yes, the ring pins while "People and agents. One workspace." replaces the hero text, then the dark Bots room takes over. SDK: the 01 / 02 / 03 cards stack over each other while the text pins. After that, SDK becomes a document: a six-item list of parts, then code.
3. **A real object in every section?** Crew: yes (ring, ring, Bots console). SDK: the "parts" list has no object, and the close is text only.
4. **One ask, sticky after the hero?** No. Crew has no ask of its own on desktop until "Launch a bot" in the dark room; the close is a text row. SDK asks four different things: "Read the docs", "View on GitHub", "Deploy to Cloud", plus the header's "Try Hanzo". At the top of SDK there are two solid buttons at once (header "Try Hanzo" and "Read the docs"). Phone gets a bottom bar, but it says "Launch a bot" on one page and "Read the docs" on the other, under a header still saying "Try Hanzo".
5. **Every hover and press answers?** No. "Read the docs", the pip / cargo tabs and Copy do nothing on hover; half the ring's agents answer, half do not. No press state on any of them.
6. **Overlap, font swap, layout shift?** No overlap or shift (layout shift 0 on both). **SDK on the phone throws a hydration error** ("server rendered HTML didn't match the client"); the dev badge shows over the bottom bar. On desktop the SDK console runs off the right edge of the screen, cutting its corner and the "you / agent" switch.
7. **Which reference, and is its motion there?** apple.com: pinned chapters, and it is there on desktop for both. Nothing of synchronized.studio (no card opens into a page) or osply.
8. **Different from its neighbours?** Yes: crew has the ring, SDK the console and stacked cards. The two members feel like different sites, though, because each picked its own colour.
9. **All 18 parts covered?** See below. `docs/PLAN-COMPONENTS.md` is not on main yet, so this is checked against the parts the brief names.
10. **Banned tells?** Yes:
    - Eyebrow above the h1 on both ("AGENTS", "HANZO AGENT · SDK").
    - UI colour: orange ring and arrow plus **green** "done" chips and live dot (crew); blue numerals, blue outline card, pink and mint code (SDK). JAMES.md allows 0 UI hues and bans green outright.
    - Header "Try Hanzo" fades on hover (shared header; reported once here).
11. **Copy untouched?** Yes, all of Hanzo's words are there (crew 31/31, SDK 94/94). One added label on crew: "Find an agent".

## Missing from the 18 parts
- One sticky ask, the same in header, hero, bottom bar and close.
- Press states on every button.
- An object in SDK's "parts" section and in both closes.
- Phone: SDK's first screen has no live object.

## Fixes
1. Remove the eyebrow above both h1s.
2. Take every hue out of the UI: ring, arrows, done chips, numerals, outline card and code tokens go to the ink and grey ladder. Colour may only come from Hanzo's media.
3. Pick one ask per member and use it everywhere: hero, sticky header button after the hero, phone bar and close. On SDK, "Read the docs" solid and "View on GitHub" as a text link; drop "Deploy to Cloud" as a second solid.
4. SDK phone: start the console demo on the first screen (move it above or beside the buttons) and fix the hydration mismatch.
5. Give every button and tab a hover that changes something and a press (scale 0.98 or 1px down).
6. SDK: keep the console inside the screen on desktop, or bleed it on purpose to the edge with no visible cut corner.
