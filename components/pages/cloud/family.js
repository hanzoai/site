// The 37 cloud products as Hanzo describes them on their own pages: the line under "Get X", the licence, the first
// command from "Paste and ship", and the real figures each page states (for its Sigil). Nothing here is invented;
// every value is copied from that product's page.
export const P = {
  playground: ['Playground', 'Hands-on sandbox for every product', 'Apache-2.0', 'hanzo.ai/skill.md', [8, 3]],
  gateway: ['Gateway', 'API gateway', 'Apache-2.0', 'hanzo gateway config get', [429, 6]],
  dns: ['DNS', 'DNS as code', 'Apache-2.0', 'hanzo dns zones list', [5, 2, 5]],
  ingress: ['Ingress', 'K8s ingress + static plugin', 'Apache-2.0', 'hanzo ingress routes list', [80, 443, 6]],
  tunnel: ['Tunnel', 'Secure tunnels', 'Apache-2.0', 'hanzo share', [3000, 127, 4]],
  registry: ['Registry', 'OCI image registry', 'Apache-2.0', 'hanzo registry images', [401, 2, 6]],
  machines: ['Machines', 'Long-running compute machines', 'Apache-2.0', 'hanzo visor machines list', [3.48, 27.84, 2540, 80, 16896, 528]],
  functions: ['Functions', 'Serverless functions', 'Apache-2.0', 'hanzo functions list', [4, 4, 6]],
  engine: ['Engine', 'AI inference engine', 'Apache-2.0', 'hanzo engine serve <model>', [3, 2, 8]],
  edge: ['Edge', 'Edge compute', 'Apache-2.0', 'hanzo.ai/skill.md', [600, 4, 2.5]],
  visor: ['Visor', 'Machines, volumes, and clusters', 'Apache-2.0', 'hanzo visor machines list', [3, 6]],
  network: ['Network', 'Decentralized compute network', 'Apache-2.0', 'hanzo network list', [10, 6]],
  node: ['Node', 'Standalone Hanzo node', 'Apache-2.0', 'hanzo node list', [5, 3, 10]],
  base: ['Base', 'Embedded data backend with IAM-native auth', 'MIT', 'hanzo base bases list', [4, 6, 3]],
  datastore: ['Datastore', 'Document datastore', 'Apache-2.0', 'hanzo provisioning datastore create', [8123, 9000, 12]],
  s3: ['Object Storage', 'Distributed object storage', 'Apache-2.0', 'hanzo s3 buckets list', [10, 4, 4]],
  search: ['Search', 'AI-powered search', 'Apache-2.0', 'hanzo search create', [99, 1450, 10000, 2500]],
  crawl: ['Crawl', 'Crawl, scrape, and embed', 'Apache-2.0', 'hanzo crawl create', [49, 499, 50000, 500000]],
  realtime: ['Realtime', 'Realtime channels + presence', 'Apache-2.0', 'hanzo.ai/skill.md', [30, 3, 2]],
  mq: ['MQ', 'Message queue', 'Apache-2.0', 'hanzo mq stream list', [6379, 10, 100, 60000]],
  pubsub: ['PubSub', 'Pub/sub messaging', 'Apache-2.0', 'hanzo pubsub publish', [4222, 3, 1000000]],
  stream: ['Stream', 'Event stream', 'Apache-2.0', 'hanzo.ai/skill.md', [9092, 12, 4]],
  iam: ['IAM', 'Identity + access (hanzo.id)', 'Apache-2.0', 'hanzo iam whoami', [256, 65, 3]],
  identity: ['Identity', 'The sign-in your users actually see.', 'Apache-2.0', 'hanzo.ai/skill.md', [2, 3, 6]],
  idv: ['IDV', 'Identity verification', 'Apache-2.0', 'hanzo.ai/skill.md', [256, 4, 6]],
  authz: ['Authz', 'Fine-grained authorization', 'Apache-2.0', 'hanzo authz check', [65, 4, 6]],
  kms: ['KMS', 'Secrets + key management', 'Apache-2.0', 'hanzo kms secrets create', [256, 3, 6]],
  hsm: ['HSM', 'Hardware security module', 'Apache-2.0', 'hanzo.ai/skill.md', [65, 11, 4]],
  guard: ['Guard', 'AI guardrails', 'Apache-2.0', 'hanzo.ai/skill.md', [6, 6]],
  o11y: ['O11y', 'Observability suite', 'Apache-2.0', 'hanzo o11y logs get', [4317, 4318, 4]],
  metrics: ['Metrics', 'Time-series metrics', 'Apache-2.0', 'hanzo metrics query', [4, 6]],
  telemetry: ['Telemetry', 'OpenTelemetry ingest', 'Apache-2.0', 'hanzo.ai/skill.md', [6, 3]],
  dashboards: ['Dashboards', 'Composable dashboards', 'Apache-2.0', 'hanzo o11y dashboards list', [4, 6]],
  sentinel: ['Sentinel', 'Error tracking', 'BSL-1.1', 'hanzo.ai/skill.md', [10000, 1]],
  insights: ['Insights', 'Product insights + experiments', 'MIT', 'hanzo.ai/skill.md', [4, 6]],
  analytics: ['Analytics', 'Product analytics on your data', 'Apache-2.0', 'hanzo.ai/skill.md', [127543, 4.87, 45892]],
  world: ['World', '3D world building', 'Apache-2.0', 'hanzo world news', [50, 95, 99, 1000000]],
};

// families: the products that answer neighbouring questions, so a visitor can pick the right one
export const FAMILIES = [
  ['The front door', ['gateway', 'dns', 'ingress', 'tunnel', 'registry', 'playground']],
  ['Compute', ['machines', 'functions', 'engine', 'edge', 'visor', 'network', 'node']],
  ['Data', ['base', 'datastore', 's3', 'search', 'crawl', 'realtime']],
  ['Messaging', ['mq', 'pubsub', 'stream']],
  ['Identity and keys', ['iam', 'identity', 'idv', 'authz', 'kms', 'hsm', 'guard']],
  ['Seeing what runs', ['o11y', 'metrics', 'telemetry', 'dashboards', 'sentinel', 'insights', 'analytics', 'world']],
];

export const familyOf = (slug) => FAMILIES.find(([, m]) => m.includes(slug));
