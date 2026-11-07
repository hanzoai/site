"""Port every hanzo.ai page: fetch each URL in the sitemap, keep the server-rendered <main>, and save it under content/pages.

Run from the repo root:  python3 scripts/capture.py
Output: content/pages/<path>.html (main content) and content/pages.json (path -> title, description).
Links to https://hanzo.ai/... become site-relative so navigation stays inside this site.
"""
import json, os, re, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'content', 'pages')
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/130 Safari/537.36'}

def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
        return r.read().decode('utf-8', 'replace')

def port(url):
    path = url.replace('https://hanzo.ai', '').rstrip('/') or '/'
    if path == '/':
        return None  # the home page is rebuilt by hand
    try:
        s = BeautifulSoup(get(url), 'html.parser')
    except Exception as e:
        return {'path': path, 'error': str(e)}
    for t in s.find_all('template', id=lambda v: v and v.startswith('B:')):  # fill streamed Suspense boundaries
        src = s.find(id='S:' + t['id'][2:])
        if src:
            for c in list(src.children):
                t.insert_before(c)
            t.decompose()
    main = s.find('main')
    if main is None:
        main = s.body
        for x in main.find_all(['header', 'footer'], recursive=False):
            x.decompose()
    for x in main.find_all(['script', 'template', 'noscript', 'link']):
        x.decompose()
    for x in main.find_all(id=re.compile(r'^S:')):
        x.decompose()
    html = ''.join(str(c) for c in main.children)
    html = re.sub(r'(href)="https://hanzo\.ai(/[^"]*)?"', lambda m: f'{m.group(1)}="{m.group(2) or "/"}"', html)
    title = (s.title.string or '').strip() if s.title else ''
    d = s.find('meta', attrs={'name': 'description'})
    f = os.path.join(OUT, path.strip('/') + '.html')
    os.makedirs(os.path.dirname(f), exist_ok=True)
    open(f, 'w').write(html)
    return {'path': path, 'title': title, 'description': d['content'] if d else '', 'bytes': len(html)}

if __name__ == '__main__':
    sm = get('https://hanzo.ai/sitemap.xml')
    urls = re.findall(r'<loc>([^<]+)</loc>', sm)
    if len(sys.argv) > 1:
        urls = [u for u in urls if any(u.replace('https://hanzo.ai', '').startswith(p) for p in sys.argv[1:])]
    with ThreadPoolExecutor(8) as ex:
        rows = [r for r in ex.map(port, urls) if r]
    ok = {r['path']: {'title': r['title'], 'description': r['description']} for r in rows if 'error' not in r}
    bad = [r for r in rows if 'error' in r]
    json.dump(ok, open(os.path.join(ROOT, 'content', 'pages.json'), 'w'), indent=0, ensure_ascii=False)
    print('ported', len(ok), 'failed', len(bad), 'bytes', sum(r.get('bytes', 0) for r in rows))
    for r in bad[:20]:
        print('FAIL', r['path'], r['error'])
