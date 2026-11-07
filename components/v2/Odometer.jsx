'use client';
/* Odometer (v2): a figure whose digits roll like a counter when it changes - the "rolling price" of VISION.md.
   Usage:
     import Odometer from '../v2/Odometer';
     <Odometer value="$195" />                 // any string: digits roll, everything else ($ , . x /) sits still
     <Odometer value={`$${total}`} className="big" />
   - The real value is plain text in the HTML (screen readers, search, the parity check); the rolling columns are
     aria-hidden and draw their 0-9 strip with CSS, so no extra digits end up in the page's text.
   - Each digit is a column that slides to its digit (CSS transform, 900 ms, EASE), the ones place first and each place
     to its left 60 ms later. A column that appears (95 -> 195) rolls up from 0 as it arrives, and so does every column
     when the figure is first shown (page load, a tab opening), so a price always arrives rolling.
   - No JS loop: the browser runs it. Reduced motion: the figure just changes.
   - Size it with font-size on the element; use tabular figures (it sets font-feature-settings: 'tnum').
   Owned by the Enterprise + Pricing chat (v2 wave 1). */
import './Odometer.css';

export default function Odometer({ value, className = '' }) {
  const chars = [...String(value)];
  const n = chars.length;
  return (
    <span className={'v2-odo' + (className ? ' ' + className : '')}>
      <span className="v2-odo-t">{value}</span>
      <span className="v2-odo-r" aria-hidden="true">
        {chars.map((c, i) => {
          const place = n - 1 - i; // keyed from the right, so the ones place stays the same column
          if (!/[0-9]/.test(c)) return <span key={'c' + place + c} className="v2-odo-c">{c}</span>;
          return <span key={'d' + place} className="v2-odo-d" style={{ '--d': +c, '--i': place }}><span className="v2-odo-s" /></span>;
        })}
      </span>
    </span>
  );
}
