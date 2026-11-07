"""Run from the repo root: python3 scripts/extract.py
Pull Hanzo's own markup and data from the captured page into content.js and hanzo.css (nothing rewritten but URLs)."""
import os, re, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
from bs4 import BeautifulSoup
h = open('source/home.html').read()
s = BeautifulSoup(h, 'html.parser')
# resolve Next.js streamed Suspense boundaries: <template id="B:x"> is filled by the hidden <div id="S:x">
for t in s.find_all('template', id=lambda v: v and v.startswith('B:')):
    src = s.find(id='S:' + t['id'][2:])
    if src:
        for c in list(src.children): t.insert_before(c)
        t.decompose()
PAGES = set(json.load(open('content/pages.json'))) | {'/'} if __import__('os').path.exists('content/pages.json') else {'/'}
def ab(x):
    """Links to pages in this repo stay site-relative; links to Hanzo's app (chat, pay, signup...) go to hanzo.ai.
    Asset paths stay relative: they are Hanzo's /public files (copy them in; the preview server fetches them)."""
    def fix(m):
        path = m.group(2)
        base = re.split(r'[?#]', path)[0].rstrip('/') or '/'
        return m.group(1) + '="' + (path if base in PAGES else 'https://hanzo.ai' + path) + '"'
    x = re.sub(r'(href)="(?:https://hanzo\.ai)?(/[^"]*)"', fix, str(x))
    return re.sub(r'(src|poster|srcset)="https://hanzo\.ai/', r'\1="/', x)
secs = [t for t in s.find_all('section') if not t.find_parent(['section', 'footer', 'header'])]
def uniq_logos(sec):
    seen, out = set(), []
    for a in sec.find_all('a'):
        img = a.find('img')
        if not img or a.get('aria-label') in seen: continue
        seen.add(a['aria-label']); out.append({'name': a['aria-label'], 'href': ab(f'href="{a["href"]}"')[6:-1], 'src': img['src']})
    return out
C = {}
C['header'] = ab(s.find('header')); C['footer'] = ab(s.find('footer'))
C['backed'] = uniq_logos(secs[1]); C['trusted'] = uniq_logos(secs[12])
# agents that work with Hanzo: one icon each
seen, ag = set(), []
for a in s.find(id='compatible').find_all('a'):
    l = a.get('aria-label') or ''
    if l.endswith(' docs') and l not in seen:
        seen.add(l); ico = a.find(['svg', 'img'])
        ag.append({'name': l[:-5], 'href': a['href'] if a['href'].startswith('http') else 'https://hanzo.ai' + a['href'], 'icon': ab(ico) if ico else ''})
C['agents'] = ag
# nine products: their live screen fragment + name, address, actions
grid = s.find(id='products-title').find_parent('div').find_next_sibling('div')
P = []
for card in grid.find_all('div', recursive=False):
    inner = card.find('div'); vis, foot = inner.find_all('div', recursive=False)[:2]
    texts = [t for t in foot.stripped_strings]
    acts = [a for a in [{'label': a.get_text(' ', strip=True), 'href': a['href'] if a['href'].startswith('http') else 'https://hanzo.ai' + a['href']} for a in foot.find_all('a')] if not a['label'].startswith(texts[0] + ' ')]
    P.append({'name': texts[0], 'addr': texts[1], 'vis': ab(vis), 'acts': acts})
C['products'] = P
# open source: sparkline svgs of the tiles, the commit calendar and the repository cards, as Hanzo renders them
o = s.find(id='open-source')
spark = [ab(e) for e in o.find_all(attrs={'aria-label': re.compile(r'^(Commits|Merges) a (week|month|day)')})]
C['spark'] = spark
cards = []
for t in o.find_all(string=re.compile(r'^hanzoai/')):
    el = t.parent
    while el and 'Pushed' not in el.get_text(): el = el.parent
    if el and ab(el) not in cards: cards.append(ab(el))
C['repos'] = cards
open('content.js', 'w').write('export default ' + json.dumps(C, ensure_ascii=False) + ';\n')
print({k: (len(v) if isinstance(v, list) else len(v)) for k, v in C.items()}, [p['name'] for p in P], [a['name'] for a in ag])
# their stylesheet, fonts served locally
css = open('source/hanzo-a.css').read() + '\n' + open('source/hanzo-b.css').read() + '\n' + '\n'.join(re.findall(r'<style[^>]*>(.*?)</style>', h, re.S))
css = re.sub(r'url\(\.\./media/Zen-Variable[^)]*\)', 'url(/fonts/Zen-Variable.woff2)', css)
css = re.sub(r'url\(\.\./media/ZenMono-Variable[^)]*\)', 'url(/fonts/ZenMono-Variable.woff2)', css)
css = css.replace('url(../media/', 'url(https://hanzo.ai/_next/static/media/')
open('public/hanzo.css', 'w').write(css); print('css', len(css))
