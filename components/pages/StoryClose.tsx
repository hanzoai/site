'use client';
/* The Story pages' closing Band (/about, /history, /blog; page-owned). The kit Band's room and look (.x-band, the dark
   closing room, one line, one action), with two differences the kit cannot take yet: the headline is cut into its line
   (v2/Lines) instead of the kit's word blur (PLAN-COMPONENTS 2.8: no filter in animated paths), and the one solid ask
   can carry the page's sticky ask (`thumb`: data-thumb for the ask bar) and its `data-cta`.
   Usage: <StoryClose title lede action to note thumb cta="history.band" /> as the last section of <main>. */
import { Cta } from '../kit';
import Lines from '../v2/Lines';

export default function StoryClose({ title, lede, action, to, note, thumb = false, cta }) {
  return (
    <section className="x-band xst-close v2s-room" data-room="dark">
      <div className="x-wrap">
        <Lines as="h2" lines={[title]} amount={0.4} />
        {lede && <p>{lede}</p>}
        <div className="x-band-act">
          <Cta to={to} id={cta} thumb={thumb} size="lg">{action}</Cta>
          {note}
        </div>
      </div>
    </section>
  );
}
