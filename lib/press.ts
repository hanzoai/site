/* A press on a link to a page of this site is taken over by the page transition (components/Morph.jsx), at the top of the
   capture phase, and stopped there: a handler on the link, or on anything below the document, never hears it. A moment that
   belongs to such a link is read where the transition reads it, on the document in the capture phase, like the funnel's
   own (components/Telemetry.jsx). `on` is a selector or an element; `fire(el, event)` hears each press on a match.
   Returns the cleanup, so an effect can hand it back. */
export function press(on, fire) {
  const click = (e) => {
    const el = typeof on === 'string' ? e.target?.closest?.(on) : on?.contains(e.target) ? on : null;
    if (el) fire(el, e);
  };
  document.addEventListener('click', click, { capture: true });
  return () => document.removeEventListener('click', click, { capture: true });
}
