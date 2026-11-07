/* Hanzo Tag's own copy, shared by /slack (the session replay) and /tag (the mention map). Every string is Hanzo's,
   from content/pages/slack.html and the live page; the two pages lay it out differently. */

export const HERO = {
  kick: 'Hanzo Tag · @Hanzo & Code Channels for Slack',
  title: ['Tag @Hanzo in Slack.', 'Ship code, canvases, and', 'pull requests in the thread.'],
  lede: 'Hanzo Tag brings autonomous Code Channels, live Canvas summaries, branch diffs, and WIMSE-federated cloud agents straight into your existing Slack workspace.',
  points: [
    'Mention @Hanzo in any channel or thread to investigate bugs, query repositories, draft canvases, and open pull requests.',
    'Dedicated Code Channels pair your Slack thread with live Code, View, and Canvas artifacts so engineering and design iterate together.',
    'Enterprise WIMSE federated workload identity binds AWS IAM roles, GCP Workload Identity, verified gateways, and RFC 7523 auth servers.',
    'Full auditability with Scheduled Work, Memory, and Network event logs plus organization spend caps in Hanzo Admin Settings.',
  ],
  acts: [
    ['Set up Hanzo Tag', '/settings/organization/products?tab=tag'],
    ['Configure Federated Access (WIMSE)', '/settings/organization/products?tab=tag&sub=federated'],
    ['Slack integration docs', 'https://docs.hanzo.ai/docs/openapi/channel'],
  ],
  safe: 'Organization-scoped security: Hanzo Tag only reads channels where @Hanzo is added, uses federated workload identities instead of personal accounts, and never trains on your Slack data.',
};

export const SETUP = {
  title: 'Hanzo Tag · Slack Code Channel · #bug-button-darkmode',
  verified: 'WIMSE Federated Identity Verified',
  name: 'Hanzo Tag Setup',
  sub: '3 steps · Connected to Acme Inc',
  steps: [
    ['Connect Slack workspace', 'acme-inc.slack.com · 42 channels enabled'],
    ['Link GitHub & MCP tools', 'github.com/acme/* · Linear · Sentry · PagerDuty'],
    ['Bind WIMSE cloud roles', 'AWS IAM & GCP Workload Identity · RFC 7523'],
  ],
  model: 'Model: Enso Ultra + Kai',
  retention: 'Zero retention',
  channel: '#bug-button-darkmode',
  artifacts: 'Artifacts 3 · Canvas · Diff · Preview',
  chips: ['+32 -9 · styles/cta-button.css', 'Canvas: Fix Button Dark Mode'],
};

/* A message part is a string, or [kind, text]: 'at' a mention, 'code' a file or token. */
export const ASK = { who: 'harry', time: '9:30 AM', body: [['at', '@Hanzo'], ' the Buy Now button text is unreadable in dark mode on staging. Can you trace the CSS token and open a PR?'] };
export const ANSWER = { who: 'hanzo', time: '9:31 AM', body: ['Traced to ', ['code', 'styles/cta-button.css'], '. Updated text token to ', ['code', '#1A1A1A'], ' (WCAG AAA 8.9:1), wrote the Canvas summary, and opened PR \u0023418.'] };

export const PEOPLE = {
  hanzo: { name: 'Hanzo', role: 'APP', init: 'H' },
  dev: { name: 'Dev', role: 'Software', face: 'dev', init: 'D' },
  qa: { name: 'Qa', role: 'Quality', face: 'sci', init: 'Q' },
  zoe: { name: 'Zoe Maxwell', role: 'Design', init: 'ZM' },
  harry: { name: 'Harry Boone', role: 'Eng', init: 'HB' },
};
export const MEMBERS = ['dev', 'qa', 'zoe', 'harry'];

export const STEPS = ['1. Code trace', '2. Loop in design', '3. Decision', '4. Canvas summary', '5. E2E verify', '6. Session complete'];

/* The code channel, step by step: each step's messages, and the artifact it fills. */
export const SESSION = [
  { tab: 0, msgs: [{ who: 'dev', time: '9:31 AM', trace: [['Thinking', 'Checking the best fix for dark mode.'], ['Searched Codebase', '3 results found in components/ui/ and styles/'], ['Read 2 files', null, ['BuyNowButton.tsx', 'styles.css']], ['Done']], body: ['Found the issue: text color is too light on dark backgrounds. What color should we use instead?'] }] },
  { tab: 1, msgs: [{ who: 'harry', time: '9:32 AM', body: [['at', '@Zoe Maxwell'], ', what color should we use?'] }, { sys: 'Zoe Maxwell was added to #bug-button-darkmode by Harry Boone.' }] },
  { tab: 1, msgs: [{ who: 'zoe', time: '9:34 AM', body: ["Let's keep the pink and switch the text to ", ['code', '#1A1A1A'], '.'] }] },
  { tab: 2, msgs: [{ who: 'dev', time: '9:36 AM', body: ['Done! Updated ', ['code', 'styles/cta-button.css'], ' and wrote the root-cause summary in Canvas. ', ['at', '@Qa'], ' running e2e checks now.'], canvas: true }] },
  { tab: 1, msgs: [{ who: 'qa', time: '9:41 AM', body: ['Verified e2e across Chromium & Safari — WCAG AAA contrast (8.9:1) and checkout specs 28/28 green.'] }] },
  { tab: 0, msgs: [{ done: 'PR \u0023418 merged · E2E green' }] },
];

export const CANVAS = { title: 'Fix: Button Dark Mode', meta: 'Canvas · Updated just now', open: 'Open →' };

export const WINDOW = {
  title: 'Slack — Karma Style (karma.style) · #bug-button-darkmode',
  ready: 'Session ready', working: 'Working · Session channel', badge: 'Working', prReady: 'PR ready',
  team: 'Karma Style', host: 'karma.style', nav: ['Threads', 'Drafts & sent'],
  groups: [['SUPPORT', ['incident-alert']], ['CODE CHANNELS', ['bug-button-darkmode', 'tryon-3d-lookbook']]],
  repo: 'karma/storefront', branch: 'main → update-cta-button-color', artifacts: 'Artifacts 3', archive: 'Archive Channel',
};

export const TABS = ['Code', 'View', 'Canvas'];

/* the unified diff, as Hanzo shows it: [old line, new line, sign, text] */
export const DIFF = {
  head: 'Comparing main → update-cta-button-color', stat: '1 commit · 3 files changed ·', add: '+32', del: '-9', file: 'styles/cta-button.css', viewed: 'Viewed',
  lines: [
    [12, 12, ' ', '.cta-button {'],
    [13, 13, ' ', '  display: inline-flex;'],
    [14, 14, ' ', '  align-items: center;'],
    [15, null, '-', '  color: #e5e7eb;'],
    [16, null, '-', '  background: \u0023ec4899;'],
    [null, 15, '+', '  color: #1a1a1a;'],
    [null, 16, '+', '  background: \u0023f472b6;'],
    [null, 17, '+', '  font-weight: 600;'],
    [17, 18, ' ', '  border-radius: 8px;'],
    [18, 19, ' ', '}'],
  ],
};

export const VIEW = {
  before: 'BEFORE (LOW CONTRAST · 1.9:1)', after: 'AFTER FIX (#1A1A1A ON \u0023F472B6 · 8.9:1)', button: 'Buy Now — $49',
  note: 'Live preview sandboxes the branch build so design and engineering can approve visual changes directly inside the channel.',
  // Hanzo's copy names its pink hexes; they are written as \u0023 escapes so they stay text (frozen copy), never a UI colour
  // the two renders as the greys of equal luminance to the diff's colours, so the contrast they show is the same and no
  // hue reaches the page (deck greys only); the diff itself keeps Hanzo's text
  old: { color: '#e7e7e7', background: '#888888' }, fix: { color: '#1a1a1a', background: '#9f9f9f' },
};

export const WHAT = {
  kick: 'What it is', title: 'Your Slack channels become live engineering & operations rooms',
  lede: 'Keep context where your team already talks — without switching between chat, tickets, and diff viewers.',
  items: [
    ['01', 'Code Channels in Slack', 'Spin up a session channel for a bug or feature. @Hanzo searches your codebase, proposes the fix, loops in reviewers, and opens the PR.'],
    ['02', 'Live Canvas & Diff Artifacts', 'Every session produces structured root-cause Canvases, unified git diffs, and interactive visual previews alongside the conversation.'],
    ['03', 'Federated Agent Access (WIMSE)', 'Authenticate agents to AWS, GCP, and internal gateways using short-lived cryptographic workload tokens instead of static secrets.'],
  ],
};

export const BUILT = {
  kick: 'Built for Slack teams', title: 'From @Hanzo mention to merged pull request',
  items: [
    ['Explicit @Hanzo invocation', 'Hanzo stays quiet until tagged or scheduled. It reads only the channels it belongs to and responds right inside the thread.'],
    ['GitHub & GitLab branch workflows', 'Reads files, compares branches, runs test suites in isolated cloud sandboxes, and pushes verified commits to your repository.'],
    ['Shared organization MCP connectors', 'Grant Hanzo Tag access to the MCP connectors your organization has already configured — Linear, Sentry, Datadog, Notion, and more.'],
    ['Scheduled channel routines', 'Run recurring morning triage, release readiness checks, and incident summaries that post directly to designated Slack channels.'],
    ['WIMSE Cloud Roles & RFC 7523 Auth', 'Configure AWS/GCP IAM role ARNs, active-probed gateways, and OAuth JWT bearer authorization servers in Organization Settings.'],
    ['Activity & network audit logs', 'Inspect every scheduled run, workspace memory entry, and outbound network event from the Hanzo Tag Activity console.'],
  ],
  console: ['Open Hanzo Tag Activity Console', '/settings/organization/products?tab=tag&sub=activity'],
};

export const PLATFORM = {
  kick: 'Unified agent platform', title: 'Works alongside Hanzo Team, Hanzo Bot, and Hanzo in Chrome',
  items: [
    ['Hanzo Tag (/slack)', 'Native Slack integration with Code Channels, Canvas summaries, and WIMSE workload federation.'],
    ['Hanzo Team (hanzo.team)', 'First-party AI-native workspace with built-in Code Channels, Board, Drive, Calendar, Meet, and Inbox.'],
    ['Hanzo Bot (hanzo.bot)', 'Always-on resident bots with dedicated sandbox computers that connect to Slack, Discord, Telegram, WhatsApp, and iMessage.'],
    ['Hanzo in Chrome (/chrome)', 'Side-panel browser agent that captures live DOM/network repros and sends them straight to your Slack code channel.'],
  ],
  team: ['Explore Hanzo Team', '/team'],
  runtime: 'Same agent runtime across your workspace, Slack, browser, and cloud:',
  links: [['Hanzo Team', '/team'], ['Hanzo Tag for Slack', '/slack'], ['Hanzo Tag Governance', '/tag'], ['Hanzo in Chrome', '/chrome'], ['Hanzo Bot', '/bot']],
};

export const CODE = {
  kick: 'CODE CHANNELS FOR SLACK', title: 'Turn any Slack channel into a live coding session with @Hanzo.',
  lede: 'Mention @Hanzo in a channel or spin up a dedicated code channel. Inspect every file read, review live Canvas summaries and unified git diffs side-by-side, and merge the pull request without leaving the thread.',
};

export const FAQ = [
  ['What can Hanzo Tag see in Slack?', 'Hanzo only reads messages in public or private channels where @Hanzo has been added, and only inspects thread context when someone explicitly tags @Hanzo or when scheduled channel work executes.'],
  ['Does Hanzo respond only when someone tags it?', 'Yes. In channels, Hanzo only responds when someone mentions @Hanzo in a message or thread, or when a scheduled task configured by your team posts to that channel.'],
  ['Does Hanzo Tag use my personal accounts to do its work?', 'No. Hanzo Tag uses organization-scoped connectors, GitHub installations, and federated workload identities (WIMSE) configured by your organization owners rather than personal member accounts.'],
  ['Can Hanzo Tag use the MCP connectors we have already set up in Hanzo?', 'Yes. Any organization-level MCP connector enabled under Plugins & connectors can be granted to Hanzo Tag for channel queries, incident triage, and code channel workflows.'],
  ['How is Hanzo Tag billed?', 'Hanzo Tag is available on Team and Enterprise plans and is billed by usage — you pay for the work Hanzo does in channels, not per Slack seat. Direct messages to Hanzo count against the individual member’s own Hanzo plan limits.'],
  ['Is our Slack data used to train models?', 'No. Conversations with Hanzo Tag are never used to train models, and channel activity is isolated from individual members’ personal Hanzo chat history.'],
];

export const CLOSE = {
  title: 'Hanzo Tag', lede: 'Connect @Hanzo to your Slack workspace in three steps.',
  note: 'Available on Team and Enterprise plans with usage-based channel billing, spend caps, and zero training on your workspace conversations.',
  acts: [['Connect Slack Workspace', '/settings/organization/products?tab=tag'], ['Explore Hanzo Team', '/team'], ['Explore Hanzo in Chrome', '/chrome']],
};

/* The thread's grammar, drawn by both pages under their own class prefix (p). */
export const Parts = ({ body, p }) => body.map((x, i) => (typeof x === 'string' ? x : <span key={i} className={`${p}-${x[0]}`}>{x[1]}</span>));

/* A face: the person's initial on a drawn disc. Hanzo's memoji (dev.svg, sci.svg) belong in public/memoji/; hanzo.ai was
   unreachable from the build machine, so nothing is hotlinked and no broken picture or failed request reaches the page.
   Once the files are mirrored, MEMOJI turns them on (drawn over the disc, which stays as the fallback). */
const MEMOJI = false;
export function Face({ who, p, size = 32 }) {
  const m = PEOPLE[who];
  const pic = MEMOJI && m.face ? { backgroundImage: `url(/memoji/${m.face}.svg)`, backgroundSize: 'cover' } : null;
  return <span className={`${p}-face ${who}`} style={pic || undefined} aria-hidden="true">{m.init}</span>;
}

/* One message: a person, a system line, or the merged-PR banner. */
export function Msg({ m, p }) {
  if (m.sys) return <p className={`${p}-sys`}>{m.sys}</p>;
  if (m.done) return <p className={`${p}-merged`}><i aria-hidden="true" />{m.done}</p>;
  const who = PEOPLE[m.who];
  return (
    <div className={`${p}-msg`}>
      <Face who={m.who} p={p} />
      <div className={`${p}-msg-b`}>
        <p className={`${p}-msg-h`}><b>{who.name}</b>{who.role === 'APP' && <em>APP</em>}<time>{m.time}</time></p>
        {m.trace && (
          <ol className={`${p}-trace`}>
            {m.trace.map(([k, d, files], i) => (
              <li key={k} style={{ '--i': i }}><b>{k}</b>{d && <span>{d}</span>}{files && files.map((f) => <span key={f} className={`${p}-code`}>{f}</span>)}</li>
            ))}
          </ol>
        )}
        <p className={`${p}-msg-t`}><Parts body={m.body} p={p} /></p>
        {m.canvas && (
          <div className={`${p}-canvas-card`}>
            <span className={`${p}-canvas-ico`} aria-hidden="true" />
            <span><b>{CANVAS.title}</b><span>{CANVAS.meta}</span></span>
            <span className={`${p}-canvas-open`}>{CANVAS.open}</span>
          </div>
        )}
      </div>
    </div>
  );
}
