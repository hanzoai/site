/* Hanzo MCP, per client: what each one takes, as its own docs say today (2026-11-09).
   The picker on the home page (components/McpPicker.jsx) draws this file, and docs.hanzo.ai/docs/guides/coding says the
   same words: change one, change the other (docs LLM.md, "MCP clients").

   Three ways to connect, and a client lists only the ways its docs support:
     signin  the client signs in to Hanzo (OAuth), no key. OFF until "Sign in with Hanzo" is live: set SIGN_IN to true.
     key     the hosted door, `Authorization: Bearer <key>`, with a key from hanzo.app
     local   `npx -y hanzo mcp`, the native hanzo-mcp over stdio, which uses the sign-in `hanzo login` stored
   A client whose docs do not support a way has no entry for it, and `none` says why in a clause. A client left with no
   available way is not listed.
   Every entry names, in `from`, the page of the client's own docs it was checked against. */

export const SIGN_IN = false;

export const MCP_URL = 'https://api.hanzo.ai/v1/mcp';
export const KEY_URL = 'https://hanzo.app';
export const DOCS = 'https://docs.hanzo.ai/docs/guides/coding/';

const KEY = 'sk-...';
const REMOTE = 'hanzo-cloud'; // the hosted door; `hanzo` is the local server's name everywhere
const LOCAL = 'hanzo';
const BEARER = 'Bearer ' + KEY;
const NPX = { command: 'npx', args: ['-y', 'hanzo', 'mcp'] };
// two-space JSON with a short array of strings kept on its own line, as a person writes it
const json = (o) => JSON.stringify(o, null, 2).replace(/\[\s*((?:"[^"\n]*",?\s*)+?)\s*\]/g, (_, xs) => '[' + xs.replace(/\s*\n\s*/g, ' ').trim() + ']');
const way = (from, hint, code) => ({ from, hint, code });

export const WAYS = [
  { id: 'signin', name: 'Sign in with Hanzo', on: SIGN_IN },
  { id: 'key', name: 'API key', on: true },
  { id: 'local', name: 'Local', on: true },
];

export const CLIENTS = [
  {
    id: 'dev', name: 'Hanzo Dev', icon: 'Hanzo Dev', page: 'dev#hanzo-mcp',
    // verified against https://github.com/hanzoai/dev (crates/hanzo-config, upstream/codex config: mcp_types.rs), run with `dev mcp`
    signin: way('https://github.com/hanzoai/dev', 'Add to `~/.hanzo/dev/config.toml`, then run `dev mcp login hanzo-cloud`.',
      `[mcp_servers.${REMOTE}]\nurl = "${MCP_URL}"`),
    key: way('https://github.com/hanzoai/dev', 'Add to `~/.hanzo/dev/config.toml`.',
      `[mcp_servers.${REMOTE}]\nurl = "${MCP_URL}"\nhttp_headers = { Authorization = "${BEARER}" }`),
    local: way('https://github.com/hanzoai/dev', 'Already in `~/.hanzo/dev/config.toml` on a new install, so there is nothing to add. Install it with `curl -fsSL hanzo.sh | sh`.',
      `[mcp_servers.${LOCAL}]\ncommand = "hanzo-mcp"\nargs = []`),
  },
  {
    id: 'claude', name: 'Claude', icon: 'Claude', page: 'claude#hanzo-mcp',
    // verified against https://claude.com/docs/connectors/custom/add-unlisted
    signin: way('https://claude.com/docs/connectors/custom/add-unlisted', 'In claude.ai or Claude Desktop, open `Customize > Connectors > Add custom connector` and fill in:',
      `Name: Hanzo\nURL: ${MCP_URL}\nAuthentication: Sign in now`),
    key: way('https://claude.com/docs/connectors/custom/add-unlisted', 'Claude Desktop: open `Settings > Developer > Edit Config` and add to `claude_desktop_config.json`, or connect `https://api.hanzo.ai/v1/mcp` under `Customize > Connectors > Add custom connector`.',
      json({ mcpServers: { [REMOTE]: { url: MCP_URL, headers: { Authorization: BEARER } } } })),
    // verified against https://modelcontextprotocol.io/docs/develop/connect-local-servers
    local: way('https://modelcontextprotocol.io/docs/develop/connect-local-servers', 'Claude Desktop: open `Settings > Developer > Edit Config`, then add to `claude_desktop_config.json`.',
      json({ mcpServers: { [LOCAL]: NPX } })),
  },
  {
    id: 'chatgpt', name: 'ChatGPT', icon: 'ChatGPT',
    none: { key: 'sends no API key', local: 'does not run local servers' },
    // verified against https://developers.openai.com/plugins/deploy/connect-chatgpt
    signin: way('https://developers.openai.com/plugins/deploy/connect-chatgpt', 'In ChatGPT on the web, open chatgpt.com/plugins, choose the plus button, then `Add custom MCP server`, and fill in:',
      `Name: Hanzo\nServer URL: ${MCP_URL}\nAuthentication: OAuth`),
  },
  {
    id: 'openclaw', name: 'OpenClaw', icon: 'OpenClaw', page: 'openclaw#hanzo-mcp',
    none: {},
    // verified against https://docs.openclaw.ai/cli/mcp/registry and https://docs.openclaw.ai/cli/mcp/transports
    signin: way('https://docs.openclaw.ai/cli/mcp/transports', 'Run these with the Gateway stopped.',
      `openclaw mcp set ${REMOTE} '${JSON.stringify({ url: MCP_URL, transport: 'streamable-http', auth: 'oauth' })}'\nopenclaw mcp login ${REMOTE}`),
    key: way('https://docs.openclaw.ai/cli/mcp/transports', 'Run this with the Gateway stopped. It saves the server under `mcp.servers` in `~/.openclaw/openclaw.json`.',
      `openclaw mcp set ${REMOTE} '${JSON.stringify({ url: MCP_URL, transport: 'streamable-http', headers: { Authorization: BEARER } })}'`),
    local: way('https://docs.openclaw.ai/cli/mcp/registry', 'Run this with the Gateway stopped.',
      `openclaw mcp add ${LOCAL} --command npx --arg -y --arg hanzo --arg mcp`),
  },
  {
    id: 'hermes', name: 'Hermes', icon: 'Hermes Agent', page: 'agents#hanzo-mcp-in-hermes-agent',
    // verified against https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp
    signin: way('https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp', 'Add to `~/.hermes/config.yaml`, then run `hermes mcp login hanzo-cloud` in a new terminal.',
      `mcp_servers:\n  ${REMOTE}:\n    url: "${MCP_URL}"\n    auth: oauth`),
    key: way('https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp', 'Add to `~/.hermes/config.yaml`, then run `/reload-mcp` in the chat.',
      `mcp_servers:\n  ${REMOTE}:\n    url: "${MCP_URL}"\n    headers:\n      Authorization: "${BEARER}"`),
    local: way('https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp', 'Add to `~/.hermes/config.yaml`, then run `/reload-mcp` in the chat.',
      `mcp_servers:\n  ${LOCAL}:\n    command: "npx"\n    args: ["-y", "hanzo", "mcp"]`),
  },
  {
    id: 'nanoclaw', name: 'NanoClaw', icon: 'NanoClaw', page: 'nanoclaw#hanzo-mcp',
    none: { signin: 'documents no sign-in for a remote server' },
    // verified against https://github.com/nanocoai/nanoclaw (src/cli/resources/groups.ts, docs/templates.md)
    key: way('https://github.com/nanocoai/nanoclaw/blob/main/src/cli/resources/groups.ts', 'Run in your terminal, with the id of the agent group that should get Hanzo. The second command restarts it.',
      `ncl groups config add-mcp-server --id <group-id> --name ${REMOTE} --url ${MCP_URL} --headers '${JSON.stringify({ Authorization: BEARER })}'\nncl groups restart --id <group-id>`),
    local: way('https://github.com/nanocoai/nanoclaw/blob/main/src/cli/resources/groups.ts', 'Run in your terminal, with the id of the agent group that should get Hanzo. The second command restarts it.',
      `ncl groups config add-mcp-server --id <group-id> --name ${LOCAL} --command npx --arg -y --arg hanzo --arg mcp\nncl groups restart --id <group-id>`),
  },
  {
    id: 'claude-code', name: 'Claude Code', icon: 'Claude Code', page: 'claude-code#hanzo-mcp',
    // verified against https://code.claude.com/docs/en/mcp
    signin: way('https://code.claude.com/docs/en/mcp', 'Run this in your terminal, then run `/mcp` in Claude Code and follow the steps in your browser.',
      `claude mcp add --transport http --scope user ${REMOTE} ${MCP_URL}`),
    key: way('https://code.claude.com/docs/en/mcp', 'Run this command in your terminal.',
      `claude mcp add --transport http --scope user ${REMOTE} ${MCP_URL} --header "Authorization: ${BEARER}"`),
    local: way('https://code.claude.com/docs/en/mcp', 'Run this command in your terminal.',
      `claude mcp add --scope user ${LOCAL} -- npx -y hanzo mcp`),
  },
  {
    id: 'cursor', name: 'Cursor', icon: 'Cursor', page: 'cursor#hanzo-mcp',
    // verified against https://cursor.com/docs/mcp
    signin: way('https://cursor.com/docs/mcp', 'Add to `~/.cursor/mcp.json`, then sign in from Cursor\'s MCP settings, or run `cursor-agent mcp login hanzo-cloud`.',
      json({ mcpServers: { [REMOTE]: { url: MCP_URL } } })),
    key: way('https://cursor.com/docs/mcp', 'Add to `~/.cursor/mcp.json`.',
      json({ mcpServers: { [REMOTE]: { url: MCP_URL, headers: { Authorization: BEARER } } } })),
    local: way('https://cursor.com/docs/mcp', 'Add to `~/.cursor/mcp.json`.',
      json({ mcpServers: { [LOCAL]: NPX } })),
  },
  {
    id: 'codex', name: 'Codex', icon: 'Codex', page: 'codex#hanzo-mcp',
    // verified against https://developers.openai.com/codex/mcp
    signin: way('https://developers.openai.com/codex/mcp', 'Run these in your terminal.',
      `codex mcp add ${REMOTE} --url ${MCP_URL}\ncodex mcp login ${REMOTE}`),
    key: way('https://developers.openai.com/codex/mcp', 'Add to `~/.codex/config.toml`.',
      `[mcp_servers.${REMOTE}]\nurl = "${MCP_URL}"\nhttp_headers = { "Authorization" = "${BEARER}" }`),
    local: way('https://developers.openai.com/codex/mcp', 'Run this command in your terminal. It adds the server to `~/.codex/config.toml`.',
      `codex mcp add ${LOCAL} -- npx -y hanzo mcp`),
  },
  {
    id: 'vscode', name: 'VS Code / Copilot', icon: 'VS Code', page: 'vscode#hanzo-mcp',
    // verified against https://code.visualstudio.com/docs/agents/reference/mcp-configuration
    signin: way('https://code.visualstudio.com/docs/agents/reference/mcp-configuration', 'Run `MCP: Open User Configuration` in the Command Palette and add this. VS Code opens a browser to sign in the first time it connects.',
      json({ servers: { [REMOTE]: { type: 'http', url: MCP_URL } } })),
    key: way('https://code.visualstudio.com/docs/agents/reference/mcp-configuration', 'Run `MCP: Open User Configuration` in the Command Palette and add this. VS Code asks for the key when the server first starts and stores it.',
      json({
        servers: { [REMOTE]: { type: 'http', url: MCP_URL, headers: { Authorization: 'Bearer ${input:hanzo-key}' } } },
        inputs: [{ type: 'promptString', id: 'hanzo-key', description: 'Hanzo API key', password: true }],
      })),
    local: way('https://code.visualstudio.com/docs/agents/reference/mcp-configuration', 'Run `MCP: Open User Configuration` in the Command Palette and add this.',
      json({ servers: { [LOCAL]: { type: 'stdio', ...NPX } } })),
  },
  {
    id: 'windsurf', name: 'Windsurf', icon: 'Windsurf', page: 'windsurf#hanzo-mcp',
    // verified against https://docs.windsurf.com/plugins/cascade/mcp
    signin: way('https://docs.windsurf.com/plugins/cascade/mcp', 'In Cascade, open the MCP menu and choose `Open MCP config file`, then add this.',
      json({ mcpServers: { [REMOTE]: { serverUrl: MCP_URL } } })),
    key: way('https://docs.windsurf.com/plugins/cascade/mcp', 'In Cascade, open the MCP menu and choose `Open MCP config file` (`~/.config/devin/mcp_config.json`), then add this.',
      json({ mcpServers: { [REMOTE]: { serverUrl: MCP_URL, headers: { Authorization: BEARER } } } })),
    local: way('https://docs.windsurf.com/plugins/cascade/mcp', 'In Cascade, open the MCP menu and choose `Open MCP config file`, then add this.',
      json({ mcpServers: { [LOCAL]: NPX } })),
  },
  {
    id: 'amp', name: 'Amp', icon: 'Amp', page: 'agents#hanzo-mcp-in-amp',
    // verified against https://ampcode.com/docs/customize/mcp
    signin: way('https://ampcode.com/docs/customize/mcp', 'Run this in your terminal. Amp opens the sign-in page in your browser the next time it starts.',
      `amp mcp add ${REMOTE} ${MCP_URL}`),
    key: way('https://ampcode.com/docs/customize/mcp', 'Add to `~/.config/amp/settings.json` (`amp config edit` opens it).',
      json({ 'amp.mcpServers': { [REMOTE]: { url: MCP_URL, headers: { Authorization: BEARER } } } })),
    local: way('https://ampcode.com/docs/customize/mcp', 'Run this command in your terminal.',
      `amp mcp add ${LOCAL} -- npx -y hanzo mcp`),
  },
  {
    id: 'gemini', name: 'Gemini CLI', icon: 'Gemini CLI', page: 'agents#hanzo-mcp-in-gemini-cli',
    // verified against https://geminicli.com/docs/tools/mcp-server
    signin: way('https://geminicli.com/docs/tools/mcp-server', 'Add to `~/.gemini/settings.json`, then run `/mcp auth hanzo-cloud` in Gemini CLI.',
      json({ mcpServers: { [REMOTE]: { url: MCP_URL, type: 'http' } } })),
    key: way('https://geminicli.com/docs/tools/mcp-server', 'Run this command in your terminal. It adds the server to `~/.gemini/settings.json`.',
      `gemini mcp add --transport http --scope user --header "Authorization: ${BEARER}" ${REMOTE} ${MCP_URL}`),
    local: way('https://geminicli.com/docs/tools/mcp-server', 'Add to `~/.gemini/settings.json`.',
      json({ mcpServers: { [LOCAL]: NPX } })),
  },
  {
    id: 'warp', name: 'Warp', icon: 'Warp', page: 'warp#hanzo-mcp',
    // verified against https://docs.warp.dev/agents/capabilities/mcp
    signin: way('https://docs.warp.dev/agents/capabilities/mcp', 'In Warp, open `Settings > Agents > MCP servers`, choose `+ Add` and paste this. Warp opens a browser to sign in.',
      json({ mcpServers: { [REMOTE]: { url: MCP_URL } } })),
    key: way('https://docs.warp.dev/agents/capabilities/mcp', 'In Warp, open `Settings > Agents > MCP servers`, choose `+ Add` and paste this.',
      json({ mcpServers: { [REMOTE]: { url: MCP_URL, headers: { Authorization: BEARER } } } })),
    local: way('https://docs.warp.dev/agents/capabilities/mcp', 'In Warp, open `Settings > Agents > MCP servers`, choose `+ Add` and paste this.',
      json({ mcpServers: { [LOCAL]: NPX } })),
  },
  {
    id: 'grok', name: 'Grok Build', icon: 'Grok Build', page: 'agents#hanzo-mcp-in-grok-build',
    // verified against https://docs.x.ai/build/features/mcp-servers, and run with grok 1.0.67 (`grok mcp add`)
    signin: way('https://docs.x.ai/build/features/mcp-servers', 'Run this in your terminal, then open `/mcps` in Grok Build and press `i` on the server to sign in.',
      `grok mcp add --transport http ${REMOTE} ${MCP_URL}`),
    key: way('https://docs.x.ai/build/features/mcp-servers', 'Run this command in your terminal. It adds the server to `~/.grok/config.toml`.',
      `grok mcp add --transport http ${REMOTE} ${MCP_URL} --header "Authorization: ${BEARER}"`),
    local: way('https://docs.x.ai/build/features/mcp-servers', 'Run this command in your terminal. It adds the server to `~/.grok/config.toml`.',
      `grok mcp add ${LOCAL} -- npx -y hanzo mcp`),
  },
  {
    id: 'antigravity', name: 'Antigravity', icon: 'Antigravity', page: 'antigravity#hanzo-mcp',
    none: { signin: 'documents no sign-in for a remote server' },
    // verified against https://antigravity.google/docs/mcp, and run with agy (`agy mcp add` writes ~/.gemini/config/mcp_config.json)
    key: way('https://antigravity.google/docs/mcp', 'Run this command in your terminal. It adds the server to `~/.gemini/config/mcp_config.json`.',
      `agy mcp add --header "Authorization: ${BEARER}" ${REMOTE} ${MCP_URL}`),
    local: way('https://antigravity.google/docs/mcp', 'Run this command in your terminal. It adds the server to `~/.gemini/config/mcp_config.json`.',
      `agy mcp add ${LOCAL} -- npx -y hanzo mcp`),
  },
];

/** The ways a visitor can pick today. */
export const ways = () => WAYS.filter((w) => w.on);
/** One client's snippet for one way, or null where its docs do not support that way. */
export const entry = (client, id) => client[id] ?? null;
/** The clients with at least one of the available ways: a client with none is not listed. */
export const clients = (available = ways()) => CLIENTS.filter((c) => available.some((w) => entry(c, w.id)));
