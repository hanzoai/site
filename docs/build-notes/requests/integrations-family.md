# /integrations/* (template): shared changes requested

The template's shared asks are filed with the index, in `docs/build-notes/requests/integrations.md` (items 4-8), because the same header, cookie card and transition engine sit on both:
- review fix 2 (FooterHTML hydration): not a site bug. Traced on 7 Nov to the screenshot tool writing `caret-color` into the footer input's `style` before hydration; 0 errors in 12 painted loads with the caret left alone.
- review fix 3 (phone header ask, one solid fill): item 4.
- review fix 4 (cookie card over the hero object): item 7.
- review fix 6 (card-to-page transition timing, FamNext / Morph): item 8.
- the header "Try Hanzo" hover that only fades (fix 8, shared part): item 4.
