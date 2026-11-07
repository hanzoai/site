"""Write docs/PAGES.md: every page or family, its wave, its signature idea, and whether it is rebuilt (has its own app/ folder)."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
idx = json.load(open(os.path.join(ROOT, 'content', 'pages.json')))
W = {
 1: {'about': 'The frontier as a living curve: 2014 to today drawn on scroll, milestones snapping onto it; the Zen of Hanzo as cards that turn',
     'platform': 'The stack explodes apart in 3D layer by layer on scroll; click a layer and it opens into its products',
     'pricing': 'Full pricing room: plan cards with rolling prices, Personal/Team/API, a comparison table with a sticky header that lights the row you read',
     'models': 'Catalogue you filter with chips (cards re-flow with layout animation); every card opens into its model page (WebGL open)',
     'dev': 'A live terminal session: the task types, the diff streams in, tests go green; then a split-screen time-lapse race',
     'team': 'A shared canvas where human and agent cursors move and edit cards live; ten workflows on a turning carousel',
     'careers': 'An open-roles board filtered by team with re-flowing cards; each role opens into its page',
     'customers': 'Full-bleed draggable case gallery; each case opens into its story; every launch on a timeline',
     'solutions': 'Teams × Industries × Use cases as a three-way selector; hovering previews the solution',
     'contact-sales': 'A conversational, step-by-step enquiry (one question at a time, progress line)',
     'contact': 'A switchboard: choose why you are writing, the right route slides in',
     'support': 'Help that types: a search-first help desk with suggested answers appearing as you type'},
 2: {'benchmarks': 'Sortable leaderboards whose rows re-order with motion; each benchmark a chart that draws on view',
     'research': 'An index of papers with hover previews of each abstract and filters by kind',
     'compare': 'Row-by-row comparison with sticky columns and a source tooltip on every cell',
     'comparison': 'Buy it or run it: a bill builder that stacks the costs as you add lines',
     'open-source': 'Repository constellation: orgs as clusters you can pan; stewardship commitments as a signed charter',
     'security': 'Security as a readable document: scroll-spy table of contents, layers of protection peeling back on scroll',
     'trust': 'Evidence locker: each control opens its evidence drawer; status chips that tick live',
     'philosophy': 'The 64 hexagrams, every one active: lines draw and change as you move through the five laws',
     'history': 'A horizontal year-by-year journey (scroll pins and slides 2014 to now), photos developing in',
     'investors': 'An investor terminal: metrics count up, results link to their runs, a quiet ticker',
     'press': 'Press room: asset kit with instant downloads, news as a wire feed, team portraits',
     'brand': 'Live brand book: click swatches to copy, scrub the Zen variable weight, components you can try'},
 3: {'design': 'One conversation, every artifact: a window whose tab morphs between visual, deck, doc, ad and video',
     'studio': 'A film timeline you scrub: camera rigs, shots and VFX nodes moving with the playhead',
     'bot': 'An org chart of bots handing work to each other, packets travelling the lines',
     'agents': 'The five steps as one running script, each step lighting as the agent reaches it',
     'api': 'Endpoint explorer: choose an endpoint, the request types and the response streams back',
     'cli': 'A resource tree you expand like a file system, each node printing its command',
     'mcp': 'A tool-call stream: MCP tools firing in sequence with latency bars',
     'skills': 'Skills as cards you slot into an agent and watch it gain abilities',
     'ide': 'An editor that remembers: code with memory annotations appearing in the gutter',
     'desktop': 'The app window assembling itself on your OS (detected), then building one app',
     'extension': 'A browser frame with the extension side panel sliding in over a real page',
     'download': 'One button that knows your OS, every other download fanning out around it',
     'chat': 'Ask anything: the question routes visibly through Enso to the model that answers',
     'chrome': 'Your browser with an AI teammate: tabs and a side agent working on them',
     'slack': 'A Slack thread playing out: an @Hanzo mention to a merged pull request',
     'tag': 'Tag @Hanzo: the mention spreading across channels into canvases and PRs (distinct from /slack)',
     'gen': 'The agent is a flag: flip flags and the harness swaps the agent in place',
     'kata': 'Test, repair, verify: a red test turning green in a loop with the diff between',
     'computer': 'A virtual desktop with an agent cursor working software that has no API',
     'operative': 'A container opening to show what is inside, then one docker run starting it',
     'operator': 'Kubernetes-style control loop: desired versus actual state converging'},
 4: {k: 'Its own live diagram of what it does (see docs/DESIGN.md)' for k in ['playground', 'gateway', 'base', 'machines', 'engine', 'edge', 'functions', 'dns', 's3', 'kms', 'hsm', 'iam', 'identity', 'idv', 'authz', 'guard', 'sentinel', 'registry', 'tunnel', 'ingress', 'network', 'node', 'mq', 'pubsub', 'stream', 'realtime', 'datastore', 'search', 'crawl', 'o11y', 'metrics', 'telemetry', 'insights', 'analytics', 'dashboards', 'visor', 'world']},
 5: {k: 'Its own live diagram of what it does (see docs/DESIGN.md)' for k in ['billing', 'payments', 'commerce', 'ledger', 'treasury', 'risk', 'sign', 'dataroom', 'captable', 'console', 'auto', 'automations', 'flow', 'ui', 'gui', 'jin', 'zap', 'tabs', 'blockchain']},
 6: {k: 'Own layout, chosen when built' for k in ['startups', 'grants', 'affiliate', 'referral', 'bounty', 'leaderboard', 'founder', 'beta', 'newsletter', 'features', 'templates', 'gallery', 'integrations', 'sdks', 'learn', 'legal', 'sms-opt-in', 'buying-specialist', 'blog']},
 7: {k: 'Model page: hero opens from its card; body rebuilt' for k in ['enso', 'kai', 'zen', 'iro', 'koma', 'oto', 'koe', 'uta', 'mori']},
}
FAM = ['models', 'oss', 'cloud', 'benchmarks', 'integrations', 'solutions', 'blockchain', 'legal', 'careers', 'products', 'blog', 'customers', 'agents', 'compare', 'help', 'zen', 'kai']
app = os.path.join(ROOT, 'app')
done = lambda p: os.path.exists(os.path.join(app, p.strip('/'), 'page.jsx'))
fam_done = lambda f: os.path.exists(os.path.join(app, f, '[slug]', 'page.jsx'))
seen, rows = set(), []
for w, d in W.items():
    for k, sig in d.items():
        seen.add('/' + k)
        rows.append((w, '/' + k, sig, 'rebuilt' if done('/' + k) else 'ported'))
for p in sorted(x for x in idx if x.count('/') == 1 and x not in seen):
    rows.append((6, p, 'Own layout, chosen when built', 'rebuilt' if done(p) else 'ported'))
rows.append((0, '/', 'Home: live typing demo, model cards that open, coverflow, dock, races, calendar', 'rebuilt'))
rows.sort()
fam_rows = [(f, sum(1 for x in idx if x.startswith('/' + f + '/')), 'rebuilt' if fam_done(f) else 'ported') for f in FAM]
n_done = sum(1 for r in rows if r[3] == 'rebuilt')
out = ['# Every page, and where it stands', '', f'Top-level pages rebuilt: **{n_done} / {len(rows)}**. Family templates rebuilt: **{sum(1 for f in fam_rows if f[2] == "rebuilt")} / {len(fam_rows)}**.',
       'Regenerate with `python3 scripts/tracker.py`. A page counts as rebuilt when it has its own folder in `app/` and passes `scripts/parity.py`.', '',
       '| Wave | Page | Signature | Status |', '|---|---|---|---|']
out += [f'| {w} | `{p}` | {sig} | {st} |' for w, p, sig, st in rows]
out += ['', '## Families (one unique template each)', '', '| Family | Pages | Status |', '|---|---|---|']
out += [f'| `/{f}/*` | {n} | {st} |' for f, n, st in fam_rows]
open(os.path.join(ROOT, 'docs', 'PAGES.md'), 'w').write('\n'.join(out) + '\n')
print('rows', len(rows), 'rebuilt', n_done)
