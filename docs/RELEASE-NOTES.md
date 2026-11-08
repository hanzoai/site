# hanzo.ai redesign: release notes

## What this release is

A full redesign of hanzo.ai: **906 pages**. That is **897 site pages** (every URL in hanzo.ai's sitemap, plus the
home page) and **9 new sign-up and checkout pages** (listed under "Sign-up and checkout (new)").

- **The words, prices and links are the same as live hanzo.ai.** The redesign changes how pages look and move, never
  what they say. Copy was checked against live hanzo.ai on 8 Nov 2026: 148 of the 152 pages checked match word for
  word. The other four differ only in live demo feeds and sample content that Hanzo rotates (see README, "Known
  differences from live").
- **Light and dark.** Every page follows the visitor's saved Hanzo choice, or their device setting if they have none.
- **One idea per page.** Each page has its own main interaction (its "signature"), so no two pages move the same way.
  The old pattern every page shared (hero, then pinned scroll chapters, then proof, then a closing band) is gone.
- **Hanzo's palette only.** Pages use Hanzo's black, white and greys. Colour comes from Hanzo's own model art, films
  and logos.
- The only additions are the 9 sign-up and checkout pages and a few buy buttons, listed at the end under "Added by
  design (not on live)".

---

## Key pages

### Home (`/`)
The hero is live hanzo.ai's own hero, kept as it is. A prompt types into the desktop app while the phone answers and
the agent roster rolls, over a dotted field that swells under the pointer. Below it:
- **Backed by / Trusted by**: logo marquees (white logos in dark mode, black in light).
- **Models**: a card grid, Enso to Mori. The Enso feature card and eight model cards fit on one screen. Each film
  plays while it is on screen, and a click opens the model's page.
- **Products**: a 3D journey, App to Team. On wide screens the section holds in place and scrolling moves a camera
  through Hanzo's nine products in dock order. Each one is a graphite slab carrying its own screen, beside its name,
  address and links, word for word. Drag to turn one, click to open it, or use the dock to jump to any product.
  Phones, reduced motion and browsers without 3D get the dock with a stage.
- **Agents, Race, Cheaper, Pareto**: live figures on speed and cost, read from Hanzo's API.
- **Open source**, then **Pricing** (from the same price list as /pricing).
- Each section fits on one screen. A quiet "on this page" index on the right edge shows where you are and jumps to
  any section.

### Pricing (`/pricing`)
Rebuilt to the home page's standard: each section fits on one screen, over Hanzo's halftone. Every plan in the
chosen tab (Personal, Team or API) sits side by side, with its price, billing line, button and every feature. On a
phone the plans stack. Pro is marked Recommended and carries its usage switch on its card (3x, 5x, 15x, unlimited:
$15, $45, $95, $195). It never moves by itself, so the price you read is the one you get. Each paid rung goes to its
own checkout, as on live. "Compare plans" is now a rising stair of the personal plans: each step shows its price, the
three lines that differ and its own "Try Hanzo" button, and "Read more" opens the full line-by-line table. Enso's
per-token rates sit in a dark room of their own. Team has a seat mixer.

### Chat (`/chat`)
Rebuilt to the home page's standard: each section fits on one screen. "Ask anything. Enso picks the model." sits over
a working chat window. It runs itself once: the question visibly routes through Enso to the model that answers, then
it rests with a replay button. A prompt in the hero lets you type a question and land in Hanzo Chat. Chat's six tools
are now the page's dark room, a set of tiles that opens like a curtain. Then comes a card for whichever model answers:
point at a name to swap the card, and open it to go to that model's page. The page closes on "Ask anything" as a real
prompt, beside the three personal plans with working Go and Pro checkouts.

### Models (`/models`)
Rebuilt to the home page's standard: each section fits on one screen. The first screen is Hanzo's model grid, drawn
as live hanzo.ai draws it. Films play, and a light follows the pointer or walks the cards as you scroll. Any card
opens into its model's page. Further down:
- the catalogue, now the centrepiece: every model in one list, filtered by family, price or search, each row with its
  price in and out per million tokens and "Use it now";
- the three families as tiles in the page's dark room;
- Enso against Zen, and Kai's benchmark figures;
- a sample request that swaps its model by itself, with "Get free API key".

A collapsed "Every model" list links all 544 model and maker pages from here.

### About (`/about`)
Rebuilt to the home page's standard: each section fits on one screen. "Chasing the Pareto Frontier of AI" sits over
the frontier itself, full width. The frontier draws itself, and pointing at it reads out the year under your hand.
Hanzo's statement lights up word by word as you read it. The six reasons Hanzo builds are tiles that grow into full
sheets you can page through. The lede's four trade-offs are switches, and none turns another off ("Pick two? Keep all
four."). The open-source section is the page's dark room, the four runtimes are lit plates that tilt in, and the page
closes on "Try Hanzo" and "Book a call". The old pinned scene is gone.

### Dev (`/dev`)
Rebuilt to the home page's standard: each section fits on one screen. "Describe the change. Dev ships it." Dev works
in a session that runs by itself. Beside it, the changed file is a before/after slider: when the change lands, the
divider sweeps across on its own, then you can drag it. The hero offers "Get Hanzo Dev, $8/month" (Go's checkout)
beside "Open Dev". Below:
- the race in the page's dark room ("3.02× faster on the same coding tasks"), where each side replays its median
  task at the speed it actually ran;
- where Dev runs (terminal, web, cloud, Slack), on a rail you can throw;
- install as three tabs, then the source, questions and a paste-into-any-agent line;
- a close that repeats the headline and the Go offer.

### Enso (`/enso`)
Rebuilt to the home page's standard: each section fits on one screen. Prices and a way to buy are now in the first
screen: Hanzo's own hero over a band of the three tiers (Flash, Pro, Ultra), each with its prices in and out, what it
is for, and "Try Hanzo". The page's main piece is a switchboard in a dark room that opens like a curtain. Requests
stream through Enso, which sends each to the tier made for it, and you can send Hanzo's own task words by hand. Then
come the models as tiles and the GPQA Diamond explorer ("A New Pareto Frontier of Intelligence"), which puts any
model beside Enso's three tiers in a table you can sort by score or by cost. In dark mode the particle ring draws in
the light foreground colour (it was invisible before).

### Bot (`/bot`)
The org chart is the hero. Someone mentions a bot, a packet runs down the chart to that bot and across to the
teammate who checks its work, and the thread fills in underneath, ten channels in turn. A slider ("How many bots do
you need?", 1 to 10) lights the smallest plan that includes that many bots.

### Enterprise (`/enterprise`)
The hero is Hanzo's workspace writing its audit log inside four walls: Hanzo Cloud, your cloud, your servers,
air-gapped. The four places then appear as a tight list. Each row opens in place into its full detail. A prefill
tool shows how long Zen 6 takes to read prompts of different sizes on one DGX Spark, from Hanzo's measurements. The
repeated deployment block and the second dark room are gone.

### Studio (`/studio`)
Rebuilt to the home page's standard: each section fits on one screen. The hero is the product: a monitor and a
multi-track timeline that play by themselves. Grab the playhead and it's yours. "See plans, from $8/month" sits right
beside "Launch". Then comes one cinema screen in a dark room: the curtain and letterbox open as you arrive, and
Hanzo's camera moves (Dolly In, Crane Rise, 360° Orbit) run on stills one after another, or pick one to hold it. The
six creative models sit on a lit film strip, and each frame opens its model page. "Studio or Design?" points you to
the right product, and the page closes on a three-step ladder: launch Studio, see plans, or open Design.

### Benchmarks (`/benchmarks`)
A model launch told as a story, rebuilt to the home page's standard: each section fits on one screen and opens to
the rest through tabs, folds and sheets. Right under the headline is a live race at Hanzo's measured ratios, and you
pick what races: Zen 6 builds, D-LSA against full attention at a chosen context length, or the agent CodeRace
scenarios. Every result now has a way to buy beside it ("Start on Hanzo Cloud", plus Go or "View Models & Pricing").
Zen 6 has a dark room that opens like a curtain, and Kai's sixteen suites are tiles that tilt in and open to their
full numbers. Tick the suites that look like your work and the summary re-adds itself for just those. The pinned
chapters and scroll wipes are gone.

### Agents (`/agents`)
A dark room with Koma's film. A numbered terminal runs the five sign-up steps once. "Questions" is a conversation:
pick a question and Hanzo answers on screen, word by word, in the page's own words. The headless sign-up code is a
plain numbered block, and each step marks its own lines. Nothing pins.

### Blog (`/blog`)
A magazine front page, rebuilt to the home page's standard: each section fits on one screen. Under the "News &
Guides." masthead, the six latest posts take the cover in turn, each with its own art plate, and the plate swings
back in 3D like a turning cover. Hover or tap a headline in the index to bring it to the cover. The masthead lede
lights up word by word. The contents are now one pane beside the publishing strip, which shows every month Hanzo has
posted in. Tap a month to narrow the pane to it. Each post now ends in a dark room with its own product links and
the newsletter.

### Customers (`/customers`)
Hanzo's lede, right under the headline, lights up word by word as you read it. The case plate turns between
stories, and each opens into its full story. Every launch is listed with a year filter, and each row's figures rise
as you reach it. The pinned launch stage and the phone's sticky figure strip are gone.

### Careers (`/careers`)
The open roles are a deck of sheets. As you scroll, each role rises over the last. Click one and it fills the
screen, its title carrying into the role page. "Match what you know": pick a skill named in the role descriptions,
and the roles that ask for it stay lit while the rest step back. The 8-pill team filter is gone (each team had one
role).

### Platform (`/platform`)
The whole stack rests open beside the headline. Each of its eleven layers slides out and names itself, and the
pointer turns it. As you scroll, the camera travels down the stack group by group (API, MIND, ACT, RUN, SILICON).
Any layer opens its sheet. "Ask the map": type a word and the layers whose descriptions use it light up.

### Other company and story pages
- **History (`/history`)**: a giant year runs from 2014 to 2026 beside "Sovereign intelligence since 2014." Hanzo's
  statement lights word by word. The thirteen years are quick rows with a year rail. "Your year" shows what Hanzo was
  building when you started.
- **Philosophy (`/philosophy`)**: one hexagram walks the sixty-four in the hero. Press any line and it flips into the
  pattern that change makes, with its name and principle.
- **Investors (`/investors`)**: every measured figure rolls in digit by digit, named and linked to the run it comes
  from. "Read the source" lets you tick off each source as you open it.
- **Team (`/team`)**: Hanzo's tracker board works itself, with an agent cursor walking the cards. Ten channels open
  in one frame so you can walk through each one.
- **Press (`/press`)**: Hanzo's mark in a field of dots that bends to the pointer and ripples on a click. The
  boilerplate and the press email each copy in one press.
- **Brand (`/brand`)**: the mark's construction drawn on a magnetic dot field. You can set any of Hanzo's six greys
  on Hanzo White or Black and see whether it passes the contrast standard (WCAG AA).
- **Research (`/research`)**: an index of papers. The open-source statement lights word by word in a dark room. A
  bar per month narrows the index to what came out then.
- **Open source (`/open-source`)**: scrolling drives twelve credit panels sideways for one stretch (on phones, a
  swipe rail). "Contribute in your language" lists repositories by language.
- **Learn (`/learn`)**: the documentation drawn as a transit map. Hanzo's answer to "What is Hanzo?" lights word by
  word.
- **Leaderboard (`/leaderboard`)**: the board's ten token volumes race to their exact figures. A slider lets you
  climb the board yourself.

### Trust and security
- **Security (`/security`)**: control names resolve out of scrambled characters as the status check passes each
  layer. A reviewer's worksheet lets you tick each control. At six of six it hands you "Schedule Security Review".
- **Trust (`/trust`)**: an evidence cabinet whose drawers pull out one by one, each marked Published or On request.
  "Find a control" answers questionnaire terms (PKCE, SCIM, argon2id) as you type.

### Contact and sign-up pages
- **Contact (`/contact`)**: a patch panel. Choose why you are writing and the cable plugs into that route. Below is
  a live San Francisco clock and a one-tap copy of hello@hanzo.ai.
- **Contact sales (`/contact-sales`)**: the enquiry is a conversation, one question at a time with a progress line.
  It sends exactly what hanzo.ai sends, and your draft survives a reload.
- **Support (`/support`)**: type your question and the six ways to get help re-rank as you type. Whatever you typed
  becomes the subject of a ready-to-send email to support.
- **Newsletter (`/newsletter`)**: one question per screen. Beside it, a sheet of paper writes your answers down and
  folds into an envelope.
- **SMS opt-in (`/sms-opt-in`)**: a phone shows what you are agreeing to. Your number lands on its To line, and STOP
  and HELP sit on its keys.
- **Startups (`/startups`)**: a match card assembles beside the form as you fill it in.
- **Affiliate (`/affiliate`), Referral (`/referral`)**: "How it works" is one step per screen. The affiliate rules
  are drawn as small diagrams.
- **Founder (`/founder`)**: a merge counter driven by your scroll. Count your merged pull requests to see your
  level.
- **Bounty (`/bounty`)**: ten organizations' token bars race in a dark room. Steppers add up the points and credits
  at Hanzo's rates.
- **Grants (`/grants`)**: the three ways in land like stamps. Your application writes itself onto a card as you
  type.
- **Beta (`/beta`, `/beta/apply`)**: rebuilt to the home page's standard, each section on one screen. "Get there
  first." Pressing a pass stamps its name onto it, then it opens into a full sheet. A new "Skip the wait, go paid"
  section sets the Beta access pass beside the Go plan, straight to checkout, and the page closes in a dark room with
  Feedback and Book a call. The application asks one question at a time beside the pass you chose, and the pass now
  carries the same "Skip the wait, go paid" route to Go.
- **Buying specialist (`/buying-specialist`)**: a conversation on the left. On the right, a quote sheet fills one
  square per seat and re-prices as you go.

### Sign-up and checkout (new)
Nine new pages for the moment someone signs up or pays. **This site never collects a card number, a password or a
one-time code.** Each page shows the plan, the total and one clear action, and that action hands off to Hanzo's real
checkout or to Hanzo's sign-in (hanzo.id).
- **Pay (`/pay`)**: a doorway. A link naming a plan goes on to the cart; anything else goes to /pricing.
- **Cart (`/pay/cart`)**: one card with the plan, a card-only total and one button.
- **Card checkout (`/pay/confirm/card`)**: the plan, what is included and the total, then "Continue to card payment"
  to Hanzo's real card form. Every plan link now resolves to a real plan; no more "Cannot show this plan."
- **Sign up (`/signup`)**: "Create your Hanzo account", with Google or email on hanzo.id, and the chosen plan and
  price beside it.
- **Log in (`/login`)**: split from sign-up. The header's Log in now opens it.
- **Sign-in return (`/auth/callback`)**: a calm waiting state, then the next step (checkout, onboarding or Chat). It
  no longer dead-ends, and a failed sign-in says so plainly with "Try again".
- **Onboarding (`/onboarding`)**: two steps, what you will use first, then a plan from Free to Ultra. Paid plans go
  on to checkout.
- **Quickstart (`/docs/quickstart`)**: set your key and make your first request, with "Get an API key, free".
- **CLI docs (`/docs/cli`)**: install, sign in and start a session, with the same API-key button.

**Before launch:** a few hand-off addresses could not be read from live hanzo.ai and are marked CONFIRM in
`lib/handoff.js` (the card form, the sign-in address, the Google and sign-up settings, and where sign-in finishes).
Hanzo must confirm them before launch. README, "Hand-offs to Hanzo's real flows", lists each one.

### Product pages
- **API (`/api`)**: the hero terminal types a request to api.hanzo.ai and streams back the answer. Pick another
  endpoint and only the path changes, which shows the page's point: one host, one key.
- **CLI (`/cli`)**: drag a divider across the CLI's commands, from a pile of flags to a resource tree. You can build
  the install script yourself.
- **Chrome (`/chrome`)**: the side panel's session runs as a terminal. A site-policy tester shows whether the
  example allowlist lets the agent in.
- **Computer (`/computer`)**: a virtual desktop where an agent cursor works software that has no API. A pre-flight
  checklist uses only Hanzo's own warnings.
- **Design (`/design`)**: a before/after slider. On one side is the raw upload, on the other what one conversation
  made of it.
- **Desktop (`/desktop`)**: the app's job runs as a live terminal. "Cut the network" shows which agent keeps running
  offline.
- **Download (`/download`)**: one button that knows your system, with every other build fanning out around it. "Your
  kit" lists exactly your files.
- **Extension (`/extension`)**: three browser windows fanned like cards. The one you are using comes to the front,
  and the side panel slides in over a real page.
- **Gen (`/gen`)**: a split-flap board flips through all 23 agents. A command builder gives you the exact command.
- **IDE (`/ide`)**: an editor with memories surfacing in its gutter.
- **Kata (`/kata`)**: "Test. Repair. Verify." lights in turn while a live session runs beside it.
- **MCP (`/mcp`)**: drag a divider from an empty client config to Hanzo's, with its tools.
- **Operative (`/operative`)**: pick an objective and Operative answers while the desktop acts out each step.
- **Operator (`/operator`)**: six points as a card stack you flick away. You can drag a resource out of place on the
  cluster board and watch it revert.
- **SDKs (`/sdks`)**: the layers from the API specification down to your app lift apart in 3D and close again. The
  hero flips one request between OpenAI and Anthropic style.
- **Skills (`/skills`)**: a skill file beside an agent's context, where a word in a prompt wakes the matching skill.
- **Slack (`/slack`)**: scrolling plays the thread, from an @Hanzo mention to a merged pull request.
- **Tag (`/tag`)**: a mention map, with one @Hanzo at the centre and rings spreading across channels. "Will Hanzo see
  this?" answers by where a message lives.
- **Tabs (`/tabs`)**: shell panes split inside a browser window while their layout tree draws live.
- **Features (`/features`)**: three product rooms on a sideways gallery. Type a job to find the feature for it.
- **Gallery (`/gallery`)**: a light walks the wall frame to frame. Each app opens into a viewer.
- **Templates (`/templates`)**: scrolling drives the twelve templates sideways. The commands for the one in front
  are ready to copy.
- **Solutions (`/solutions`)**: Teams, Industries and Use cases as one selector over a film wall. Each tile lists
  that solution's jobs.
- **Integrations (`/integrations`)**: nineteen numbered tool cards behind family chips. Type a tool or language to
  narrow them.
- **Blockchain (`/blockchain`)**: "chain:" rolls through values under the headline. A coverage table shows every
  Web3 product against every chain.
- **Compare (`/compare`)**: a reading line moves down the comparison rows on its own. Press a row to hold it. "Count
  the Yes" re-counts over the rows you keep.
- **Comparison (`/comparison`)**: a receipt prints the cost of running the open-source stacks yourself. Strike out a
  line and it re-adds.

### Model pages (`/iro`, `/kai`, `/koe`, `/koma`, `/mori`, `/oto`, `/uta`, `/zen`)
Each model page has its own piece, built from what the model does:
- **Iro**: an image resolves out of noise.
- **Kai**: a decision tree resolves itself. On `/kai/guide`, Kai answers on screen.
- **Koe**: a voice waveform with its transcript.
- **Koma**: a four-shot timeline you scrub.
- **Mori**: a point cloud settles into a surface and turns.
- **Oto**: a live spectrogram firing Foley cues.
- **Uta**: a film you scrub.
- **Zen**: about 900 dots form Zen's picture. `/zen/models` sorts the Zen cards as a race, and `/zen/zen6-max`
  forms a DGX rack from dots.

### Hanzo Cloud and app product pages
About forty cloud products have their own page, among them `/analytics`, `/base`, `/dns`, `/gateway`, `/guard`,
`/kms`, `/machines`, `/s3`, `/search`, `/stream` and `/world`. Each gets its own live diagram of what it does, drawn
from a set of interactions so that neighbouring pages differ:
- a turning globe (`/dns`, `/ingress`, `/pubsub`, `/world`);
- a light you move to reveal detail (`/authz`, `/guard`, `/kms`);
- a zoom from the whole system into one part (`/base`, `/machines`);
- departure-board tiles (`/o11y`);
- layers that lift apart (`/s3`, `/tunnel`).

The app pages work the same way, for example:
- live calculators on `/billing`, `/captable`, `/payments`, `/treasury`, `/ledger` and `/zap`;
- a canvas you drag on `/console` and `/auto`;
- a document that gets stamped on `/sign`;
- an orders board on `/commerce`.

### 404
Every wrong address draws its own contour map, with a pin where you are. Live hanzo.ai's 404 offers four links; this
one also reads the address you tried and suggests the pages you may have meant.

---

## Page families (one template each)

- **`/models/*`** (544 pages: 73 maker shelves and 470 model pages): the card you pressed on /models lands as the
  page's name. Maker shelves plot every model by context window and can be re-sorted by context or rate.
- **`/cloud/*`** (42): each product's own console, built from the page's data. The family is a tight list whose
  rows open in place.
- **`/blog/*`**: a chapter book with a reading rail and a "minutes left" countdown from the post's stated read time.
- **`/customers/*`**: each story's chapters wipe up over the last as scenes. Press a figure to jump to the sentence
  that states it.
- **`/compare/*`**: opens on the rows Hanzo ran itself. "+ Reported" adds the vendors' own claims, and one switch
  folds the rows where everyone agrees.
- **`/benchmarks/*`** (27): the results table turns into its chart. Where a run is cited, one press reads it live.
- **`/oss/*`** (56): each repository row grows into a full card, with the git clone command ready to copy.
- **`/agents/*`**: split screen, with the live object held on one side while the words scroll on the other. On Crew,
  type what you need and the matching agent takes it.
- **`/solutions/*`** (18): the jobs as a sideways strip. An overlap finder shows which products two teams or
  industries share.
- **`/integrations/*`** (19): code is the hero, and only the lines that point at Hanzo type themselves in. A switch
  dims everything else.
- **`/legal/*`** (11): a calm reading room with a contents rail that follows you. A search shows how often each
  section uses a word.
- **`/careers/*`** (8): each role is a chapter book, with a fit meter and a three-step application.
- **`/blockchain/*`** (16): capabilities as a deck, one card at a time. "Your chain" answers for the chain you pick.
- **`/products/*`** (7): an api.hanzo.ai console that steps through the product, lighting the sentence it proves.

---

## Site-wide

- **Header and footer**: Hanzo's own header, menus and footer on every page. On many pages, once the hero's main
  button scrolls away, the header picks up that page's ask (for example "Open Hanzo Chat" on /chat).
- **Light and dark mode**: Hanzo's own system, as live hanzo.ai runs it:
  - `@hanzo/appearance` replays the visitor's saved choice before the first paint (or follows the device), and
    keeps the choice in step across Hanzo sites and tabs. As on live, there is no visible switch.
  - Colours come from `@hanzo/design`.
  - Dark mode was checked page by page. 233 hard-to-read spots on 47 pages were fixed with Hanzo's own colour tokens,
    and the checker now reports 0 of 152 pages.
  - Light mode is unchanged: 795 pages ship identical styles, and the rest show no colour differences.
- **Phones**: every page was laid out and checked at phone size (375px wide). Heavy pieces such as the home 3D
  journey fall back to simpler layouts on phones. Sideways galleries become swipe rails.
- **Motion**: each page has one signature interaction, and its sections arrive in different ways. Visitors who ask
  their device for reduced motion see finished, still states. Things that move by themselves can be paused.
- **Live figures**: model rates, research figures and plan prices are read from api.hanzo.ai at build time. If a
  source fails, the build stops rather than ship stale numbers. The home page also re-reads figures in the browser.
- **Technology**: Next.js 16 (upgraded from 15.5, static export), React 19, Motion 12. The 3D library loads only when the home products
  section comes near, never in the first load.
- **One price file**: plan prices and checkout links live in `lib/plans.js`, and every page reads them from there.

---

## Added by design (not on live)

A few pages gained a direct way to buy. Each uses Hanzo's own plan name and price from `lib/plans.js`. Live does not
show these. Any of them can be removed without affecting the rest of the page.

- **Home**: "Free to start · Go is $8/month, every model"
- **/chat** and **/enso**: "Go is $8/month…"
- **/dev**: "Get Hanzo Dev, $8/month"
- **/benchmarks**: "Use every model here, Go is $8/month"
- **/studio**: "See plans, from $8/month"
- **/beta**: "Skip the wait, go paid"
- **/about**: a "Try Hanzo" / "Book a call" row
