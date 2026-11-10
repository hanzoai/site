# Hanzo

> What Hanzo Cloud serves and how to call it, written for an agent working in
> someone else's codebase.

One host answers for the whole platform, `https://api.hanzo.ai`, and one
credential opens it. Starting from nothing (no account, no key)? With a wallet
and no human, https://hanzoskills.com/hanzo.md signs in, mints a key, makes a
free call and tops up in USDC or USDT (the same file is drawn at
https://hanzo.ai/agents#headless). Otherwise read https://docs.hanzo.ai/docs/agents
first: sign-up over HTTP, the free tier, the
first call and how to pay. The section at the end lists every family the host serves;
it is read out of the API's own document on each build, so it cannot describe an
API that has moved on.

## Operate

- Work in the project you were asked about. Check which directory you are in
  before you write a file into it.
- The base is `https://api.hanzo.ai/v1`. `api` is the host, so `/api/` never
  appears in a path: `/v1/models`, not `/api/v1/models`.
- Call operations that exist. All of them are in the document at
  `https://api.hanzo.ai/v1/openapi.json`; a path absent from it answers 404.
  Never build a path out of a family name and a guess about the rest.
- `GET /v1/commands` is the same surface as a flat list — every operation with
  its method, its path, its summary and the arguments it takes. Read it when you
  need an exact one. Neither it nor the document asks for a credential.
- Say what a call returned, status included, and never report a call you did not
  make.

## Authenticate

Hanzo IAM issues the credential. One login, one bearer, and that one bearer opens
every family listed at the end.

```sh
hanzo auth login                          # opens a browser, once per machine
export HANZO_TOKEN="$(hanzo auth token)"  # prints the bearer on stdout, alone
```

Send it on every call:

```sh
curl -sS https://api.hanzo.ai/v1/billing/balance \
  -H "Authorization: Bearer $HANZO_TOKEN"
```

Check two different things, because one call cannot answer both.

`GET /v1/models` proves the **host and the path**. It carries no credential —
the document declares it open — and answers `200` with the model list whether or
not you send a bearer. `404` there means your path is wrong.

`GET /v1/billing/balance` proves the **credential**: `401` without a bearer,
`200` with a good one. Never test a token against a route that does not require
one; it will pass while your token is worthless.

And do not read `200` alone as success. Some IAM routes answer `200` carrying
`{"status":"error","msg":"please sign in first"}` in the body, so an agent that
only reads status codes will believe it is signed in when it is not. Read the
body.

## Install

The whole native stack, by one command on any OS, Windows included:

```sh
npm i -g hanzo
```

`hanzo` is a small launcher. The CLI, the `dev` agent, the MCP server and the
inference engine are native Rust binaries, each downloaded and checksum-verified
the first time you run it: `hanzo`, `hanzo dev`, `hanzo mcp`,
`hanzo engine serve <model>`. On Linux and macOS, `curl -fsSL https://hanzo.sh | sh`
installs the same binaries up front.

From code, one client per language, generated from the same document as this
file:

```sh
pip install "hanzoai>=8"   # Python 3.12+
npm i hanzoai              # TypeScript
```

The rest are at <https://hanzo.ai/sdks>.

## MCP

The MCP server is the native `hanzo-mcp`, over stdio. One line adds it to
Claude Code, with nothing installed first; Codex, Cursor and Zed take the same
command in their own config (https://docs.hanzo.ai/docs/agents):

```sh
claude mcp add hanzo --env HANZO_API_KEY=$HANZO_API_KEY -- npx -y hanzo mcp
```

After `npm i -g hanzo` the command is just `hanzo mcp`. The server carries the
Kai decision tools (`kai`, `kai_decide`) beside files, shell, git, code search,
the browser and the computer, and calls api.hanzo.ai with `HANZO_API_KEY`.

The fleet also answers MCP at `https://api.hanzo.ai/v1/mcp`: stateless JSON-RPC
over POST, one tool per subsystem plus `describe`, with the operation named in
`op` and its arguments in `input`; `tools/call` takes the same bearer. It
answers `initialize` with protocol revision 2026-07-28 only, so a client that
does not speak that revision (Claude Code 2.1 among them) refuses to connect;
use the local server there.
