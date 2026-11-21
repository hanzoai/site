/* WebMCP on hanzo.ai (hanzo-inc/app#85, after hanzo-inc/app#86).

   A browser that hosts an agent exposes `document.modelContext` (the spec's; the first shims put it on
   `navigator.modelContext`), and a page registers tools on it: a name, a description, a JSON Schema for the input and an
   `execute`. These are the four flows a stranger comes to hanzo.ai for, each the door a person would press:

   - search_hanzo    finds a page of this site (the same index and ranking as the 404 page's search, lib/search.json,
                     fetched as /search.json on the first search, never on load).
   - open_pricing    opens /pricing.
   - start_chat      opens Hanzo Chat at hanzo.app with the prompt, as the site's own composers do (lib/app.ts `ask`):
                     Chat answers it at once, signed in or not.
   - create_api_key  opens the console's keys page; the person makes the key there and no tool ever sees it.

   `WEBMCP` is inlined in app/layout.tsx's head, so the tools are on the page while the document is parsed: Cloudflare's
   Agent Readiness scan reads them a few seconds after it navigates, and an effect after hydration can be too late on the
   heaviest pages. It is ES5, imports nothing, and guards every call: a browser that refuses one tool keeps the others,
   and a browser without the API is left exactly as it was. A navigation waits a tick so the agent hears the answer before
   the page goes. */

import { APP } from './app.ts';

/** The console's API keys page, as the site's own links name it (components/pages/Gen.tsx, Kata.tsx). */
export const KEYS = 'https://platform.hanzo.ai/keys';
/** The page index the search fetches: app/search.json/route.ts writes lib/search.json there. */
export const INDEX = '/search.json';

/** A tool as the site describes it: everything but what it does. */
export interface Described {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
}

export const TOOLS = [
  {
    name: 'search_hanzo',
    description:
      'Search hanzo.ai for a page: a product, a model, pricing, a solution, research, a policy. Returns the best matches with their addresses, plus where the documentation and the skills are indexed as Markdown.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'What to look for, in a few words: "pricing", "vector search", "api keys".' },
        limit: { type: 'integer', minimum: 1, maximum: 20, default: 8, description: 'How many matches to return.' },
      },
      required: ['query'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'open_pricing',
    description: "Open hanzo.ai's pricing page: the plans, what each includes, and the per-model API prices.",
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'start_chat',
    description:
      'Open Hanzo Chat (hanzo.app) and ask it this prompt. Chat answers at once, signed in or not, and the person carries the conversation on there.',
    inputSchema: {
      type: 'object',
      properties: { prompt: { type: 'string', description: 'What to ask Hanzo Chat.' } },
      required: ['prompt'],
    },
  },
  {
    name: 'create_api_key',
    description:
      "Open the Hanzo console's API keys page, where the person creates a key and copies it. This tool never sees the key. A person who is not signed in signs in or up there first.",
    inputSchema: { type: 'object', properties: {} },
  },
] as const satisfies readonly Described[];

const json = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c');

/* The head's script. `R` ranks the index the way components/pages/Lost.tsx `rank` does (path 3, title 2, description
   0.5, a word's first four letters 0.5, shorter paths first), with a lower floor since an agent's query is typed. */
const script = () =>
  `(function(){try{var c=document.modelContext||navigator.modelContext;if(!c)return;` +
  `var T=${json(TOOLS)},K=${json(KEYS)},A=${json(APP)},I=${json(INDEX)},P=null;` +
  `function say(t){return{content:[{type:'text',text:t}]}}` +
  `function at(h){return new URL(h,location.origin).href}` +
  `function later(f){setTimeout(f,0)}` +
  `function W(s){return String(s).toLowerCase().split(/[^a-z0-9]+/).filter(function(w){return w.length>1})}` +
  `function R(S,q,n){var ws=W(q);if(!ws.length)return[];return S.map(function(e){var p=String(e[0]),t=String(e[1]||''),d=String(e[2]||'').toLowerCase(),pl=p.toLowerCase(),tl=t.toLowerCase(),hay=(pl+' '+tl).split(/[^a-z0-9]+/),s=0;ws.forEach(function(w){s+=(pl.indexOf(w)>=0?3:0)+(tl.indexOf(w)>=0?2:0)+(d.indexOf(w)>=0?0.5:0)+(hay.some(function(x){return x.indexOf(w.slice(0,4))===0})?0.5:0)});return[s-p.length/400,p,t]}).filter(function(r){return r[0]>0.5}).sort(function(a,b){return b[0]-a[0]}).slice(0,n)}` +
  `var X={` +
  `search_hanzo:function(i){var q=String(i.query==null?'':i.query).trim();if(!q)return Promise.resolve(say('Say what to look for: a query of a few words.'));var n=Math.min(20,Math.max(1,Math.floor(Number(i.limit)||8)));` +
  `P=P||fetch(I).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).then(null,function(e){P=null;throw e});` +
  `return P.then(function(S){var f=R(S,q,n),x='Documentation, every page as Markdown: https://docs.hanzo.ai/llms.txt. Skills: https://hanzoskills.com/llms.txt.';` +
  `return say(f.length?'Pages on hanzo.ai for "'+q+'":\\n'+f.map(function(r){return'- '+r[2]+': '+at(r[1])}).join('\\n')+'\\n\\n'+x:'No page on hanzo.ai answers "'+q+'". '+x)},` +
  `function(){return say('The page index did not load, so nothing was searched. Every page is listed at '+at('/llms.txt')+'.')})},` +
  `open_pricing:function(){later(function(){location.assign('/pricing')});return Promise.resolve(say('Opened '+at('/pricing')+'.'))},` +
  `start_chat:function(i){var q=String(i.prompt==null?'':i.prompt).trim(),u=q?A+'/?q='+encodeURIComponent(q):A+'/';later(function(){location.assign(u)});` +
  `return Promise.resolve(say(q?'Opened Hanzo Chat at '+u+': Chat is answering the prompt, and the person carries on there.':'Opened Hanzo Chat at '+u+' with an empty composer.'))},` +
  `create_api_key:function(){later(function(){location.assign(K)});return Promise.resolve(say('Opened '+K+'. The person creates the key there and copies it; a person who is not signed in signs in or up first.'))}` +
  `};` +
  `var L=T.map(function(t){var o={name:t.name,description:t.description,inputSchema:t.inputSchema,execute:function(i){return X[t.name](i||{})}};if(t.annotations)o.annotations=t.annotations;return o});` +
  `if(typeof c.registerTool==='function'){L.forEach(function(o){try{var p=c.registerTool(o);if(p&&typeof p.then==='function')p.then(null,function(){})}catch(_){}})}` +
  `else if(typeof c.provideContext==='function'){c.provideContext({tools:L})}` +
  `}catch(_){}})()`;

/** The head's half, as app/layout.tsx inlines it (~4 KB). */
export const WEBMCP = script();
