/* One Go module, at the address its import path has. It answers two callers with one page: the go tool reads the
   go-import tag in the head (app/[...mod]/page.jsx), and a person who followed an import out of a stack trace lands
   somewhere that says what the module is and where to read it. Words are hanzo-inc/app's. */
import type { ComponentType } from 'react';
import { CodeBlock } from '../kit';
import { UNREFERENCED, modulePathOf, repoOf } from '../../lib/modules';
import './Module.css';

/* The command is the path the module declares: Go accepts a module only under the path its own go.mod names, and
   pkg.go.dev files it there. Any other path fetches the repo and then fails. */
export default function Module({ name }: { name: string }) {
  const repo = repoOf(name);
  const path = modulePathOf(name);
  const About = ABOUT[name];
  return (
    <main className="xmo">
      <div className="xmo-in">
        <h1>hanzo.ai/{name}</h1>
        <p className="xmo-lede">A Go module. This address is where its documentation lives; the source is on GitHub.</p>
        <CodeBlock code={`go get ${path}`} />
        <dl className="xmo-facts">
          <div><dt>Source</dt><dd><a href={repo}>{repo}</a></dd></div>
          <div>
            <dt>Reference</dt>
            <dd>{UNREFERENCED.has(name) ? 'pkg.go.dev has no page for this module.' : <a href={`https://pkg.go.dev/${path}`}>pkg.go.dev/{path}</a>}</dd>
          </div>
        </dl>
        {About && <About />}
      </div>
    </main>
  );
}

/* What a module is, where it has more to say than its name. */
const ABOUT: Partial<Record<string, ComponentType>> = { ci: Ci };

/* hanzo.ai/ci is Hanzo CI, the pipeline every Hanzo repo imports. */
function Ci() {
  return (
    <>
      <h2>Hanzo CI</h2>
      <p>One pipeline builds, tests and publishes every Hanzo repo. A repo says what it makes; the pipeline makes it the same way everywhere.</p>

      <h2>hanzo.yml</h2>
      <p>One file at the root of a repo names its images, the tests that gate them, and the static site it publishes, if it has one. The repo carries no build logic of its own.</p>
      <CodeBlock label="hanzo.yml" code={`images:
  - { name: api, context: ., repo: ghcr.io/acme/api }
test:
  - { name: unit, run: go test ./... }`} />

      <h2>The shared workflow</h2>
      <p>A short workflow imports the pipeline from hanzoai/ci, so every repo runs the same steps from one definition. Tests run first, and a commit that fails them publishes nothing.</p>
      <CodeBlock label=".hanzo/workflows/cicd.yml" code={`jobs:
  cicd:
    uses: hanzoai/ci/.github/workflows/build.yml@v2
    secrets: inherit`} />

      <h2>Runners</h2>
      <p>Jobs run on Hanzo&apos;s runner fleet. To run them on your own machines, pass your runners&apos; labels as <code>runner</code>.</p>

      <h2>The build door</h2>
      <p>With <code>mode: delegate</code>, a job hands each image to the build door, <code>POST /v1/build</code> on api.hanzo.ai. It builds every declared architecture on a native node and pushes one multi-architecture image, only into registries your organization owns. It reads the organization from the job&apos;s Hanzo identity, so it needs no secret of its own.</p>
      <p>A build ends at a published image. What runs where is declared separately, and applied from that declaration.</p>
    </>
  );
}
