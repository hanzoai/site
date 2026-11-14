// `go get hanzo.ai/iam`: the import path is this site, not the host holding the code.
//
// The go tool asks for the import path with ?go-get=1 and reads one meta tag out of the answer. A static export has
// no middleware to write that tag, so it is page metadata, and every module below needs a page at its own name.
//
// Ported from hanzo-inc/app lib/go-modules.ts. The tag points at GitHub and not the forge: an unauthenticated clone
// of git.hanzo.ai answers `could not read Username`, so a tag naming it would fail for everyone who is not us,
// proxy.golang.org included. A module is listed only if github.com/hanzoai/<name> answers 200 to an anonymous
// request and the repository name equals the module name.
//
// The app shares the names of its product pages with modules and keeps ai, cloud, docdb, status, account and tasks
// on pages this site does not have, so those six get the module page here. /agent is a page of its own in the app, which
// shadows its module page and so its tag; here the /agent page carries it.

/** Modules whose name has no product page here: the module page at the address carries the tag. */
export const OWNED = [
  'lz4/v4', 'openai', 'openrouter', 'sdk', 'sendgrid', 'age', 'base-ha', 'builder', 'cd', 'cek', 'ci', 'cpy3', 'csqlite',
  'dashscope-go-sdk', 'dashscopego', 'dbx', 'egress', 'finance', 'flags', 'framework', 'gochimp3', 'graph', 'grpc-web',
  'ingress-parser', 'insights-go', 'kafka', 'kms-operator', 'livekit', 'log', 'ltx', 'namespace', 'notify', 'o11y-foundry',
  'onnxgo', 'orm', 'otel-collector', 'pdf', 'proto', 'pubsub-go', 'replicate', 'search-go', 'sqlcipher', 'sqlite',
  'sqlite-vec', 'tygoja', 'vfs', 'xorm', 'yaegi', 'zip',
  'account', 'ai', 'cloud', 'docdb', 'status', 'tasks',
];

/** Modules whose name is a product page of this site: that page carries the tag. */
export const SHARED = [
  'agent', 'authz', 'base', 'captable', 'commerce', 'dashboards', 'dataroom', 'functions', 'hsm', 'iam', 'idv', 'ingress',
  'metrics', 'o11y', 'pricing', 'pubsub', 's3', 'visor', 'zen',
];

export const MODULES = [...OWNED, ...SHARED];

/**
 * Modules whose CODE lives in the hanzo-go org rather than hanzoai. The import path does not move with them:
 * hanzo.ai/openai is the name a consumer pins whichever org holds the git repo, so moving a repo between orgs is a
 * one-line edit here. GitHub redirects a moved repo, but that is a courtesy and not a contract: it is lost the day
 * someone creates a new repo at the old name, and the clone then succeeds against the WRONG code.
 */
const GO_ORG = new Set(['tygoja', 'lz4', 'openai', 'openrouter', 'sendgrid', 'sdk']);

/**
 * The REPOSITORY a module path lives in: the path's first segment, never the whole path. A major-version module is
 * hanzo.ai/lz4/v4 and its repo is lz4; the /vN suffix is part of the MODULE path by Go's own rule.
 */
export const repoOf = (name: string) => {
  const repo = name.split('/')[0];
  return `https://github.com/${GO_ORG.has(repo) ? 'hanzo-go' : 'hanzoai'}/${repo}`;
};

/** The tag, defined once. `go-source` is what pkg.go.dev links "source" to. */
export function goImport(name: string) {
  const path = `hanzo.ai/${name}`;
  const repo = repoOf(name);
  return {
    'go-import': `${path} git ${repo}`,
    'go-source': `${path} ${repo} ${repo}/tree/main{/dir} ${repo}/blob/main{/dir}/{file}#L{line}`,
  };
}

/**
 * The module path a repo's go.mod declares, where it is not the repository's own GitHub address. It is the only path
 * `go get` accepts for the module, and the one pkg.go.dev files it under. Each value is read from that repo's go.mod;
 * when a module's `module` line moves, its entry here moves in the same change.
 */
const DECLARED: Record<string, string> = {
  'lz4/v4': 'hanzo.ai/lz4/v4',
  ci: 'hanzo.ai/ci',
  finance: 'hanzo.ai/finance',
  onnxgo: 'hanzo.ai/onnxgo',
  proto: 'hanzo.ai/proto',
  tygoja: 'hanzo.ai/tygoja',
  zip: 'hanzo.ai/zip',
  flags: 'github.com/hanzoai/flags/go',
  openai: 'github.com/hanzoai/go-openai',
  openrouter: 'github.com/hanzoai/go-openrouter',
  sdk: 'github.com/hanzoai/go-sdk/v8',
  sendgrid: 'github.com/hanzoai/sendgrid-go',
};

/** The path `go get` accepts for a module, and pkg.go.dev's name for it. */
export const modulePathOf = (name: string) => DECLARED[name] ?? repoOf(name).replace(/^https:\/\//, '');

/** Modules pkg.go.dev has no page for, so their page says so instead of linking one. */
export const UNREFERENCED = new Set(['proto']);
