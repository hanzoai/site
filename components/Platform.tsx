'use client';
/* Home, the platform (v2, Chapters). Nine products, one at a time: the scene pins, the product's name and its two
   actions hold on the left while its real screen wipes up over the last one on the right. The index beside it jumps
   to any product; the name opens into the product's page. On phones the products simply follow one another. */
import { useLayoutEffect, useRef } from 'react';
import { A } from './kit';
import PRODUCTS from '../content/products';
import Lines from './v2/Lines';
import Chapters from './v2/Chapters';

const P = PRODUCTS;
const site = (h) => h.replace('https://hanzo.ai', '') || '/';

/* Hanzo's product screen, drawn at the width it was made for and zoomed (layout, not a bitmap) to fill the frame. */
function Screen({ html }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const ro = new ResizeObserver(([e]) => { el.style.setProperty('--z', Math.max(0.7, Math.min(1.5, e.contentRect.width / 600)).toFixed(3)); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return <div className="hv-screen" ref={ref}><div className="hv-screen-in" dangerouslySetInnerHTML={{ __html: html }} /></div>;
}

export default function Platform() {
  const items = P.map((p) => ({
    key: p.name.toLowerCase(),
    title: p.name,
    to: site(p.acts[0].href),
    text: (
      <>
        <A className="hv-addr" to={p.addr.startsWith('hanzo.ai/') ? p.addr.slice(8) : 'https://' + p.addr} aria-label={`Open Hanzo ${p.name} at ${p.addr}`}>{p.addr}</A>
        <div className="hv-acts">
          {p.acts.map((a, k) => (
            <a key={a.label} href={a.href} className="hv-btn" data-cta={`home.platform.${p.name.toLowerCase()}.${k ? 'open' : 'more'}`}>{a.label}{k === p.acts.length - 1 ? ' ↗' : ''}</a>
          ))}
        </div>
      </>
    ),
    visual: <Screen html={p.vis} />,
  }));
  return (
    <section className="hv-platform" id="products" aria-labelledby="products-h">
      <div className="v2-wrap hv-plat-head">
        <Lines as="h2" id="products-h" className="hv-h2" lines={['Hanzo is the AI-native company platform.']} />
        <p className="hv-lead">A vertically integrated agentic operating system for business — intelligence, applications, computer-use agents, developer tools, MCP, and cloud infrastructure designed together in one workspace.</p>
      </div>
      <Chapters label="Hanzo products" items={items} step={0.45} />
    </section>
  );
}
