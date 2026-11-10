"""Nothing lost: every piece of text and every link on Hanzo's page must be on ours.
The reference is content/live/<path>.json (the page as rendered by hanzo.ai, see scripts/live.mjs) when present,
else the server copy in content/pages/.

Usage:  python3 scripts/parity.py /enterprise [/about ...]      (dev server on :4180)
        python3 scripts/parity.py --all-rebuilt                  (every page with its own folder in app/, families expanded)
Exit 1 if anything is missing. Text hidden behind an interaction (FAQ answers, inactive tabs) must still be in the HTML
(rendered with `hidden` or collapsed), so it is checked like the rest.
"""
import html as H, json, os, re, sys, urllib.request
from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = os.path.join(ROOT, 'content', 'pages')
UI = {'copy', 'copied', '→', '↗', '←', '+', '−', '×', '•', '·', '|', '/', '$', '▍', 'or'}

def norm(t):
    t = H.unescape(t).replace(' ', ' ').replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    t = re.sub(r'\[email\xa0protected\]|\[email protected\]', '', t)
    return re.sub(r'\s+', ' ', t).strip()

def decode_cf(h):
    k = int(h[:2], 16)
    return ''.join(chr(int(h[i:i + 2], 16) ^ k) for i in range(2, len(h), 2))

def units(path):
    src = os.path.join(PAGES, path.strip('/') + '.html')
    s = BeautifulSoup(open(src).read() if os.path.exists(src) else '', 'html.parser')  # the home has no server copy; live only
    for x in s.find_all(['script', 'style', 'svg']):
        x.decompose()
    out, links = [], set()
    for el in s.find_all(True):
        for c in el.find_all(string=True, recursive=False):  # each text node on its own (a link splits a sentence)
            t = norm(c)
            if len(t) > 1 and t.lower() not in UI and not re.fullmatch(r'[\W_]+', t):
                out.append(t)
        if el.name == 'a' and el.get('href'):
            h = el['href']
            if 'email-protection#' in h:
                h = 'mailto:' + decode_cf(h.split('#')[1])
            if not h.startswith('#'):
                links.add(h)
    live = os.path.join(ROOT, 'content', 'live', (path.strip('/') or 'index') + '.json')
    if os.path.exists(live):  # what a visitor sees on hanzo.ai, after scripts ran and tabs/accordions opened
        d = json.load(open(live))
        out = [t for t in (norm(x) for x in d['text']) if len(t) > 1 and t.lower() not in UI and not re.fullmatch(r'[\W_]+', t)
               and not re.fullmatch(r'0?[2-9] / \d+', t) and not t.startswith('{"@context"')]
        links |= {h for h in d['links'] if not h.startswith('#') and 'email-protection' not in h}
    out = list(dict.fromkeys(out))
    # not content: a counter's or typewriter's in-between states, live demo figures that change each second, inline CSS
    def transient(u):
        if '{' in u and ('@keyframes' in u or ':' in u and ';' in u): return True
        if re.fullmatch(r'\d+/s|\$\d+\.\d{4}', u): return True  # demo tokens-a-second and running bill
        if re.search(r'\d', u) and not re.search(r'[1-9]', u): return True  # every digit still 0: a count-up at its start
        return any(o != u and o.startswith(u) and len(u) > 12 for o in out)  # a sentence half-typed
    return [u for u in out if not transient(u)], links

def canon(h):
    h = h.replace('https://hanzo.ai', '') or '/'
    h = re.sub(r'/(?=[#?])', '', h)  # /customers/#x and /customers#x are the same place
    return h.rstrip('/') or '/'

def check(path):
    want, links = units(path)
    try:
        page = urllib.request.urlopen('http://localhost:4180' + path.rstrip('/') + '/', timeout=120).read().decode('utf-8', 'replace')
    except Exception as e:
        print(f'{path}: cannot load ({e})'); return 1
    s = BeautifulSoup(page, 'html.parser')
    main = s.find('main') or s
    for x in main.find_all(['script', 'style']):
        x.decompose()
    attrs = ' '.join(v for el in main.find_all(True) for k, v in el.attrs.items() if k in ('aria-label', 'title', 'alt') and isinstance(v, str))
    hay = norm(main.get_text(' ') + ' ' + attrs)
    hay_tight = hay.replace(' ', '')
    have = {canon(a.get('href', '')) for a in main.find_all('a')}
    miss = [u for u in want if u not in hay and u.replace(' ', '') not in hay_tight]
    lost = sorted(h for h in links if canon(h) not in have)
    ok = not miss and not lost
    print(f"{path}: {'OK' if ok else 'MISSING'}  text {len(want) - len(miss)}/{len(want)}  links {len(links) - len(lost)}/{len(links)}")
    for u in miss[:40]:
        print('   text:', u[:160])
    for h in lost[:40]:
        print('   link:', h)
    return 0 if ok else 1

if __name__ == '__main__':
    args = sys.argv[1:]
    if args == ['--all-rebuilt']:  # every page with its own folder in app/, and every member of a family template
        idx = json.load(open(os.path.join(ROOT, 'content', 'pages.json')))
        app = os.path.join(ROOT, 'app')
        args = [p for p in sorted(idx) if os.path.exists(os.path.join(app, p[1:], 'page.tsx'))
                or os.path.exists(os.path.join(app, p[1:].split('/')[0], '[slug]', 'page.tsx'))]
    sys.exit(max([check(p) for p in args] or [0]))
