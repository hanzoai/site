/* Arrival: the first moment of a first visit to the home page. Hanzo's mark assembles on black, then the black lifts
   like a curtain. It is plain JS that runs while the HTML is still arriving, before React, and lives outside <body>, so
   it can never delay or disturb hydration. Without JS it never shows. Pages need nothing.
   Rules (PLAN-COMPONENTS CANON 0.7 "Arrival curtain"):
   - Home only, first visit only (skipped for 7 days after), never on a deep link.
   - Never for Save-Data, 2g/3g, reduced motion, or bots and automated browsers.
   - The black holds 0 to 700 ms at most: it lifts as soon as fonts are ready and the hero has painted.
   - Nothing behind it is dimmed or moved: .x-page is never touched, so the header and hero rects never change.
   - A CSS-only failsafe lifts it at 3.5 s even if this script dies. */
export const MARK = [
  ['M22.21 67V44.6369H0V67H22.21Z', 'bl'],
  ['M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z', 'band'],
  ['M22.21 0H0V22.3184H22.21V0Z', 'tl'],
  ['M66.7198 0H44.5098V22.3184H66.7198V0Z', 'tr'],
  ['M66.7198 67V44.6369H44.5098V67H66.7198Z', 'br'],
];
const CSS = `
#x-arrive{position:fixed;inset:0;z-index:2147483000;background:#0a0a0b;display:grid;place-items:center;clip-path:inset(0 0 0 0);transition:clip-path .62s cubic-bezier(.76,0,.24,1);animation:xa-fail 0s 3.5s forwards;pointer-events:none}
#x-arrive.out{clip-path:inset(0 0 100% 0)}
#x-arrive svg{width:52px;height:52px;overflow:visible;transition:transform .5s cubic-bezier(.7,0,.84,0),opacity .35s}
#x-arrive.out svg{transform:translateY(-40px);opacity:0}
#x-arrive path{fill:#f5f5f7;transform-box:fill-box;animation:xa-in .42s cubic-bezier(.16,1,.3,1) both}
#x-arrive .tl{transform-origin:0 0}#x-arrive .tr{transform-origin:100% 0;animation-delay:.04s}
#x-arrive .bl{transform-origin:0 100%;animation-delay:.08s}#x-arrive .br{transform-origin:100% 100%;animation-delay:.12s}
#x-arrive .band{animation:xa-band .4s cubic-bezier(.76,0,.24,1) .14s both}
@keyframes xa-in{from{transform:scale(0);opacity:0}}
@keyframes xa-band{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes xa-fail{to{visibility:hidden;clip-path:inset(0 0 100% 0)}}
`;
export const ARRIVE = `(function(){try{
var W=window,N=navigator,H=document.documentElement,c=N.connection||{};
if(location.pathname!=='/'&&location.pathname!=='')return;
var seen=0;try{seen=+localStorage.getItem('hz-arrived')||0}catch(e){}
if(Date.now()-seen<6048e5)return;
if(c.saveData||/(^|-)(2g|3g)$/.test(c.effectiveType||''))return;
if(N.webdriver||/bot|crawl|spider|slurp|lighthouse|headless|preview/i.test(N.userAgent))return;
if(W.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
try{localStorage.setItem('hz-arrived',String(Date.now()))}catch(e){}
var s=document.createElement('style');s.textContent=${JSON.stringify(CSS)};document.head.appendChild(s);
var d=document.createElement('div');d.id='x-arrive';d.setAttribute('aria-hidden','true');
d.innerHTML='<svg viewBox="0 0 67 67">'+${JSON.stringify(MARK.map(([p, k]) => `<path class="${k}" d="${p}"/>`).join(''))}+'</svg>';
H.appendChild(d);
var t0=performance.now(),done=0,fonts=0,painted=0;
function out(){if(done)return;done=1;d.classList.add('out');dispatchEvent(new Event('hz-arrived'));setTimeout(function(){d.remove();s.remove()},700)}
function check(){if(fonts&&painted&&performance.now()-t0>=420)out()}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){fonts=1;check()});else fonts=1;
function paint(){requestAnimationFrame(function(){requestAnimationFrame(function(){painted=1;check()})})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',paint);else paint();
setTimeout(check,425);setTimeout(out,700);
}catch(e){var x=document.getElementById('x-arrive');x&&x.remove()}})();`;
