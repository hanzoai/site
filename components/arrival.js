/* Arrival: the first moment of a visit. Hanzo's mark assembles piece by piece on black, a counter runs to 100 with the
   page's real readiness (DOM, fonts, load; never longer than 2.4 s), then the black lifts like a curtain and the page
   settles into place. Once per session; reduced motion gets a short fade. It is plain JS that runs while the HTML is still
   arriving, before React, and lives outside <body>, so it can never delay or disturb hydration. Without JS it never shows. */
export const MARK = [
  ['M22.21 67V44.6369H0V67H22.21Z', 'bl'],
  ['M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z', 'band'],
  ['M22.21 0H0V22.3184H22.21V0Z', 'tl'],
  ['M66.7198 0H44.5098V22.3184H66.7198V0Z', 'tr'],
  ['M66.7198 67V44.6369H44.5098V67H66.7198Z', 'br'],
];
const CSS = `
#x-arrive{position:fixed;inset:0;z-index:2147483000;background:#0a0a0a;color:#fff;display:grid;place-items:center;clip-path:inset(0 0 0 0);transition:clip-path 1s cubic-bezier(.76,0,.24,1)}
#x-arrive.out{clip-path:inset(0 0 100% 0)}
#x-arrive .xa-c{display:grid;justify-items:center;gap:28px;transition:transform .7s cubic-bezier(.7,0,.84,0),opacity .5s}
#x-arrive.out .xa-c{transform:translateY(-60px);opacity:0}
#x-arrive svg{width:56px;height:56px;overflow:visible}
#x-arrive path{fill:#fff;transform-box:fill-box;animation:xa-in .8s cubic-bezier(.16,1,.3,1) both}
#x-arrive .tl{transform-origin:0 0;animation-delay:.05s}#x-arrive .tr{transform-origin:100% 0;animation-delay:.12s}
#x-arrive .bl{transform-origin:0 100%;animation-delay:.19s}#x-arrive .br{transform-origin:100% 100%;animation-delay:.26s}
#x-arrive .band{animation:xa-band .9s cubic-bezier(.76,0,.24,1) .3s both}
#x-arrive .xa-r{display:flex;align-items:center;gap:14px;font:500 11px/1 "Zen Mono",ui-monospace,monospace;letter-spacing:.22em;color:rgba(255,255,255,.55);animation:xa-fade .8s .45s both}
#x-arrive .xa-bar{width:120px;height:1px;background:rgba(255,255,255,.14);overflow:hidden}
#x-arrive .xa-bar i{display:block;height:100%;background:#fff;transform-origin:0 50%;transform:scaleX(0)}
#x-arrive .xa-n{min-width:3ch;color:#fff;font-variant-numeric:tabular-nums}
html.x-arriving .x-page{transform:translateY(48px) scale(.985);opacity:.4}
html.x-arrived .x-page{transition:transform 1.25s cubic-bezier(.16,1,.3,1),opacity .9s ease}
@keyframes xa-in{from{transform:scale(0);opacity:0}}
@keyframes xa-band{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes xa-fade{from{opacity:0;transform:translateY(8px)}}
@media (prefers-reduced-motion:reduce){#x-arrive,#x-arrive *{animation:none!important;transition:opacity .3s!important}#x-arrive.out{clip-path:none;opacity:0}html.x-arriving .x-page{transform:none;opacity:1}}
`;
export const ARRIVE = `(function(){try{if(sessionStorage.getItem('hz-arrived'))return}catch(e){}
var H=document.documentElement,s=document.createElement('style');s.textContent=${JSON.stringify(CSS)};document.head.appendChild(s);
var d=document.createElement('div');d.id='x-arrive';d.setAttribute('aria-hidden','true');
d.innerHTML='<div class="xa-c"><svg viewBox="0 0 67 67">'+${JSON.stringify(MARK.map(([p, c]) => `<path class="${c}" d="${p}"/>`).join(''))}+'</svg><div class="xa-r"><span>HANZO</span><span class="xa-bar"><i></i></span><span class="xa-n">000</span></div></div>';
H.appendChild(d);H.classList.add('x-arriving');
var n=d.querySelector('.xa-n'),bar=d.querySelector('.xa-bar i'),t0=performance.now(),p=0,goal=.18,end=0;
function set(v){if(v>goal)goal=v}
document.addEventListener('DOMContentLoaded',function(){set(.62)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){set(.84)});
addEventListener('load',function(){set(1)});
setTimeout(function(){set(1)},2400);
function tick(now){p+=(goal-p)*.09;if(goal===1&&p>.993)p=1;n.textContent=('00'+Math.round(p*100)).slice(-3);bar.style.transform='scaleX('+p+')';
if(p===1&&now-t0>1150&&!end){end=1;setTimeout(out,140);return}requestAnimationFrame(tick)}
function out(){d.classList.add('out');H.classList.add('x-arrived');H.classList.remove('x-arriving');try{sessionStorage.setItem('hz-arrived','1')}catch(e){}
dispatchEvent(new Event('hz-arrived'));setTimeout(function(){d.remove();H.classList.remove('x-arrived')},1300)}
requestAnimationFrame(tick)})();`;
