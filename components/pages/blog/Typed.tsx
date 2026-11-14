/* The typewriter entrance's markup: a title split into letters (words kept whole so lines still break at spaces).
   The text reads exactly as Hanzo's; enter.css types the letters out with a caret once [data-enter="type"] gets .in. */
interface TypedProps {
  text: string;
  from?: number;
}
export default function Typed({ text, from = 0 }: TypedProps) {
  let c = from;
  const words = text.split(' ');
  return words.map((w, wi) => (
    <span key={wi} className="xbl-tw">
      {wi ? ' ' : ''}
      <span className="xbl-tw-w">
        {[...w].map((ch, k) => {
          const i = c++;
          const last = wi === words.length - 1 && k === w.length - 1;
          return <span key={k} className={'xbl-ch' + (last ? ' last' : '')} style={{ '--c': i - from }}>{ch}</span>;
        })}
      </span>
    </span>
  ));
}
