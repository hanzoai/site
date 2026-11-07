/* The /platform directory: every plane and what is in it (Hanzo's own labels and links). Shared by the page and its
   server route, which looks up each product's existing description for the hover preview. */
export const CAT = [
  ['AI', '/products/models', [['Models', '/models'], ['Agents', '/agents'], ['Inference', '/engine'], ['Embeddings', '/cloud/embeddings'], ['Providers', '/cloud/providers']]],
  ['Compute', '/products/machines', [['GPUs', '/cloud/gpus'], ['Machines', '/machines'], ['Containers', '/cloud/containers'], ['Functions', '/functions'], ['Edge', '/edge']]],
  ['Data', '/products/memory', [['Datastore', '/datastore'], ['Object Storage', '/s3'], ['Base', '/base'], ['Memory', '/cloud/memory']]],
  ['Dev', '/products/agents', [['CLI', '/cli'], ['Playground', '/playground'], ['Desktop', '/desktop'], ['API Keys', '/cloud/api-keys']]],
  ['Observe', '/products/record', [['Logs', '/cloud/logs'], ['Metrics', '/metrics'], ['Dashboards', '/dashboards'], ['O11y', '/o11y'], ['AI Metrics', '/cloud/ai-metrics']]],
  ['Security', '/products/identity', [['IAM', '/iam'], ['Authz', '/authz'], ['KMS', '/kms'], ['Secrets', '/cloud/secrets'], ['Audit', '/cloud/audit']]],
  ['Network', '/products/machines', [['Gateway', '/gateway'], ['DNS', '/dns'], ['Service Mesh', '/cloud/service-mesh'], ['Nodes', '/cloud/nodes']]],
];
