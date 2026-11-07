"""Keep Hanzo's structured data (schema.org JSON-LD) for every page: search engines read it for FAQs, products, breadcrumbs.
Run: python3 scripts/jsonld.py  ->  content/jsonld/<path>.json (list of JSON-LD objects, home at content/jsonld/index.json)
"""
import json, os, re, urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'content', 'jsonld')
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/130 Safari/537.36'}

def grab(path):
    try:
        h = urllib.request.urlopen(urllib.request.Request('https://hanzo.ai' + path, headers=UA), timeout=40).read().decode('utf-8', 'replace')
    except Exception as e:
        return path, None
    items = []
    for m in re.finditer(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', h, re.S):
        try:
            items.append(json.loads(m.group(1)))
        except ValueError:
            pass
    f = os.path.join(OUT, (path.strip('/') or 'index') + '.json')
    os.makedirs(os.path.dirname(f), exist_ok=True)
    json.dump(items, open(f, 'w'), ensure_ascii=False)
    return path, len(items)

if __name__ == '__main__':
    paths = ['/'] + list(json.load(open(os.path.join(ROOT, 'content', 'pages.json'))))
    with ThreadPoolExecutor(8) as ex:
        res = list(ex.map(grab, paths))
    print('pages', len(res), 'with data', sum(1 for _, n in res if n), 'failed', sum(1 for _, n in res if n is None))
