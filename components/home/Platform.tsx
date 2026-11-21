/* The nine products, three by three (hanzo-inc/app components/home/Products.tsx): each card is the product's own
   screen as hanzo.ai draws it (content/products.ts), its name and address, and its two ways in. Drawn on the server; the
   screen tells its story while it is on screen (Story), and the card leans toward a mouse
   ([data-tilt], lib/tilt.ts). */
import { Head } from '../ui';
import Story from './Story';
import { BotCardPreview, TeamCardPreview } from './ProductPreviews';
import P from '../../content/products';
import './platform.css';

const site = (addr: string) => (addr.startsWith('hanzo.ai/') ? addr.slice(8) : 'https://' + addr);

export default function Platform() {
  return (
    <section className="x-sec x-platform" id="products" data-hz-view="products" aria-labelledby="products-h">
      <div className="x-wrap">
        <Head id="products-h" title="Hanzo is the AI-native company platform." />
        <ul className="xp-grid">
          {P.map((p, n) => (
            <li key={p.name} className="xp-card" data-tilt="">
              {p.name === 'Bot' ? <BotCardPreview /> : p.name === 'Team' ? <TeamCardPreview /> : <Story i={n} html={p.vis} />}
              <div className="xp-f">
                <div className="xp-id">
                  <b>{p.name}</b>
                  <a className="xp-addr" href={site(p.addr)} aria-label={`Open Hanzo ${p.name} at ${p.addr}`}>{p.addr}</a>
                </div>
                <div className="xp-acts">
                  {p.acts.map((x, k) => {
                    const open = k === p.acts.length - 1;
                    return <a key={x.label} href={x.href} className={'x-btn sm' + (open ? ' solid' : '')}>{x.label}{open ? ' ↗' : ''}</a>;
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
