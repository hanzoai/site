'use client';
/* The open transition. A card's picture lifts off the page as a WebGL plane, bends like pulled paper while it grows
   to fill the screen, and lands exactly where the next page's hero sits; the page swaps underneath and the plane
   dissolves into it. Close runs it backwards into the card it came from. Without WebGL or with reduced motion,
   links simply navigate. */
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { animate } from 'motion';
import { play } from '../lib/sound';

const Ctx = createContext(null);
export const useOpener = () => useContext(Ctx);
export const HERO_TOP = 60; // the header's height: heroes start under it

const VS = `
precision highp float;
attribute vec2 aPos;
uniform vec4 uRect; uniform vec2 uView; uniform float uBend; uniform float uT;
varying vec2 vUv;
void main() {
  vec2 uv = aPos;
  vec2 c = uv - 0.5;
  // edges bow inward and ripple while the plane is in flight; corners lead, middles lag
  float bx = sin(uv.y * 3.14159), by = sin(uv.x * 3.14159);
  vec2 off = vec2(-sign(c.x) * bx * abs(c.x) * 2.0, -sign(c.y) * by * abs(c.y) * 2.0) * uBend * 0.085 * uRect.zw;
  off += vec2(sin(uv.y * 9.0 + uT * 7.0), sin(uv.x * 7.0 + uT * 6.0)) * uBend * 7.0;
  vec2 px = uRect.xy + uv * uRect.zw + off;
  vec2 clip = px / uView * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  vUv = uv;
}`;
const FS = `
precision highp float; // must match the vertex shader: uRect is shared by both
uniform sampler2D uTex; uniform vec2 uImg; uniform vec4 uRect; uniform float uAlpha; uniform float uShade;
varying vec2 vUv;
void main() {
  float ra = uRect.z / uRect.w, ia = uImg.x / uImg.y;
  vec2 s = ra > ia ? vec2(1.0, ia / ra) : vec2(ra / ia, 1.0);
  vec3 col = texture2D(uTex, (vUv - 0.5) * s + 0.5).rgb;
  float y = vUv.y;
  float shade = max(smoothstep(0.45, 0.0, y), smoothstep(0.6, 1.0, y)) * 0.55 * uShade;
  gl_FragColor = vec4(col * (1.0 - shade), uAlpha);
}`;

function makeGL(canvas) {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: true, alpha: true });
  if (!gl) return null;
  const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  gl.useProgram(p);
  const N = 40, pts = [];
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const a = i / N, b = j / N, c = (i + 1) / N, d = (j + 1) / N;
    pts.push(a, b, c, b, a, d, a, d, c, b, c, d);
  }
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pts), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(p, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = Object.fromEntries(['uRect', 'uView', 'uBend', 'uT', 'uTex', 'uImg', 'uAlpha', 'uShade'].map((k) => [k, gl.getUniformLocation(p, k)]));
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  return {
    image(img) { gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); gl.uniform2f(u.uImg, img.naturalWidth, img.naturalHeight); },
    draw(r, bend, t, alpha, shade) {
      const dpr = Math.min(devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
      if (canvas.width !== W * dpr) { canvas.width = W * dpr; canvas.height = H * dpr; }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform4f(u.uRect, r.x, r.y, r.w, r.h); gl.uniform2f(u.uView, W, H);
      gl.uniform1f(u.uBend, bend); gl.uniform1f(u.uT, t); gl.uniform1f(u.uAlpha, alpha); gl.uniform1f(u.uShade, shade);
      gl.drawArrays(gl.TRIANGLES, 0, N * N * 6);
    },
    clear() { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); },
  };
}

const lerp = (a, b, k) => a + (b - a) * k;
const mix = (A, B, k) => ({ x: lerp(A.x, B.x, k), y: lerp(A.y, B.y, k), w: lerp(A.w, B.w, k), h: lerp(A.h, B.h, k) });
const rectOf = (el) => { const b = el.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; };
const heroRect = () => ({ x: 0, y: HERO_TOP, w: innerWidth, h: innerHeight - HERO_TOP });
const load = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => (i.decode ? i.decode().then(() => ok(i), () => ok(i)) : ok(i)); i.onerror = no; i.src = src; });
const waitFor = (fn, ms = 1500) => new Promise((ok) => { const t0 = performance.now(); const f = () => { const v = fn(); if (v || performance.now() - t0 > ms) ok(v); else requestAnimationFrame(f); }; f(); });
const EASE = [0.76, 0, 0.24, 1];

export function OpenerProvider({ children }) {
  const router = useRouter();
  const canvas = useRef(null);
  const veil = useRef(null);
  const gl = useRef(null);
  const busy = useRef(false);

  useEffect(() => { gl.current = makeGL(canvas.current); }, []);
  const off = () => matchMedia('(prefers-reduced-motion: reduce)').matches || !gl.current;

  const fly = useCallback((from, to, dur) => new Promise((ok) => {
    const t0 = performance.now();
    animate(0, 1, {
      duration: dur, ease: EASE,
      onUpdate: (k) => gl.current.draw(mix(from, to, k), Math.sin(k * Math.PI), (performance.now() - t0) / 1000, 1, 1),
      onComplete: ok,
    });
  }), []);

  /* card -> page */
  const open = useCallback(async (e, { el, src, href, key }) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // new-tab clicks behave like links
    e.preventDefault();
    if (off()) { router.push(href); return; }
    if (busy.current) return;
    busy.current = true;
    play('whoosh'); // a card opening into its page (JAMES rule 10)
    try {
      router.prefetch(href);
      sessionStorage.setItem('hz:ret:' + key, JSON.stringify({ y: scrollY, from: location.pathname })); // close returns to the page and card it opened from
      el.setAttribute('data-opening', '');
      const img = await load(src);
      gl.current.image(img);
      const from = rectOf(el);
      gl.current.draw(from, 0, 0, 1, 1);
      canvas.current.classList.add('on');
      el.setAttribute('data-lifted', '');
      veil.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });
      window.__lenis?.stop();
      await fly(from, heroRect(), 1.15);
      router.push(href, { scroll: false });
      await waitFor(() => document.querySelector(`[data-hero="${key}"][data-ready]`), 2500);
      window.__lenis?.start();
      window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0);
      const fade = { duration: 380, easing: 'ease-out', fill: 'forwards' };
      canvas.current.animate([{ opacity: 1 }, { opacity: 0 }], fade).finished.then(() => { canvas.current.classList.remove('on'); canvas.current.getAnimations().forEach((a) => a.cancel()); gl.current.clear(); });
      veil.current.animate([{ opacity: 1 }, { opacity: 0 }], fade);
    } catch {
      router.push(href);
    } finally {
      el.removeAttribute('data-opening'); el.removeAttribute('data-lifted');
      busy.current = false;
    }
  }, [router, fly]);

  /* page -> card, when the page was opened from one */
  const close = useCallback(async (e, { key, src, home: fallback = '/' }) => {
    e?.preventDefault?.();
    let ret = null;
    try { ret = JSON.parse(sessionStorage.getItem('hz:ret:' + key)); } catch {}
    const home = ret?.from || fallback;
    if (off() || !ret) { router.push(home); return; }
    if (busy.current) return;
    busy.current = true;
    try {
      const img = await load(src);
      gl.current.image(img);
      const top = scrollY;
      const from = { ...heroRect(), y: HERO_TOP - top };
      gl.current.draw(from, 0, 0, 1, 1);
      canvas.current.classList.add('on');
      veil.current.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 1, fill: 'forwards' });
      window.__hzHold = true;
      router.push(home, { scroll: false });
      const card = await waitFor(() => location.pathname.replace(/\/$/, '') === home.replace(/\/$/, '') && document.querySelector(`[data-card="${key}"]`), 2500);
      await new Promise((r) => setTimeout(r, 30)); // let the new page's effects settle before placing the scroll
      window.__lenis ? window.__lenis.scrollTo(ret.y, { immediate: true, force: true }) : scrollTo(0, ret.y);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (!card) throw new Error('no card');
      card.setAttribute('data-lifted', '');
      veil.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });
      await fly(from, rectOf(card), 1.05);
      card.removeAttribute('data-lifted');
      canvas.current.classList.remove('on');
      gl.current.clear();
    } catch {
      canvas.current.classList.remove('on');
      veil.current.getAnimations().forEach((a) => a.cancel());
    } finally {
      busy.current = false;
      window.__hzHold = false;
    }
  }, [router, fly]);

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      <div ref={veil} className="x-veil" aria-hidden="true" />
      <canvas ref={canvas} className="x-gl" aria-hidden="true" />
    </Ctx.Provider>
  );
}
