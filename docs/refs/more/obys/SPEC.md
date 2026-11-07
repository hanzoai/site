# obys.agency: SPEC

Filmed 7 Nov 2026 (home page). Films: `desktop.mp4` and `phone.mp4`. Frames: `frames/`. Method: `../INDEX.md`. The home gallery is a WebGL scene and its project images come from `cms.obys.agency` (blocked, 38 requests), so **the desktop film never gets past the preloader** (it stops at "50"). The phone build uses plain images and did arrive, with grey boxes where the images are blocked. The page has no scroll (the document is one screen tall; the wheel drives the gallery) and no card could be clicked, so the scroll and card-to-page steps found nothing. Most values below are therefore **from code** (`/css/d.css`, `/css/m.css`, `/js/d.js`).

**Why it is in James's family:** black, white and `#fafafa` only, with colour coming from the project images alone (and the unfocused ones are turned grey). Its own grotesk is set at logo scale with line height 1, on a 12-column grid with confident asymmetry. One brand object does the work: the Obys "O" mark sits in the centre of the screen, and its two halves part to frame whichever project is centred.

**Honest verdict:** a reference for the brand-object idea and for type, plus the most pointer-aware code of the three, but the film is thin (WebGL off and blocked images leave a black loader). Do not copy the long counting preloader.

## Frames
| Frame | What it shows |
|---|---|
| `desk-01` | Black, nothing painted yet |
| `desk-02` | Black; a counter "03" at the right edge (mix-blend difference) |
| `desk-03` to `desk-09` | Stuck preloader: the white "O" mark in the centre, the counter at "50". The wheel steps change nothing |
| `phone-p1/p2` | Phone arrival: black screen, the "O" mark filled white with thin image outlines gathering at its centre |
| `phone-p3` | After the page arrives (about 7 s): white `#fafafa` page, a centred column of project images (grey, blocked), the mark's two black halves split to bracket the middle image. Header "OBYS®" left, "Work, About" with "Work" underlined, and "Copied" at the right (the walk tapped "Contact", which copies the email address) |
| `phone-p4` to `p6` | The walk reloaded the page, so these show the arrival again (outline "O", then the filled mark) |

## Measured motion
| Move | Value | Source |
|---|---|---|
| Arrival (phone, filmed at 1 fps) | black from 1 to 6 s: a thin outlined "O", then the filled mark, then images gather into it; at about 7 s the page turns white and the halves part | measured (film) |
| Arrival timeline | mark morphs from outline to fill in **1,400 ms expo in-out**; images centre in 1,200 ms expo in-out; a 1,600 ms expo in-out step; then the loader fades out in 300 ms cubic-out | from code |
| Top progress bar | 2.5 px bar, translateX 0 → 100.1%, **1,000 ms cubic-bezier(0.76, 0, 0.2, 1)** | measured (getAnimations) |
| Logo colour on arrival | black → white, **400 ms ease-out** | measured |
| Logo halves part (phone) | each half translateX ±65%, **800 ms cubic-bezier(0.16, 1, 0.3, 1)** | measured |
| Logo halves part (desktop) | ±137%, 1 s, same curve; the mark's width eases to fit the centred image in 1.6 s `(0.19, 1, 0.22, 1)` | from code |
| Focus by colour | the centred project is in full colour at opacity 1; every other one is greyscale, contrast 0.85, opacity 0.7 (phone: CSS filter, 400 ms; desktop: in the shader) | from code |
| Gallery glide | wheel input moves a target; each item eases toward it by 9% per frame (lerp 0.09) | from code |
| Hover a project title | the preview opens from its centre: clip-path inset(50%) → inset(0), **800 ms (0.16, 1, 0.3, 1)**; the image settles scale 1.15 → 1 over **1,600 ms**, same curve; the title cuts in over 1,200 ms expo-out; the logo halves part | from code (and 38 images measured at scale 1.15, 1,600 ms) |
| Text arrival | each line rises from translateY(102%) inside a clipped line; show 1,400 ms expo-out, meta lines 1,600 ms after a 560 ms delay; hide 300 ms cubic-out | from code |
| Link hover | 1 px underline draws in from the left, **800 ms (0.19, 1, 0.22, 1)**, and leaves to the right | from code |
| Email / back links | the underline wipes out to the right, **600 ms (0.16, 1, 0.3, 1)**, and redraws from the left on leave | from code |
| Contact tap | copies the email and the label becomes "Copied" | measured (phone film) |
| Scroll | none: document 801 px tall on desktop, 812 px on phone | measured |
| Ambient (no input, 2.4 s) | desktop 0% (stuck loader); phone 98.4%, but that window caught the arrival, so it is not idle motion | measured (frame difference) |
| Curves in the bundles | `(0.16, 1, 0.3, 1)` ×11, `(0.19, 1, 0.22, 1)` ×3; durations 0.8 s ×5, 1.6 s ×3, 1 s ×3, 0.6 s ×3, 0.3 s ×3 | from code |

## Measured layout
| Item | Desktop (1470) | Phone (375) |
|---|---|---|
| Root size | `html` 0.694 vw (10.2 px), so all type scales with the window | 3.125 vw (11.7 px) |
| Project titles (largest type) | Obys **81.7/81.7 px** (8 rem, line height 1), weight 400, −2.45 px (−0.03 em), centred at the bottom | n/a |
| About statement | 4 rem, line height 1.18, −0.03 em | 1.8 rem, line height 1.05 |
| Body | 11.2/13.5 px, −0.01 em | 12.9/15.5 px |
| Grid | 12 columns, gutter and margin 1 rem (10.2 px) | margin 1 rem |
| Header | 66 px, fixed, transparent, white with mix-blend difference | same |
| Logo mark | 13 rem (133 px) square, fixed at the centre of the screen | 13 rem |
| Palette | `#000`, `#fff`; phone page `#fafafa`; link hover grey `#c9c9c9` | same |

## The 5 moves it gives Hanzo
1. **The brand mark as the frame.** Hanzo's mark sits at the centre of a gallery and splits to bracket the item in focus: halves ±65% (phone) or ±137% (desktop), 800 ms to 1 s `(0.16, 1, 0.3, 1)`; the mark resizes to the item in 1.6 s `(0.19, 1, 0.22, 1)`. Hanzo's logo is black and white, so this is colour-safe. *Suits: home, model pages (a model gallery), customers.*
2. **Focus by colour.** Only the centred item keeps its colour; the rest go greyscale at contrast 0.85 and opacity 0.7, with a 400 ms change. This is James's rule 7 in one rule. *Suits: model launch galleries, customers, careers and team photo walls.*
3. **Previews that open from the centre.** clip-path inset(50%) → 0 in 800 ms, while the image settles 1.15 → 1 over 1,600 ms on the same curve. A hover that shows you something. *Suits: customers, press, solutions lists, the docs index.*
4. **Line cut-in plus underline wipes.** Lines rise from 102% in 1,400 ms expo-out; link underlines draw from the left (800 ms) and leave to the right. *Suits: every heading; header and footer links.*
5. **A tap that answers in words.** "Contact" copies the email and says "Copied" in place. *Suits: contact, press and investor emails, the docs "copy" buttons.*

## Gaps (do not copy)
- The counting preloader (03 → 100) holds the first screen for about 7 s on phone. James wants the hero in place and moving within 1 second.
- Body type at 11.2 px is too small for Hanzo's dense pages.
- No press state was found in the CSS (no `:active` rules).
- The gallery needs WebGL and a working image host; with either missing, the page is a black screen. Hanzo needs a non-WebGL fallback.
