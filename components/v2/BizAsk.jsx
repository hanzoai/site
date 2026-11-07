'use client';
/* BizAsk: the page's one ask, as a kit part (PLAN-COMPONENTS common gate 2: no raw .x-btn in a page). Owned by the
   Business 1 chat. kit's Go drops data attributes, so this passes them through.
   Usage: <BizAsk to={DOCS} thumb="Read the docs">Read the docs</BizAsk>   (hero: thumb= feeds the site's ask bar)
          <BizAsk to={DOCS}>Read the docs</BizAsk>                        (close: the same words, solid)
   Props: solid (default true), thumb (data-thumb label), cta (data-cta, default "primary"), className.
   Hover, press (.98), focus and loading come from app/system.css's .x-btn states. */
import { A } from '../kit';

export default function BizAsk({ to, children, solid = true, thumb, cta = 'primary', className = '', ...rest }) {
  return (
    <A to={to} className={'x-btn' + (solid ? ' solid' : '') + (className ? ' ' + className : '')} data-thumb={thumb} data-cta={cta} {...rest}>
      {children}
    </A>
  );
}
