# /gen — James-eye review

Verdict: 6/10
First complaint: "There's a little label stuck above every heading, and a pill bar floating over the text. Get rid of both."

Walked 7 Nov, page file at `4b53974` (`components/pages/Gen.jsx`, `Gen.css`), on the 14:43 preview of main plus the Apps branches, judged against `docs/MASTER.md` and `docs/JAMES.md`. The machine was overloaded, so this was a light walk:
- a 9-second film of the first screen at 1470×801 and 375×812 with no input;
- hover and press on the primary;
- a full scroll pass at both widths;
- reduced motion, JS off and phone tap targets.

Motion was judged from the frames. Stills: `review/gen/desktop-walk.jpg`, `review/gen/phone-walk.jpg`, `review/gen/desktop-first-9s.jpg`.

## What works
- The hero object is its own idea: a split-flap board framed by Gen's four rails (tools, models, sessions, fences). It flips through all 23 agents by itself, and `$ gen --<agent>` types under it. Nothing else in the Apps group looks like it.
- The agents are keys that drive a real command builder. Pick an agent, flip a rail, and the exact `gen` command and its `hanzo dev` twin update with Copy.
- Monochrome now (taste.py passes), one black room ("MIT, in the open." over a field of agent flags), FAQ behind clicks.
- Press scales .98, hover darkens. JS off hides 0 of 44 text blocks; reduced motion leaves 0 running; no phone target under 44px. Parity: text 164/164, links 10/10.

## Card check
- `docs/coverage/gen.md` does not exist, so the verdict is capped at 7. All 18 parts are missing a `Done here:` line.

## The 11 answers
1. **Sells in 5 seconds, moves within 1 second?** The board moves by itself as soon as it paints. On the slow machine, the headline was the last thing to appear: it is visible without JS, but with JS its line mask held it back until about 8 s. Check that the h1 paints first.
2. **One in, one out, or a document?** Mostly scenes: install, Gen and Dev, agents, rails, the black room. The "Read" link grid and "Paste and ship" trail on after the FAQ.
3. **A real visual object in every section?** Yes: board, install window, agent keys, command builder, code blocks, flag field.
4. **One ask, in the sticky header?** No. The header says "Try Hanzo" while the page's ask is "Get API key". The page's ask instead rides in a floating pill at the bottom of the desktop screen ("Hanzo Gen · search · Get API key"), over the text. On phone, the bottom bar covers the agent tiles and code lines as you scroll.
5. **Every hover and press answers, no jumps?** Yes for the primary, the keys, the toggles and the Copy buttons.
6. **Overlaps, font swap, layout shift?** The floating pill sits over content at 1470×801, which is an overlap he now fails. No shift seen.
7. **Which reference, is its motion there?** grubogrubo.com playful but restrained micro-motion: yes, the board. Apple one-idea-per-screen: mostly.
8. **Different from neighbours?** Yes. A 4/8 copy column beside a departure board, unlike /api's console, /cli's terminal room or /bot's centred headline.
9. **18 parts (MASTER §2)?** No card. See below.
10. **Banned tells?** Yes:
    - a grey Zen Mono label directly above the h1 ("HANZO GEN · SELF-UPGRADING HARNESS");
    - a label directly above every h2 ("INSTALL", "GEN AND DEV", "AGENTS", "OUR RAILS", "IN THE HANZO CLI", "OPEN SOURCE", "QUESTIONS", "READ"); MASTER §3.1 allows these on captions and tags, never directly above an h1 or h2;
    - a floating pill bar over content.
11. **Copy untouched?** Yes (parity clean).

## Missing from the 18 parts
- **Card:** no coverage card at all, and no `Persona:` / `Goal:` / `CTA:` / metric lines.
- **Part 3 First impression:** no closing `Band`. The page ends on "Paste and ship".
- **Part 4 Conversion:** the header ask does not match the page's ask; the ask floats instead of living in the header.
- **Part 7 Visual system:** labels above headings.
- **Part 8 Components:** the agent picker's open list is the browser's own.
- **Part 16 Developer:** good: Copy on every line, install tabs. A rate-limited or error state for the builder is not shown.

## Fixes (in order)
1. **Delete every label sitting directly above a heading**, the h1's included. Keep the grey mono style only on the rail captions, tags and figure labels.
2. **Put "Get API key" in the sticky header** for this page (via `lib/cta.js`; write `docs/requests/gen.md` if the header needs a change). Turn off the floating desktop pill. On phone, keep a slim bar only if it never covers the tiles or code.
3. **End on a Band.** After the FAQ, close with "Get API key" as the one solid, with "Read the docs" as a text row. Move the "Read" grid and "Paste and ship" above the FAQ.
4. **Paint the headline first.** Render the h1 in its final place and start the line mask from there, so on a slow laptop the words never wait for the script.
5. **Write `docs/coverage/gen.md`**: 18 parts, each with real evidence.
