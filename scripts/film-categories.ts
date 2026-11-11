// Category & product-backdrop dark-cinema films for hanzo.ai.
//
// Produces seamless 4:5 (960×1200 @ 30fps) monochrome dark-cinema loops in
// public/categories/<slug>.{webp,webm,mp4} matching the exact aesthetic, left
// typography safe-zone, tone curve, and zero-seam looping physics of
// public/models/{enso,koma,kai,zen,iro,mori,oto,koe,uta}.{webp,webm,mp4}.
//
// Engines:
//   node scripts/film-categories.ts                 GPU WebGL2 4x-SS shader films (all 8)
//   node scripts/film-categories.ts company cloud   Render specific slugs only
//   node scripts/film-categories.ts --look          Render frame 0 (.webp) only for fast visual review
//   node scripts/film-categories.ts --engine=nim    Generate via NVIDIA NIM / Wan3 / Hanzo Cloud video API
//                                                   (uses NVIDIA_API_KEY or HANZO_API_KEY + VIDEO_MODEL)

import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const OUT_DIR = path.join(ROOT, 'public', 'categories');

const FPS = 30;
const W = 960;
const H = 1200;

interface CategoryScene {
  slug: string;
  seconds: number;
  nimPrompt: string;
  shader: string;
}

const PRELUDE = `#version 300 es
precision highp float;
uniform vec2 R;
uniform float P;
out vec4 O;
#define TAU 6.283185307179586
#define PI 3.141592653589793
float h11(float p){p=fract(p*.1031);p*=p+33.33;p*=p+p;return fract(p);}
float h21(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
vec2 h22(vec2 p){vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));p3+=dot(p3,p3.yzx+33.33);return fract((p3.xx+p3.yz)*p3.zy);}
vec2 grad(vec2 i){float a=h21(i)*TAU;return vec2(cos(a),sin(a));}
float pn(vec2 p,float per){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*f*(f*(f*6.-15.)+10.);
  vec2 i0=vec2(mod(i.x,per),i.y),i1=vec2(mod(i.x+1.,per),i.y);
  float a=dot(grad(i0),f),b=dot(grad(i1),f-vec2(1,0)),c=dot(grad(i0+vec2(0,1)),f-vec2(0,1)),d=dot(grad(i1+vec2(1,1)),f-vec2(1,1));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float gn(vec2 p){return pn(p,1e6);}
vec2 loop(float r){return r*vec2(cos(TAU*P),sin(TAU*P));}
float tone(float L){return 1.-exp(-max(L,0.));}
float line(float d,float w){return 1.-smoothstep(w-.75,w+.75,abs(d));}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float sdBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
float sdTorus(vec3 p,vec2 t){vec2 q=vec2(length(p.xz)-t.x,p.y);return length(q)-t.y;}
`;

const SCENES: CategoryScene[] = [
  {
    slug: 'company',
    seconds: 6,
    nimPrompt:
      'Minimalist luxury monochrome architectural sculpture of interlocking smoked obsidian glass monoliths on pure black background, subject right of center, slow volumetric silver rim light sweeping behind beveled glass edges, 8k dark cinema loop, no text',
    shader: `
// Company: Isometric smoked-glass architectural monoliths rising in crystalline harmony,
// with razor-sharp lit bevels, internal glass lattice, sweeping volumetric rim light, and rising motes.
const float C30 = 0.8660254;
const float S30 = 0.5;
vec2 isoP(vec3 q) { return vec2((q.x - q.z) * C30, (q.x + q.z) * S30 - q.y); }
float segD(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}
bool inQuad(vec2 p, vec2 a, vec2 b, vec2 c, vec2 d) {
  vec2 e0 = b - a, e1 = c - b, e2 = d - c, e3 = a - d;
  float s0 = e0.x * (p.y - a.y) - e0.y * (p.x - a.x);
  float s1 = e1.x * (p.y - b.y) - e1.y * (p.x - b.x);
  float s2 = e2.x * (p.y - c.y) - e2.y * (p.x - c.x);
  float s3 = e3.x * (p.y - d.y) - e3.y * (p.x - d.x);
  return (s0 >= 0.0 && s1 >= 0.0 && s2 >= 0.0 && s3 >= 0.0) || (s0 <= 0.0 && s1 <= 0.0 && s2 <= 0.0 && s3 <= 0.0);
}
void drawTower(vec2 p, vec3 base, vec3 sz, float px, float phase, inout float L) {
  vec3 p000 = base + vec3(-sz.x, 0.0, -sz.z);
  vec3 p100 = base + vec3( sz.x, 0.0, -sz.z);
  vec3 p101 = base + vec3( sz.x, 0.0,  sz.z);
  vec3 p001 = base + vec3(-sz.x, 0.0,  sz.z);
  vec2 b00 = isoP(p000), b10 = isoP(p100), b11 = isoP(p101), b01 = isoP(p001);
  vec2 t00 = isoP(p000 + vec3(0, sz.y, 0));
  vec2 t10 = isoP(p100 + vec3(0, sz.y, 0));
  vec2 t11 = isoP(p101 + vec3(0, sz.y, 0));
  vec2 t01 = isoP(p001 + vec3(0, sz.y, 0));

  bool topF = inQuad(p, t00, t10, t11, t01);
  bool leftF = inQuad(p, t01, t11, b11, b01);
  bool rightF = inQuad(p, t11, t10, b10, b11);
  if (topF || leftF || rightF) L *= 0.42;

  float sweep = 0.5 + 0.5 * sin(TAU * (P + phase));
  if (topF) L += 0.14 + 0.10 * sweep;
  if (leftF) {
    float gradY = clamp((b11.y - p.y) / max(sz.y, 0.01), 0.0, 1.0);
    L += (0.045 + 0.085 * gradY) * (0.8 + 0.4 * sweep);
  }
  if (rightF) {
    float gradY = clamp((b11.y - p.y) / max(sz.y, 0.01), 0.0, 1.0);
    L += (0.022 + 0.05 * gradY);
  }
  // Razor-sharp glass bevel rims
  float dTop = min(min(segD(p, t00, t10), segD(p, t10, t11)), min(segD(p, t11, t01), segD(p, t01, t00))) / px;
  float dSpine = segD(p, t11, b11) / px;
  float dSides = min(segD(p, t01, b01), segD(p, t10, b10)) / px;
  float dBase = min(segD(p, b01, b11), segD(p, b11, b10)) / px;
  L += line(dTop, 0.78) * (0.85 + 0.45 * sweep) + exp(-dTop * 0.16) * 0.15;
  L += line(dSpine, 0.72) * 0.82 + exp(-dSpine * 0.18) * 0.12;
  L += line(dSides, 0.55) * 0.42;
  L += line(dBase, 0.45) * 0.22;
}
float scene(vec2 f) {
  float px = 1.0 / R.y;
  vec2 p = (f - vec2(0.64 * R.x, 0.56 * R.y)) / R.y;
  float L = 0.0;

  // Sweeping architectural studio spotlight behind the monoliths
  float beam = p.x * 0.78 + p.y * 0.45 - 0.12 * sin(TAU * P);
  L += 0.18 * exp(-beam * beam * 12.0) * smoothstep(0.28, -0.45, p.y);

  // Subtle base terrace grid
  for (int k = -3; k <= 3; k++) {
    float fk = float(k) * 0.09;
    float d1 = segD(p, isoP(vec3(fk, 0.0, -0.28)), isoP(vec3(fk, 0.0, 0.28))) / px;
    float d2 = segD(p, isoP(vec3(-0.28, 0.0, fk)), isoP(vec3(0.28, 0.0, fk))) / px;
    L += (line(d1, 0.45) + line(d2, 0.45)) * 0.08;
  }

  // Back-to-front smoked glass monoliths breathing gently
  drawTower(p, vec3(-0.08, 0.0, -0.10), vec3(0.068, 0.34 + 0.014 * sin(TAU * P), 0.068), px, 0.0, L);
  drawTower(p, vec3( 0.10, 0.0, -0.06), vec3(0.062, 0.25 + 0.012 * sin(TAU * (P + 0.25)), 0.062), px, 0.25, L);
  drawTower(p, vec3(-0.02, 0.0,  0.05), vec3(0.076, 0.46 + 0.016 * sin(TAU * (P + 0.5)), 0.076), px, 0.5, L);
  drawTower(p, vec3(-0.14, 0.0,  0.11), vec3(0.058, 0.21 + 0.012 * sin(TAU * (P + 0.75)), 0.058), px, 0.75, L);
  drawTower(p, vec3( 0.12, 0.0,  0.12), vec3(0.064, 0.30 + 0.014 * sin(TAU * (P + 0.15)), 0.064), px, 0.15, L);

  // Rising silver motes
  for (int m = 0; m < 16; m++) {
    float fm = float(m);
    vec2 h = h22(vec2(fm, 4.7));
    float mx = (h.x - 0.5) * 0.46 + 0.018 * sin(TAU * P + fm);
    float my = 0.06 - fract(h.y + P) * 0.56;
    float md = length(p - vec2(mx, my)) / px;
    float fade = sin(PI * fract(h.y + P));
    L += fade * exp(-md * md * 0.14) * 0.55;
  }

  L *= mix(0.06, 1.0, smoothstep(0.14, 0.46, f.x / R.x));
  L *= mix(0.16, 1.0, smoothstep(0.04, 0.34, 1.0 - f.y / R.y));
  return pow(tone(L * 1.22), 0.92);
}
`,
  },
  {
    slug: 'research',
    seconds: 6,
    nimPrompt:
      'Precision optical crystal lenses aligned in 3D depth focusing coherent silver light rays into a glowing harmonic wave on pure black background, dark cinema aesthetic, no text',
    shader: `
// Research: Precision optical crystal discs aligned along an axis in 3D depth,
// focusing coherent rays of light into a living harmonic interference wave.
float scene(vec2 f) {
  float px = 1.0 / R.y;
  vec2 p = (f - vec2(0.63 * R.x, 0.46 * R.y)) / R.y;
  float L = 0.0;

  // 5 tilted optical glass discs in perspective along a diagonal optical axis
  vec2 axis = normalize(vec2(0.88, -0.34));
  vec2 perp = vec2(-axis.y, axis.x);
  float u = dot(p, axis);
  float v = dot(p, perp);

  // Harmonic wave packet travelling cleanly through the optical train
  for (int w = 0; w < 7; w++) {
    float fw = float(w) - 3.0;
    float amp = (0.085 + 0.035 * fw * 0.25) * exp(-u * u * 5.5);
    float freq = 15.0 + fw * 1.4;
    float wy = amp * sin(u * freq - TAU * P * 2.0 + fw * 0.45);
    float d = abs(v - wy) / px;
    float env = smoothstep(-0.46, -0.18, u) * smoothstep(0.46, 0.16, u);
    float weight = exp(-abs(fw) * 0.42);
    L += env * weight * (line(d, 0.65) * 0.52 + exp(-d * 0.18) * 0.09);
  }

  // Central optical axis beam + focal flare
  float beamD = abs(v) / px;
  L += smoothstep(0.48, 0.0, abs(u)) * (line(beamD, 0.5) * 0.45 + exp(-beamD * 0.08) * 0.12);

  // 5 glass lenses along u
  for (int i = 0; i < 5; i++) {
    float fi = float(i) - 2.0;
    float u0 = fi * 0.115 + 0.008 * sin(TAU * P + fi * 0.9);
    float rad = 0.165 - abs(fi) * 0.018;
    // Project 3D disc tilted to camera into an ellipse
    vec2 dp = vec2((u - u0) / 0.36, v);
    float r = length(dp);
    float edge = (r - rad) / px;
    float pulse = 0.65 + 0.35 * cos(TAU * (P * 2.0 - fi * 0.22));
    // Crisp glass rim + inner concentric meniscus ring
    L += line(edge, 0.75) * (0.65 + 0.55 * pulse) + exp(-abs(edge) * 0.14) * 0.12 * pulse;
    float inner = (r - rad * 0.68) / px;
    L += line(inner, 0.45) * 0.22;
    if (r < rad) {
      float sheen = exp(-pow((dp.x + dp.y * 0.7) / rad * 1.6 + 0.4 * sin(TAU * P), 2.0) * 2.5);
      L += (0.028 + 0.075 * sheen) * (1.0 - r / rad * 0.4);
    }
    // Focal caustic spark where the beam pierces each lens
    float spark = length(vec2(u - u0, v)) / px;
    L += exp(-spark * spark * 0.035) * (0.55 + 0.9 * pulse) + exp(-spark * 0.11) * 0.16 * pulse;
  }

  L *= mix(0.06, 1.0, smoothstep(0.14, 0.46, f.x / R.x));
  L *= mix(0.16, 1.0, smoothstep(0.04, 0.34, 1.0 - f.y / R.y));
  return pow(tone(L * 1.22), 0.92);
}
`,
  },
  {
    slug: 'safety',
    seconds: 6,
    nimPrompt:
      'Precision concentric titanium and smoked glass cryptographic vault rings rotating in counter-phase around a luminous silver core on pure black background, dark cinema loop',
    shader: `
// Safety: Concentric cryptographic vault dial rings & hexagonal glass shield in tilted 3D
// perspective, rotating in counter-phase with etched silver Vernier ticks and verification pulses.
float sdHex(vec2 p, float r) {
  const vec3 k = vec3(-0.8660254, 0.5, 0.57735027);
  p = abs(p);
  p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
  p -= vec2(clamp(p.x, -k.z * r, k.z * r), r);
  return length(p) * sign(p.y);
}
float scene(vec2 f) {
  float px = 1.0 / R.y;
  vec2 p = (f - vec2(0.64 * R.x, 0.46 * R.y)) / R.y;
  float L = 0.0;

  // Tilted 3D plane coordinates (vault angled cleanly toward viewer)
  vec2 q = p;
  q.xy *= rot(-0.26);
  vec2 dPlane = vec2(q.x, q.y / 0.64);
  float r = length(dPlane);
  float ang = atan(dPlane.y, dPlane.x);

  // 4 concentric precision vault rings rotating in counter-phase
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float rad = 0.145 + fi * 0.072;
    float dir = mod(fi, 2.0) == 0.0 ? 1.0 : -1.0;
    float a = ang + dir * TAU * P * (i == 0 ? 1.0 : 1.0);
    float dRing = (r - rad) / px * 0.8;
    // Segmented arc gaps + Vernier tick marks
    float arc = smoothstep(-0.15, 0.15, cos(a * (3.0 + fi) + fi * 1.4));
    float sweep = 0.55 + 0.45 * cos(ang - TAU * P + fi * 0.8);
    L += (0.35 + 0.65 * arc) * (line(dRing, 0.72) * (0.62 + 0.48 * sweep) + exp(-abs(dRing) * 0.16) * 0.10);

    // Fine precision radial Vernier ticks inside each ring band
    float tickR = abs(r - (rad - 0.018));
    if (tickR < 0.012) {
      float ticks = pow(max(cos(a * (24.0 + fi * 12.0)), 0.0), 18.0);
      L += ticks * (1.0 - tickR / 0.012) * 0.36 * sweep;
    }
  }

  // Central smoked-glass hexagonal cryptographic core
  vec2 hq = dPlane * rot(TAU * P / 6.0);
  float hd = sdHex(hq, 0.095) / px * 0.8;
  if (hd < 0.0) {
    float sheen = exp(-pow((dPlane.x - dPlane.y) * 9.0 + 0.4 * sin(TAU * P), 2.0));
    L += 0.06 + 0.14 * sheen;
  }
  L += line(hd, 0.82) * 1.15 + exp(-abs(hd) * 0.14) * 0.22;

  // Inner luminous verification lock point
  float coreD = r / px;
  float lockPulse = 0.7 + 0.3 * sin(TAU * P * 2.0);
  L += exp(-coreD * coreD * 0.012) * 0.95 * lockPulse + exp(-coreD * 0.07) * 0.20;

  L *= mix(0.06, 1.0, smoothstep(0.14, 0.46, f.x / R.x));
  L *= mix(0.16, 1.0, smoothstep(0.04, 0.34, 1.0 - f.y / R.y));
  return pow(tone(L * 1.22), 0.92);
}
`,
  },
  {
    slug: 'cloud',
    seconds: 6,
    nimPrompt:
      'Isometric array of micro-machined black titanium server blades with luminous silver optical light packets routing between blades on pure black background, dark cinema loop',
    shader: `
// Cloud: Isometric array of vertical dark-glass compute blades in deep perspective,
// with bright optical packets routing cleanly across the fabric.
const float C30 = 0.8660254;
const float S30 = 0.5;
vec2 iso(vec3 p) {
  return vec2((p.x - p.z) * C30, (p.x + p.z) * S30 - p.y);
}
float segDist(vec2 p, vec2 a, vec2 b, out float h) {
  vec2 pa = p - a, ba = b - a;
  h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}
float scene(vec2 f) {
  float px = 1.0 / R.y;
  vec2 p = (f - vec2(0.65 * R.x, 0.50 * R.y)) / R.y;
  float L = 0.0;

  // Isometric substrate grid & routing traces
  for (int k = -3; k <= 3; k++) {
    float fk = float(k) * 0.095;
    float h1, h2;
    vec2 a1 = iso(vec3(fk, -0.14, -0.30)), b1 = iso(vec3(fk, -0.14, 0.30));
    float d1 = segDist(p, a1, b1, h1) / px;
    float pkt1 = exp(-pow((h1 - fract(P + float(k) * 0.19)) * 7.5, 2.0));
    L += line(d1, 0.55) * (0.14 + 0.95 * pkt1) + exp(-d1 * 0.18) * 0.16 * pkt1;

    vec2 a2 = iso(vec3(-0.30, -0.14, fk)), b2 = iso(vec3(0.30, -0.14, fk));
    float d2 = segDist(p, a2, b2, h2) / px;
    float pkt2 = exp(-pow((h2 - fract(P * 2.0 + float(k) * 0.31)) * 8.0, 2.0));
    L += line(d2, 0.55) * (0.14 + 0.85 * pkt2) + exp(-d2 * 0.18) * 0.14 * pkt2;
  }

  // 7 vertical dark-glass compute blades standing from back to front
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float z = -0.24 + fi * 0.08;
    float lift = 0.010 * sin(TAU * (P + fi / 7.0));
    float yBot = -0.11 + lift;
    float yTop = 0.14 + lift + 0.025 * cos(fi * 1.1);
    float x0 = -0.21, x1 = 0.21;

    vec2 tl = iso(vec3(x0, yTop, z));
    vec2 tr = iso(vec3(x1, yTop, z));
    vec2 br = iso(vec3(x1, yBot, z));
    vec2 bl = iso(vec3(x0, yBot, z));

    // Solve parallelogram coords (u along blade width, v along blade height)
    vec2 eU = tr - tl;
    vec2 eV = bl - tl;
    float det = eU.x * eV.y - eU.y * eV.x;
    vec2 rel = p - tl;
    float u = (rel.x * eV.y - rel.y * eV.x) / det;
    float v = (eU.x * rel.y - eU.y * rel.x) / det;

    if (u > 0.0 && u < 1.0 && v > 0.0 && v < 1.0) {
      // Occlude behind blades slightly so glass stacks cleanly
      L *= 0.58;
      float sweep = exp(-pow((u - fract(P + fi * 0.11)) * 4.5, 2.0));
      L += 0.032 + 0.055 * (1.0 - v) + 0.065 * sweep;
      // Micro telemetry LEDs along the top bevel of each blade
      float ledU = fract(u * 12.0);
      if (v < 0.10 && ledU > 0.25 && ledU < 0.75) {
        float on = 0.35 + 0.65 * pow(0.5 + 0.5 * sin(TAU * P * 2.0 + floor(u * 12.0) * 1.7 + fi), 3.0);
        L += on * 0.24 * (1.0 - v / 0.10);
      }
    }
    // Crisp sunlit top edge & side bevels
    float h;
    float dTop = segDist(p, tl, tr, h) / px;
    float dL = segDist(p, tl, bl, h) / px;
    float dR = segDist(p, tr, br, h) / px;
    float dB = segDist(p, bl, br, h) / px;
    float pulse = 0.65 + 0.35 * sin(TAU * (P - fi * 0.14));
    L += line(dTop, 0.75) * (0.75 + 0.55 * pulse) + exp(-dTop * 0.16) * 0.14 * pulse;
    L += (line(dL, 0.55) + line(dR, 0.55)) * 0.42;
    L += line(dB, 0.45) * 0.18;
  }

  L *= mix(0.06, 1.0, smoothstep(0.14, 0.46, f.x / R.x));
  L *= mix(0.16, 1.0, smoothstep(0.04, 0.34, 1.0 - f.y / R.y));
  return pow(tone(L * 1.2), 0.92);
}
`,
  },
  {
    slug: 'developers',
    seconds: 6,
    nimPrompt:
      'Suspended modular smoked glass polyhedral blocks and luminous silver circuit conduits sliding in harmonic precision on pure black background, dark cinema loop',
    shader: `
// Developers: Isometric modular smoked-glass syntax tiles & precision optical conduits
// sliding into alignment across 3 layers while coherent light pulses traverse their ports.
const float C30 = 0.8660254;
const float S30 = 0.5;
vec2 isoD(vec3 q) { return vec2((q.x - q.z) * C30, (q.x + q.z) * S30 - q.y); }
float segDev(vec2 p, vec2 a, vec2 b, out float h) {
  vec2 pa = p - a, ba = b - a;
  h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}
void drawTile(vec2 p, vec3 c, vec2 hs, float yThick, float px, float pulse, inout float L) {
  // Plan-space coords on top face at height c.y
  float u = p.x / C30;
  float v = (p.y + c.y) / S30;
  vec2 xz = vec2(u + v, v - u) * 0.5 - c.xz;
  float dTop = (max(abs(xz.x) - hs.x, abs(xz.y) - hs.y)) / 1.1547;

  float vb = (p.y + c.y - yThick) / S30;
  vec2 xzb = vec2(u + vb, vb - u) * 0.5 - c.xz;
  float dBot = (max(abs(xzb.x) - hs.x, abs(xzb.y) - hs.y)) / 1.1547;

  if (dTop < 0.0) {
    L *= 0.55;
    float sheen = exp(-pow((xz.x - xz.y) / max(hs.x, 0.02) * 0.9 + 0.6 * sin(TAU * P), 2.0) * 2.2);
    L += 0.045 + 0.08 * sheen + 0.05 * pulse;
  } else if (dBot < 0.0) {
    L += 0.025;
  }
  L += line(dTop / px, 0.72) * (0.72 + 0.55 * pulse) + exp(-abs(dTop) / (px * 5.5)) * 0.14 * (0.6 + pulse);
  L += line(dBot / px, 0.48) * 0.34;
}
float scene(vec2 f) {
  float px = 1.0 / R.y;
  vec2 p = (f - vec2(0.64 * R.x, 0.48 * R.y)) / R.y;
  float L = 0.0;

  // Vertical optical bus risers linking the 3 modular layers
  for (int r = 0; r < 6; r++) {
    float fr = float(r);
    vec2 slot = vec2(mod(fr, 3.0) - 1.0, floor(fr / 3.0) - 0.5) * 0.135;
    vec2 a = isoD(vec3(slot.x, -0.18, slot.y));
    vec2 b = isoD(vec3(slot.x,  0.20, slot.y));
    float h;
    float d = segDev(p, a, b, h) / px;
    float pkt = exp(-pow((h - fract(P * 2.0 + fr * 0.17)) * 6.5, 2.0));
    L += line(d, 0.52) * (0.18 + 1.05 * pkt) + exp(-d * 0.18) * 0.16 * pkt;
    // Port node sparks at layer junctions
    for (int ly = 0; ly < 3; ly++) {
      vec2 node = isoD(vec3(slot.x, -0.11 + float(ly) * 0.11, slot.y));
      float nd = length(p - node) / px;
      L += exp(-nd * nd * 0.04) * (0.35 + 0.75 * pkt);
    }
  }

  // 3 stacked layers of sliding modular smoked-glass syntax blocks (bottom to top)
  for (int ly = 0; ly < 3; ly++) {
    float fly = float(ly);
    float y0 = -0.11 + fly * 0.11;
    for (int k = 0; k < 3; k++) {
      float fk = float(k);
      float ph = fly * 0.31 + fk * 0.23;
      float slide = 0.022 * sin(TAU * (P + ph));
      vec3 center = vec3((fk - 1.0) * 0.115 + (ly == 1 ? slide : 0.0), y0, (mod(fk + fly, 2.0) - 0.5) * 0.11 + (ly != 1 ? slide : 0.0));
      vec2 hs = vec2(0.048 + 0.012 * mod(fk + fly, 2.0), 0.046);
      float pulse = pow(0.5 + 0.5 * cos(TAU * (P - ph)), 3.0);
      drawTile(p, center, hs, 0.014, px, pulse, L);
    }
  }

  L *= mix(0.06, 1.0, smoothstep(0.14, 0.46, f.x / R.x));
  L *= mix(0.16, 1.0, smoothstep(0.04, 0.34, 1.0 - f.y / R.y));
  return pow(tone(L * 1.22), 0.92);
}
`,
  },
  {
    slug: 'solutions',
    seconds: 6,
    nimPrompt:
      'Sculpted 3D quantitative silver ribbon manifold surface undulating smoothly under low raking studio light on pure black background, dark cinema loop',
    shader: `
// Solutions: A sculpted 3D parametric ribbon manifold of 22 lit silver fins in
// perspective, undulating smoothly as a quantitative wave passes across them.
float heightAt(float u, float v) {
  float env = exp(-(u * u * 2.1 + v * v * 1.8));
  float w1 = sin(u * 4.2 - TAU * P + v * 1.8);
  float w2 = 0.45 * cos(v * 3.6 + TAU * P - u * 1.5);
  return env * (0.24 * w1 + 0.14 * w2);
}
vec2 proj(vec3 q) {
  // Camera looking down at 26 degrees
  float cy = cos(0.46), sy = sin(0.46);
  float cx = cos(-0.52), sx = sin(-0.52);
  vec3 r1 = vec3(q.x * cx - q.z * sx, q.y, q.x * sx + q.z * cx);
  vec3 r2 = vec3(r1.x, r1.y * cy - r1.z * sy, r1.y * sy + r1.z * cy);
  float z = 2.45 + r2.z;
  return r2.xy / z * 1.25;
}
float seg(vec2 p, vec2 a, vec2 b, out float t) {
  vec2 pa = p - a, ba = b - a;
  t = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * t);
}
float scene(vec2 f) {
  float px = 1.0 / R.y;
  vec2 p = (f - vec2(0.63 * R.x, 0.47 * R.y)) / R.y;
  p.y = -p.y;
  float L = 0.0;

  // Back-to-front sculpted 3D fins so nearer ridges naturally catch specular light
  const int N = 20;
  const int M = 28;
  for (int j = 0; j < N; j++) {
    float v = mix(0.85, -0.85, float(j) / float(N - 1));
    float depthFade = mix(0.28, 1.0, float(j) / float(N - 1));
    vec2 prev = vec2(0.0);
    float prevH = 0.0;
    for (int i = 0; i <= M; i++) {
      float u = mix(-0.92, 0.92, float(i) / float(M));
      float h = heightAt(u, v);
      vec2 cur = proj(vec3(u, h, v));
      if (i > 0) {
        float st;
        float d = seg(p, prev, cur, st) / px;
        float hh = mix(prevH, h, st);
        float slope = (h - prevH) * float(M) * 0.5;
        // Raking studio highlight on rising crests
        float spec = clamp(0.45 + slope * 1.65 + hh * 2.2, 0.08, 1.85);
        float edge = smoothstep(0.92, 0.25, abs(u));
        L += depthFade * edge * spec * (line(d, 0.72) * 0.62 + exp(-d * 0.22) * 0.08);
      }
      prev = cur;
      prevH = h;
    }
  }

  L *= mix(0.06, 1.0, smoothstep(0.14, 0.46, f.x / R.x));
  L *= mix(0.16, 1.0, smoothstep(0.04, 0.34, 1.0 - f.y / R.y));
  return pow(tone(L * 1.18), 0.92);
}
`,
  },
  {
    slug: 'learn',
    seconds: 6,
    nimPrompt:
      'Concentric brushed platinum gyroscopic astrolabe orbital rings precessing around a luminous pearl sphere on pure black background, dark cinema loop',
    shader: `
// Learn: Raymarched 3D precision astrolabe / orbital gimbal rings with orbiting
// satellite pearls around a softly lit matte-quartz sphere.
float mapLearn(vec3 p, out int m) {
  m = 1;
  float sphere = length(p) - 0.22;

  vec3 q1 = p;
  q1.xy *= rot(0.55);
  q1.yz *= rot(0.25 * sin(TAU * P));
  float t1 = sdTorus(q1, vec2(0.48, 0.012));
  // Orbiting pearl on ring 1
  vec3 sat1 = vec3(0.48 * cos(TAU * P), 0.0, 0.48 * sin(TAU * P));
  float s1 = length(q1 - sat1) - 0.036;

  vec3 q2 = p;
  q2.xy *= rot(-0.48);
  q2.xz *= rot(0.35);
  q2.yz *= rot(0.28 * cos(TAU * P));
  float t2 = sdTorus(q2, vec2(0.68, 0.011));
  vec3 sat2 = vec3(0.68 * cos(-TAU * P + 1.2), 0.0, 0.68 * sin(-TAU * P + 1.2));
  float s2 = length(q2 - sat2) - 0.032;

  vec3 q3 = p;
  q3.yz *= rot(1.12);
  q3.xy *= rot(0.20 * sin(TAU * (P + 0.25)));
  float t3 = sdTorus(q3, vec2(0.86, 0.009));

  float rings = min(t1, min(t2, t3));
  float sats = min(s1, s2);
  float d = min(sphere, min(rings, sats));
  if (sats <= d + 1e-5) m = 3;
  else if (sphere <= d + 1e-5) m = 2;
  return d;
}
vec3 calcNL(vec3 p) {
  int m; float e = 0.0012;
  return normalize(vec3(
    mapLearn(p+vec3(e,0,0),m)-mapLearn(p-vec3(e,0,0),m),
    mapLearn(p+vec3(0,e,0),m)-mapLearn(p-vec3(0,e,0),m),
    mapLearn(p+vec3(0,0,e),m)-mapLearn(p-vec3(0,0,e),m)
  ));
}
float scene(vec2 f) {
  vec2 uv = (f - vec2(0.64 * R.x, 0.46 * R.y)) / R.y;
  uv.y = -uv.y;
  vec3 ro = vec3(0.0, 0.06, 2.75);
  vec3 rd = normalize(vec3(uv, -1.38));

  vec3 l1 = normalize(vec3(-0.7, 0.65, 0.75));
  float L = 0.0;
  float glow = 0.0;

  float t = 0.0; int m = 0; bool hit = false;
  for (int i = 0; i < 68; i++) {
    vec3 p = ro + rd * t;
    float d = mapLearn(p, m);
    if (m == 3) glow += exp(-abs(d) * 35.0) * 0.012;
    else glow += exp(-abs(d) * 42.0) * 0.004;
    if (d < 0.001) { hit = true; break; }
    if (t > 4.6) break;
    t += d * 0.85;
  }
  L += glow;
  if (hit) {
    vec3 p = ro + rd * t;
    vec3 n = calcNL(p);
    float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
    float wrap = max((dot(n, l1) + 0.3) / 1.3, 0.0);
    vec3 h = normalize(l1 - rd);
    float spec = pow(max(dot(n, h), 0.0), 44.0);
    if (m == 3) L += 0.45 + wrap * 0.8 + spec * 1.5;
    else if (m == 2) L += pow(wrap, 1.5) * 0.75 + fres * 0.55 + spec * 0.65;
    else L += 0.08 + wrap * 0.48 + fres * 0.95 + spec * 1.35;
  }
  L *= mix(0.06, 1.0, smoothstep(0.14, 0.46, f.x / R.x));
  L *= mix(0.16, 1.0, smoothstep(0.04, 0.34, 1.0 - f.y / R.y));
  return pow(tone(L * 1.25), 0.92);
}
`,
  },
  {
    slug: 'products',
    seconds: 6,
    nimPrompt:
      'Ambient dark smoked glass depth planes with subtle diagonal silver light sheen drifting on pure black background, minimal dark cinema backdrop loop',
    shader: `
// Products: Ambient dark-cinema glass light-stage behind floating product UI windows:
// diagonal volumetric silver rays and softly drifting bevelled glass frames in depth.
float scene(vec2 f) {
  float px = 1.0 / R.y;
  vec2 p = (f - vec2(0.55 * R.x, 0.45 * R.y)) / R.y;
  float L = 0.0;

  // Soft diagonal studio light curtain drifting across the stage
  float d1 = p.x * 0.82 + p.y * 0.57 - 0.18 * sin(TAU * P);
  float d2 = p.x * 0.65 - p.y * 0.76 + 0.15 * cos(TAU * P);
  L += 0.16 * exp(-d1 * d1 * 9.0);
  L += 0.10 * exp(-d2 * d2 * 14.0);

  // Subtle receding dark-glass frames catching rim light at the edges
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float s = fract(fi / 4.0 - P * 0.25) * 4.0;
    float z = 1.15 + s * 0.45;
    vec2 hs = vec2(0.46, 0.30) / z;
    vec2 center = vec2(0.08 / z, -0.02 / z);
    vec2 e = (abs(p - center) - hs) / px;
    float edge = max(e.x, e.y);
    float fade = sin(PI * (s / 4.0));
    L += fade * (line(edge, 0.6) * 0.34 + exp(-abs(edge) * 0.12) * 0.07);
  }

  L *= mix(0.25, 1.0, smoothstep(0.05, 0.42, f.x / R.x));
  L *= mix(0.18, 1.0, smoothstep(0.04, 0.36, 1.0 - f.y / R.y));
  return pow(tone(L * 1.15), 0.94);
}
`,
  },
];

function buildHtml(scene: CategoryScene, ss: number): string {
  return `<!doctype html>
<html><meta charset="utf-8"><style>html,body{margin:0;background:#000;overflow:hidden}canvas{display:block}</style>
<body><canvas id="c" width="${W}" height="${H}"></canvas>
<script>
const canvas = document.getElementById('c');
const gl = canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true, alpha: false });
if (!gl) throw new Error('WebGL2 unavailable');
const vsSrc = \`#version 300 es
in vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }\`;
const fsSrc = ${JSON.stringify(PRELUDE)} + ${JSON.stringify(scene.shader)} + \`
void main() {
  vec2 f = vec2(gl_FragCoord.x, R.y - gl_FragCoord.y);
  float c = 0.0;
  ${
    ss === 4
      ? 'c += scene(f + vec2(0.125, 0.375)); c += scene(f + vec2(0.375, -0.125)); c += scene(f + vec2(-0.125, -0.375)); c += scene(f + vec2(-0.375, 0.125)); c *= 0.25;'
      : 'c = scene(f);'
  }
  c += (h21(floor(gl_FragCoord.xy)) - 0.5) / 255.0;
  O = vec4(vec3(clamp(c, 0.0, 1.0)), 1.0);
}\`;
function compile(type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}
const prog = gl.createProgram();
gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSrc));
gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSrc));
gl.linkProgram(prog);
if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
gl.useProgram(prog);
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
const loc = gl.getAttribLocation(prog, 'a');
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
const uR = gl.getUniformLocation(prog, 'R');
const uP = gl.getUniformLocation(prog, 'P');
gl.viewport(0, 0, ${W}, ${H});
gl.uniform2f(uR, ${W}, ${H});
window.drawFrame = (p) => {
  gl.uniform1f(uP, p - Math.floor(p));
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.finish();
  return canvas.toDataURL('image/jpeg', 0.96);
};
window.drawFrame(0);
document.body.dataset.ready = '1';
</script></body></html>`;
}

function runFfmpeg(args: string[]) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
}

async function generateViaNimOrHanzo(scene: CategoryScene) {
  const apiKey = process.env.NVIDIA_API_KEY || process.env.HANZO_API_KEY;
  if (!apiKey) {
    throw new Error('Set NVIDIA_API_KEY or HANZO_API_KEY to use --engine=nim');
  }
  const baseUrl = (process.env.VIDEO_API_BASE || 'https://api.hanzo.ai/v1').replace(/\/$/, '');
  const model = process.env.VIDEO_MODEL || 'alibaba/wan-3.0';
  console.log(`[nim] Requesting ${model} for ${scene.slug}...`);

  const createRes = await fetch(`${baseUrl}/videos/generations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, prompt: scene.nimPrompt, size: '960x1200' }),
  });
  if (!createRes.ok) {
    throw new Error(`Video create HTTP ${createRes.status}: ${(await createRes.text()).slice(0, 240)}`);
  }
  const payload = (await createRes.json()) as {
    id?: string;
    url?: string;
    data?: Array<{ url?: string; b64_json?: string }>;
  };

  let mp4Bytes: Buffer | null = null;
  const directUrl = payload.url || payload.data?.[0]?.url;
  const b64 = payload.data?.[0]?.b64_json;
  if (b64) {
    mp4Bytes = Buffer.from(b64, 'base64');
  } else if (directUrl) {
    const dl = await fetch(directUrl);
    mp4Bytes = Buffer.from(await dl.arrayBuffer());
  } else if (payload.id) {
    for (let attempt = 0; attempt < 90; attempt++) {
      await new Promise((r) => setTimeout(r, 4000));
      const poll = await fetch(`${baseUrl}/videos/${payload.id}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const st = (await poll.json()) as { status?: string; url?: string };
      if (st.status === 'completed' || st.status === 'succeeded') {
        const contentRes = st.url
          ? await fetch(st.url)
          : await fetch(`${baseUrl}/videos/${payload.id}/content`, {
              headers: { Authorization: `Bearer ${apiKey}` },
            });
        mp4Bytes = Buffer.from(await contentRes.arrayBuffer());
        break;
      }
      if (st.status === 'failed' || st.status === 'cancelled') {
        throw new Error(`Video job ${payload.id} ended with status ${st.status}`);
      }
    }
  }
  if (!mp4Bytes) throw new Error(`No video bytes returned for ${scene.slug}`);

  const rawMp4 = path.join(OUT_DIR, `${scene.slug}.raw.mp4`);
  const outMp4 = path.join(OUT_DIR, `${scene.slug}.mp4`);
  const outWebm = path.join(OUT_DIR, `${scene.slug}.webm`);
  const outWebp = path.join(OUT_DIR, `${scene.slug}.webp`);
  fs.writeFileSync(rawMp4, mp4Bytes);

  runFfmpeg([
    '-i',
    rawMp4,
    '-vf',
    `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},format=gray,format=yuv420p`,
    '-an',
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    '23',
    '-movflags',
    '+faststart',
    outMp4,
  ]);
  runFfmpeg([
    '-i',
    outMp4,
    '-an',
    '-c:v',
    'libvpx-vp9',
    '-b:v',
    '0',
    '-crf',
    '33',
    '-row-mt',
    '1',
    outWebm,
  ]);
  runFfmpeg(['-i', outMp4, '-vframes', '1', '-c:v', 'libwebp', '-quality', '84', outWebp]);
  fs.rmSync(rawMp4, { force: true });
}

function resolveChromium() {
  const candidates = [
    path.join(ROOT, 'package.json'),
    path.resolve(ROOT, '../../hanzo-inc/app/package.json'),
  ];
  for (const pkg of candidates) {
    if (!fs.existsSync(pkg)) continue;
    try {
      const req = createRequire(pkg);
      return req('@playwright/test').chromium;
    } catch {
      // try next
    }
  }
  throw new Error('Could not resolve @playwright/test chromium');
}

async function renderGpuScene(browser: any, scene: CategoryScene, lookOnly: boolean) {
  const started = Date.now();
  const page = await browser.newPage({ viewport: { width: W, height: H, deviceScaleFactor: 1 } });
  await page.setContent(buildHtml(scene, 4), { waitUntil: 'load' });
  await page.waitForFunction(() => document.body.dataset.ready === '1');

  const outWebp = path.join(OUT_DIR, `${scene.slug}.webp`);
  const outWebm = path.join(OUT_DIR, `${scene.slug}.webm`);
  const outMp4 = path.join(OUT_DIR, `${scene.slug}.mp4`);

  // Capture frame 0 still (.webp) directly from the canvas
  const firstDataUrl: string = await page.evaluate(() => (window as any).drawFrame(0));
  const firstJpg = Buffer.from(firstDataUrl.split(',')[1], 'base64');
  const tmpFirst = path.join(OUT_DIR, `.tmp-${scene.slug}-0.jpg`);
  fs.writeFileSync(tmpFirst, firstJpg);
  runFfmpeg(['-i', tmpFirst, '-c:v', 'libwebp', '-quality', '84', outWebp]);
  fs.rmSync(tmpFirst, { force: true });

  if (lookOnly) {
    await page.close();
    console.log(`${scene.slug}: still ${fs.statSync(outWebp).size} B (${((Date.now() - started) / 1000).toFixed(1)}s)`);
    return;
  }

  // Stream all N frames over image2pipe into temporary lossless-ish H.264 master, then cut VP9 .webm and H.264 .mp4
  const totalFrames = scene.seconds * FPS;
  const masterMp4 = path.join(OUT_DIR, `.tmp-${scene.slug}-master.mp4`);
  const ff = spawn(
    'ffmpeg',
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-f',
      'image2pipe',
      '-vcodec',
      'mjpeg',
      '-framerate',
      String(FPS),
      '-i',
      '-',
      '-vf',
      'format=yuv420p',
      '-an',
      '-c:v',
      'libx264',
      '-preset',
      'medium',
      '-crf',
      '22',
      '-profile:v',
      'high',
      '-movflags',
      '+faststart',
      masterMp4,
    ],
    { stdio: ['pipe', 'inherit', 'inherit'] }
  );

  for (let i = 0; i < totalFrames; i++) {
    const dataUrl: string = await page.evaluate((p: number) => (window as any).drawFrame(p), i / totalFrames);
    const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) {
      await new Promise<void>((r) => ff.stdin.once('drain', () => r()));
    }
  }
  ff.stdin.end();
  await new Promise<void>((resolve, reject) => {
    ff.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });
  await page.close();

  fs.renameSync(masterMp4, outMp4);
  runFfmpeg([
    '-i',
    outMp4,
    '-an',
    '-c:v',
    'libvpx-vp9',
    '-b:v',
    '0',
    '-crf',
    '33',
    '-row-mt',
    '1',
    '-tile-columns',
    '2',
    '-cpu-used',
    '2',
    outWebm,
  ]);

  console.log(
    `${scene.slug}: ${totalFrames} frames in ${((Date.now() - started) / 1000).toFixed(1)}s -> webp ${(
      fs.statSync(outWebp).size / 1024
    ).toFixed(0)}KB, webm ${(fs.statSync(outWebm).size / 1024).toFixed(0)}KB, mp4 ${(
      fs.statSync(outMp4).size / 1024
    ).toFixed(0)}KB`
  );
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const args = process.argv.slice(2);
  const lookOnly = args.includes('--look');
  const engine = (args.find((a) => a.startsWith('--engine=')) || '--engine=gpu').split('=')[1];
  const requested = args.filter((a) => !a.startsWith('--'));
  const targets = SCENES.filter((s) => !requested.length || requested.includes(s.slug));

  if (engine === 'nim' || engine === 'hanzo') {
    for (const s of targets) {
      await generateViaNimOrHanzo(s);
    }
    return;
  }

  const chromium = resolveChromium();
  const browser = await chromium.launch({
    args: ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist'],
  });
  try {
    // Run up to 4 GPU scenes concurrently on DGX
    const concurrency = 4;
    let idx = 0;
    await Promise.all(
      Array.from({ length: Math.min(concurrency, targets.length) }, async () => {
        while (idx < targets.length) {
          const scene = targets[idx++];
          await renderGpuScene(browser, scene, lookOnly);
        }
      })
    );
  } finally {
    await browser.close();
  }
}

await main();
