"""Outline every ported page: its headings, paragraphs, lists, links and media, section by section.
The outline is what a page is rebuilt from, so every word and link on the new page is Hanzo's.
Run: python3 scripts/outline.py  ->  content/outline/<path>.json
"""
import json, os, re
from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, OUT = os.path.join(ROOT, 'content', 'pages'), os.path.join(ROOT, 'content', 'outline')

def walk(node, out):
    for el in node.find_all(['h1', 'h2', 'h3', 'h4', 'p', 'li', 'a', 'img', 'video', 'pre', 'code', 'table', 'button'], recursive=True):
        if el.find_parent(['a', 'li', 'pre', 'table', 'button']) and el.name not in ('img',):
            continue  # counted with its parent
        t = el.get_text(' ', strip=True)
        if el.name in ('h1', 'h2', 'h3', 'h4'):
            out.append({el.name: t})
        elif el.name == 'p' and t:
            out.append({'p': t})
        elif el.name == 'li' and t:
            a = el.find('a')
            out.append({'li': t, **({'href': a.get('href')} if a else {})})
        elif el.name == 'a' and t:
            out.append({'a': t, 'href': el.get('href')})
        elif el.name == 'button' and t:
            out.append({'button': t})
        elif el.name in ('img', 'video') and (el.get('src') or el.get('poster')):
            out.append({el.name: el.get('src') or el.get('poster'), 'alt': el.get('alt', '')})
        elif el.name in ('pre', 'code') and t:
            out.append({'code': t[:600]})
        elif el.name == 'table':
            out.append({'table': [[c.get_text(' ', strip=True) for c in r.find_all(['th', 'td'])] for r in el.find_all('tr')][:40]})

if __name__ == '__main__':
    n = 0
    for dp, _, fs in os.walk(SRC):
        for f in fs:
            if not f.endswith('.html'):
                continue
            src = os.path.join(dp, f)
            rel = os.path.relpath(src, SRC)[:-5]
            s = BeautifulSoup(open(src).read(), 'html.parser')
            secs = [x for x in s.find_all('section') if not x.find_parent('section')] or [s]
            data = []
            for x in secs:
                items = []
                walk(x, items)
                if items:
                    data.append(items)
            dst = os.path.join(OUT, rel + '.json')
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            json.dump(data, open(dst, 'w'), ensure_ascii=False, indent=0)
            n += 1
    print('outlined', n)
