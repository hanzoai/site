'use client';
/* Real-time 60fps WebGL2 dark-cinema 3D sculptures for Hanzo's header mega-menu stage.
   Built with the exact same isometric/perspective smoked-glass optics, razor bevel lines,
   tone(L * 1.24) curve, 1/255 hash dithering, and left/bottom typography safe-zone as
   scripts/film-categories.ts — giving every thematic & creative menu option its own bespoke
   sculpture by the same artist with 0 KB binary bloat and 0 ms network buffering. */

import { useEffect, useRef } from 'react';
import { CINEMA_SCENE_IDS, type CinemaSceneId } from '../../lib/visuals';

export { CINEMA_SCENE_IDS, type CinemaSceneId };

const COMMON_GLSL = `#version 300 es
precision highp float;
uniform vec2 R;
uniform float P;
out vec4 O;
#define TAU 6.283185307179586
#define PI 3.141592653589793
const float C30 = 0.8660254;
const float S30 = 0.5;

float h11(float p){p=fract(p*.1031);p*=p+33.33;p*=p+p;return fract(p);}
float h21(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
vec2 h22(vec2 p){vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));p3+=dot(p3,p3.yzx+33.33);return fract((p3.xx+p3.yz)*p3.zy);}
float tone(float L){return 1.-exp(-max(L,0.));}
float line(float d,float w){return 1.-smoothstep(w-.75,w+.75,abs(d));}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}

vec2 iso(vec3 q){return vec2((q.x-q.z)*C30,(q.x+q.z)*S30-q.y);}
vec3 spin3(vec3 q,float ay,float ax){
  q.xz*=rot(ay);
  q.yz*=rot(ax);
  return q;
}
vec2 proj(vec3 q,float ay,float ax){
  q=spin3(q,ay,ax);
  float s=1.55/max(0.45,1.85+q.z);
  return vec2(q.x,-q.y)*s;
}
float seg(vec2 p,vec2 a,vec2 b){
  vec2 pa=p-a,ba=b-a;
  float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-6),0.,1.);
  return length(pa-ba*h);
}
bool inQuad(vec2 p,vec2 a,vec2 b,vec2 c,vec2 d){
  vec2 e0=b-a,e1=c-b,e2=d-c,e3=a-d;
  float s0=e0.x*(p.y-a.y)-e0.y*(p.x-a.x);
  float s1=e1.x*(p.y-b.y)-e1.y*(p.x-b.x);
  float s2=e2.x*(p.y-c.y)-e2.y*(p.x-c.x);
  float s3=e3.x*(p.y-d.y)-e3.y*(p.x-d.x);
  return (s0>=0.&&s1>=0.&&s2>=0.&&s3>=0.)||(s0<=0.&&s1<=0.&&s2<=0.&&s3<=0.);
}
void prism(vec2 p,vec3 base,vec3 sz,float px,float ph,inout float L){
  vec3 p00=base+vec3(-sz.x,0.,-sz.z),p10=base+vec3(sz.x,0.,-sz.z);
  vec3 p11=base+vec3(sz.x,0.,sz.z),p01=base+vec3(-sz.x,0.,sz.z);
  vec2 b00=iso(p00),b10=iso(p10),b11=iso(p11),b01=iso(p01);
  vec2 t00=iso(p00+vec3(0,sz.y,0)),t10=iso(p10+vec3(0,sz.y,0));
  vec2 t11=iso(p11+vec3(0,sz.y,0)),t01=iso(p01+vec3(0,sz.y,0));
  bool topF=inQuad(p,t00,t10,t11,t01);
  bool leftF=inQuad(p,t01,t11,b11,b01);
  bool rightF=inQuad(p,t11,t10,b10,b11);
  if(topF||leftF||rightF) L*=0.40;
  float sw=0.5+0.5*sin(TAU*(P+ph));
  if(topF) L+=0.13+0.10*sw;
  if(leftF) L+=0.06+0.05*sw;
  if(rightF) L+=0.035;
  float dTop=min(min(seg(p,t00,t10),seg(p,t10,t11)),min(seg(p,t11,t01),seg(p,t01,t00)))/px;
  float dSp=seg(p,t11,b11)/px;
  float dSd=min(seg(p,t01,b01),seg(p,t10,b10))/px;
  float dBs=min(seg(p,b01,b11),seg(p,b11,b10))/px;
  L+=line(dTop,0.78)*(0.84+0.42*sw)+exp(-dTop*0.16)*0.14;
  L+=line(dSp,0.70)*0.78+exp(-dSp*0.18)*0.10;
  L+=line(dSd,0.55)*0.40+line(dBs,0.45)*0.22;
}
void plate(vec2 p,vec3 c,vec3 u,vec3 v,float ay,float ax,float px,float sw,inout float L){
  vec2 a=proj(c-u-v,ay,ax),b=proj(c+u-v,ay,ax),d=proj(c+u+v,ay,ax),e=proj(c-u+v,ay,ax);
  if(inQuad(p,a,b,d,e)){
    L*=0.42;
    L+=0.065+0.085*sw;
  }
  float de=min(min(seg(p,a,b),seg(p,b,d)),min(seg(p,d,e),seg(p,e,a)))/px;
  L+=line(de,0.76)*(0.78+0.42*sw)+exp(-de*0.17)*0.12;
}
void ring3(vec2 p,vec3 c,vec3 u,vec3 v,float ay,float ax,float px,float w,float br,inout float L){
  const int N=28;
  float md=1e5;
  vec2 prev=proj(c+u,ay,ax);
  for(int i=1;i<=N;i++){
    float a=TAU*float(i)/float(N);
    vec2 cur=proj(c+u*cos(a)+v*sin(a),ay,ax);
    md=min(md,seg(p,prev,cur));
    prev=cur;
  }
  float d=md/px;
  L+=line(d,w)*br+exp(-d*0.16)*(0.12*br);
}
void beacon(vec2 p,vec2 q,float px,float r,float br,inout float L){
  float d=length(p-q)/px;
  L+=exp(-d*d/(r*r))*br+exp(-d*0.14)*(0.20*br);
}
void studio(vec2 p,float seed,inout float L){
  float beam=p.x*0.72+p.y*0.48-0.10*sin(TAU*P+seed);
  L+=0.15*exp(-beam*beam*11.0);
}
void motes(vec2 p,float px,float seed,inout float L){
  for(int m=0;m<12;m++){
    float fm=float(m);
    vec2 h=h22(vec2(fm,seed));
    float ph=fract(h.y+P);
    vec2 mp=vec2((h.x-0.5)*0.56+0.02*sin(TAU*P+fm),0.22-ph*0.58);
    float d=length(p-mp)/px;
    L+=sin(PI*ph)*exp(-d*d*0.16)*0.50;
  }
}
`;

export const CINEMA_SHADERS: Record<CinemaSceneId, { seconds: number; shader: string }> = {
  // ==================== COMPANY (11) ====================
  'company-blog': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,1.1,L);
  float ay=-0.42+0.12*sin(TAU*P), ax=0.32;
  for(int i=0;i<5;i++){
    float fi=float(i), t=fract(fi/5.+P*0.2);
    float z=mix(0.24,-0.24,t);
    float y=mix(0.10,-0.08,t)+0.02*sin(TAU*(P+fi*.2));
    float fade=sin(PI*t);
    vec3 c=vec3((fi-2.)*0.035,y,z);
    plate(p,c,vec3(0.15,0.,0.),vec3(0.,0.19,0.),ay,ax,px,fade,L);
    for(int r=-2;r<=2;r++){
      float ry=float(r)*0.048;
      float hw=(r==-2)?0.065:0.105;
      float dl=seg(p,proj(c+vec3(-0.105,ry,0.),ay,ax),proj(c+vec3(hw,ry,0.),ay,ax))/px;
      L+=line(dl,0.52)*0.36*fade;
    }
  }
  motes(p,px,2.3,L);
  return L;
}`,
  },

  'company-reviews': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,2.4,L);
  float ay=TAU*P*0.5, ax=0.48;
  ring3(p,vec3(0),vec3(.28,0,0),vec3(0,0,.28),0.,0.55,px,0.65,0.55,L);
  ring3(p,vec3(0),vec3(.19,0,0),vec3(0,0,.19),0.,0.55,px,0.55,0.38,L);
  // 5-pointed crystalline verification star + orbiting testimony seals
  vec2 prev;
  for(int i=0;i<=10;i++){
    float a=TAU*float(i)/10.-PI*0.5+0.18*sin(TAU*P);
    float r=(i%2==0)?0.145:0.062;
    vec2 cur=proj(vec3(cos(a)*r,sin(a)*r*0.85,0.03*sin(a*2.+TAU*P)),0.25*sin(TAU*P),0.22);
    if(i>0){
      float d=seg(p,prev,cur)/px;
      L+=line(d,0.82)*0.92+exp(-d*0.16)*0.16;
    }
    if(i%2==0 && i<10){
      float dr=seg(p,vec2(0),cur)/px;
      L+=line(dr,0.48)*0.32;
      float oa=TAU*float(i/2)/5.+TAU*P;
      vec2 orb=proj(vec3(cos(oa)*0.28,0.,sin(oa)*0.28),0.,0.55);
      beacon(p,orb,px,2.4,0.85,L);
    }
    prev=cur;
  }
  beacon(p,vec2(0),px,2.8,0.75,L);
  motes(p,px,3.1,L);
  return L;
}`,
  },

  'company-careers': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.46*R.y))/R.y; float L=0.;
  studio(p,3.7,L);
  // Central glass spine
  float ds=seg(p,iso(vec3(0,-0.22,0)),iso(vec3(0,0.34,0)))/px;
  L+=line(ds,0.72)*0.55+exp(-ds*0.15)*0.12;
  // Ascending helical glass steps
  for(int i=0;i<11;i++){
    float fi=float(i);
    float t=fract(fi/11.+P*0.18);
    float y=-0.20+t*0.52;
    float a=t*TAU*1.35+TAU*P*0.5;
    vec3 dir=vec3(cos(a),0.,sin(a));
    vec3 perp=vec3(-dir.z,0.,dir.x)*0.042;
    vec3 p0=dir*0.04+vec3(0,y,0), p1=dir*0.23+vec3(0,y,0);
    vec2 a0=iso(p0-perp), b0=iso(p1-perp), c0=iso(p1+perp), d0=iso(p0+perp);
    float fade=sin(PI*t);
    if(inQuad(p,a0,b0,c0,d0)){ L*=0.44; L+=0.11*fade; }
    float de=min(min(seg(p,a0,b0),seg(p,b0,c0)),min(seg(p,c0,d0),seg(p,d0,a0)))/px;
    L+=line(de,0.74)*(0.45+0.55*fade)+exp(-de*0.18)*0.12*fade;
  }
  motes(p,px,4.2,L);
  return L;
}`,
  },

  'company-news': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.56*R.x,.45*R.y))/R.y; float L=0.;
  studio(p,4.9,L);
  float ay=-0.55+0.12*sin(TAU*P), ax=0.30;
  // Parabolic dish ribs & concentric rings
  for(int k=1;k<=3;k++){
    float r=float(k)*0.072;
    float z=-r*r*1.8+0.08;
    ring3(p,vec3(-0.08,0.04,z),vec3(r,0,0),vec3(0,r,0),ay,ax,px,0.65,0.62,L);
  }
  vec2 apex=proj(vec3(-0.08,0.04,0.08),ay,ax);
  vec2 feed=proj(vec3(0.02,-0.02,-0.12),ay,ax);
  for(int j=0;j<6;j++){
    float a=TAU*float(j)/6.;
    vec2 rim=proj(vec3(-0.08+cos(a)*0.216,0.04+sin(a)*0.216,-0.01),ay,ax);
    L+=line(seg(p,apex,rim)/px,0.48)*0.34;
    if(j%2==0) L+=line(seg(p,rim,feed)/px,0.52)*0.42;
  }
  beacon(p,feed,px,2.8,0.95,L);
  // Propagating broadcast wavefronts
  for(int w=0;w<4;w++){
    float t=fract(P+float(w)*0.25);
    float r=0.05+t*0.26;
    float fade=sin(PI*t);
    ring3(p,vec3(0.02+t*0.16,-0.02-t*0.06,-0.12-t*0.14),vec3(r,0,0),vec3(0,r,0),ay,ax,px,0.72,0.85*fade,L);
  }
  motes(p,px,5.1,L);
  return L;
}`,
  },

  'company-brand': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,5.8,L);
  float ay=0.22*sin(TAU*P), ax=0.18*cos(TAU*P);
  // Construction grid + golden-ratio circles
  for(int g=-2;g<=2;g++){
    float fg=float(g)*0.09;
    L+=line(seg(p,proj(vec3(-0.22,fg,0),ay,ax),proj(vec3(0.22,fg,0),ay,ax))/px,0.42)*0.16;
    L+=line(seg(p,proj(vec3(fg,-0.22,0),ay,ax),proj(vec3(fg,0.22,0),ay,ax))/px,0.42)*0.16;
  }
  ring3(p,vec3(0,0,0.02),vec3(0.22,0,0),vec3(0,0.22,0),ay,ax,px,0.58,0.46,L);
  ring3(p,vec3(0.055,0.034,-0.02),vec3(0.136,0,0),vec3(0,0.136,0),ay,ax,px,0.55,0.38,L);
  // Sculpted Hanzo geometric Z-monogram bevels
  float sw=0.5+0.5*sin(TAU*P);
  plate(p,vec3(0,0.11,-0.03),vec3(0.13,0,0),vec3(0,0.028,0),ay,ax,px,sw,L);
  plate(p,vec3(0,-0.11,-0.03),vec3(0.13,0,0),vec3(0,0.028,0),ay,ax,px,1.-sw,L);
  vec2 d0=proj(vec3(0.11,0.085,-0.04),ay,ax), d1=proj(vec3(-0.11,-0.085,-0.04),ay,ax);
  float dd=seg(p,d0,d1)/px;
  L+=line(dd,1.15)*0.95+exp(-dd*0.14)*0.22;
  beacon(p,d0,px,2.3,0.75,L); beacon(p,d1,px,2.3,0.75,L);
  motes(p,px,6.0,L);
  return L;
}`,
  },

  'company-philosophy': {
    seconds: 8,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.46*R.y))/R.y; float L=0.;
  studio(p,6.4,L);
  // Obsidian fulcrum pyramid
  vec2 tip=iso(vec3(0,0.08,0));
  vec2 b0=iso(vec3(-0.08,-0.12,-0.08)), b1=iso(vec3(0.08,-0.12,-0.08));
  vec2 b2=iso(vec3(0.08,-0.12,0.08)), b3=iso(vec3(-0.08,-0.12,0.08));
  L+=line(seg(p,tip,b1)/px,0.7)*0.55+line(seg(p,tip,b2)/px,0.8)*0.78+line(seg(p,tip,b3)/px,0.7)*0.55;
  L+=line(seg(p,b1,b2)/px,0.55)*0.36+line(seg(p,b2,b3)/px,0.55)*0.36;
  // Zen equilibrium beam gently breathing
  float tilt=0.075*sin(TAU*P);
  vec3 L3=vec3(-0.24,0.10+tilt,0.), R3=vec3(0.24,0.10-tilt,0.);
  vec2 lp=iso(L3), rp=iso(R3);
  float db=seg(p,lp,rp)/px;
  L+=line(db,0.95)*0.92+exp(-db*0.15)*0.18;
  beacon(p,tip,px,2.6,0.90,L);
  // Left & right suspended counterweights
  prism(p,L3+vec3(0,-0.12,0),vec3(0.048,0.096,0.048),px,0.0,L);
  ring3(p,R3+vec3(0,-0.07,0),vec3(0.068,0,0),vec3(0,0.068,0),TAU*P,0.35,px,0.78,0.88,L);
  L+=line(seg(p,lp,iso(L3+vec3(0,-0.024,0)))/px,0.55)*0.55;
  L+=line(seg(p,rp,iso(R3+vec3(0,-0.01,0)))/px,0.55)*0.55;
  motes(p,px,7.2,L);
  return L;
}`,
  },

  'company-contact': {
    seconds: 8,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,7.9,L);
  float ay=TAU*P, ax=0.38;
  float R0=0.23;
  // Latitude & longitude geodesic wireframe globe
  for(int la=-2;la<=2;la++){
    float lat=float(la)*0.42;
    float r=cos(lat)*R0, y=sin(lat)*R0;
    ring3(p,vec3(0,y,0),vec3(r,0,0),vec3(0,0,r),ay,ax,px,0.56,la==0?0.68:0.38,L);
  }
  for(int lo=0;lo<4;lo++){
    float a=PI*float(lo)/4.;
    ring3(p,vec3(0),vec3(cos(a)*R0,0,sin(a)*R0),vec3(0,R0,0),ay,ax,px,0.52,0.36,L);
  }
  // Regional beacons + elevated great-circle communication arc
  vec3 c1=normalize(vec3(0.7,0.45,0.55))*R0;
  vec3 c2=normalize(vec3(-0.6,0.52,0.60))*R0;
  vec3 c3=normalize(vec3(0.15,-0.35,0.92))*R0;
  beacon(p,proj(c1,ay,ax),px,2.7,0.95,L);
  beacon(p,proj(c2,ay,ax),px,2.7,0.95,L);
  beacon(p,proj(c3,ay,ax),px,2.5,0.85,L);
  vec2 prev=proj(c1,ay,ax);
  for(int k=1;k<=16;k++){
    float t=float(k)/16.;
    vec3 m=normalize(mix(c1,c2,t))*(R0+0.055*sin(PI*t));
    vec2 cur=proj(m,ay,ax);
    L+=line(seg(p,prev,cur)/px,0.75)*0.82;
    prev=cur;
  }
  motes(p,px,8.4,L);
  return L;
}`,
  },

  'blog-commerce': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,8.9,L);
  // Autonomous clearinghouse prism + dual settlement tracks
  prism(p,vec3(0,-0.06,0),vec3(0.068,0.14,0.068),px,0.0,L);
  ring3(p,vec3(0,0.01,0),vec3(0.27,0,0),vec3(0,0,0.27),TAU*P*0.5,0.58,px,0.72,0.72,L);
  ring3(p,vec3(0,0.01,0),vec3(0.19,0,0),vec3(0,0,0.19),-TAU*P*0.5,0.58,px,0.62,0.52,L);
  for(int i=0;i<4;i++){
    float a=TAU*(float(i)/4.+P);
    vec3 pk=vec3(cos(a)*0.27,0.01,sin(a)*0.27);
    vec2 pp=proj(pk,0.,0.58);
    beacon(p,pp,px,2.6,0.92,L);
    L+=line(seg(p,pp,iso(vec3(0,0.04,0)))/px,0.48)*0.26;
  }
  motes(p,px,9.1,L);
  return L;
}`,
  },

  'blog-bounds': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,9.8,L);
  float ay=0.38+0.15*sin(TAU*P), ax=0.42;
  float B=0.165;
  // Deterministic 12-edge containment cube
  for(int s=-1;s<=1;s+=2)for(int t=-1;t<=1;t+=2){
    float fs=float(s)*B, ft=float(t)*B;
    L+=line(seg(p,proj(vec3(fs,-B,ft),ay,ax),proj(vec3(fs,B,ft),ay,ax))/px,0.72)*0.72;
    L+=line(seg(p,proj(vec3(-B,fs,ft),ay,ax),proj(vec3(B,fs,ft),ay,ax))/px,0.72)*0.72;
    L+=line(seg(p,proj(vec3(fs,ft,-B),ay,ax),proj(vec3(fs,ft,B),ay,ax))/px,0.72)*0.72;
  }
  // Chaotic trajectory strictly clamped to [-B*0.80, B*0.80]
  vec2 prev;
  for(int k=0;k<=32;k++){
    float t=float(k)/32.*TAU+TAU*P;
    vec3 raw=vec3(sin(t*2.0)*0.24,cos(t*3.0)*0.24,sin(t*1.0+1.2)*0.24);
    vec3 cl=clamp(raw,vec3(-B*0.80),vec3(B*0.80));
    vec2 cur=proj(cl,ay,ax);
    if(k>0){
      float d=seg(p,prev,cur)/px;
      L+=line(d,0.82)*0.86+exp(-d*0.18)*0.12;
    }
    if(k==32) beacon(p,cur,px,3.2,1.1,L);
    prev=cur;
  }
  motes(p,px,10.3,L);
  return L;
}`,
  },

  'blog-kai': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,11.1,L);
  float ay=0.18*sin(TAU*P), ax=0.28;
  // Refractive triangular decision prism
  vec2 t0=proj(vec3(0,0.16,-0.08),ay,ax), t1=proj(vec3(-0.14,-0.11,0.08),ay,ax), t2=proj(vec3(0.14,-0.11,0.08),ay,ax);
  vec2 b0=proj(vec3(0,0.16,0.08),ay,ax);
  L+=line(seg(p,t0,t1)/px,0.85)*0.88+line(seg(p,t1,t2)/px,0.85)*0.88+line(seg(p,t2,t0)/px,0.85)*0.88;
  L+=line(seg(p,t0,b0)/px,0.65)*0.55;
  // Incoming noisy query beam on left -> 3 candidate rays -> 1 chosen bright vector
  vec2 inA=vec2(-0.34,0.04), hitL=mix(t0,t1,0.52), hitR=mix(t0,t2,0.52);
  L+=line(seg(p,inA,hitL)/px,0.92)*0.90;
  L+=line(seg(p,hitL,hitR)/px,0.72)*0.65;
  for(int c=0;c<3;c++){
    float fc=float(c)-1.;
    vec2 outP=vec2(0.32,fc*0.10-0.02);
    float chosen=(c==0)?1.0:0.22;
    float d=seg(p,hitR,outP)/px;
    L+=line(d,c==0?1.05:0.52)*chosen+exp(-d*0.14)*(0.24*chosen);
    if(c==0){
      vec2 pulse=mix(hitR,outP,fract(P*2.));
      beacon(p,pulse,px,2.8,1.0,L);
      beacon(p,outP,px,2.6,0.92,L);
    }
  }
  motes(p,px,11.7,L);
  return L;
}`,
  },

  'blog-archive': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.45*R.y))/R.y; float L=0.;
  studio(p,12.2,L);
  float ay=-0.48, ax=0.36;
  // Lit archival rail + fanning glass index cards with active selector wave
  L+=line(seg(p,proj(vec3(-0.26,-0.12,0),ay,ax),proj(vec3(0.26,-0.12,0),ay,ax))/px,0.75)*0.65;
  float focus=sin(TAU*P)*2.6;
  for(int i=-3;i<=3;i++){
    float fi=float(i);
    float lift=exp(-pow(fi-focus,2.)*0.9)*0.085;
    vec3 c=vec3(fi*0.068,0.02+lift,0.);
    plate(p,c,vec3(0,0,0.13),vec3(0,0.13,0),ay,ax,px,lift*9.0,L);
  }
  motes(p,px,12.8,L);
  return L;
}`,
  },

  // ==================== RESEARCH (4) ====================
  'research-models': {
    seconds: 8,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,13.4,L);
  // Central foundation nucleus + 5 orbiting model-family polyhedra
  prism(p,vec3(0,-0.06,0),vec3(0.056,0.12,0.056),px,0.0,L);
  ring3(p,vec3(0,0,0),vec3(0.25,0,0),vec3(0,0,0.25),0.,0.55,px,0.62,0.52,L);
  for(int i=0;i<5;i++){
    float a=TAU*(float(i)/5.+P*0.5);
    vec3 c=vec3(cos(a)*0.25,0.02*sin(a*2.),sin(a)*0.25);
    vec2 cp=proj(c,0.,0.55);
    L+=line(seg(p,vec2(0),cp)/px,0.45)*0.28;
    float r=0.042;
    int sides=3+(i%4);
    vec2 prev;
    for(int s=0;s<=6;s++){
      if(s>sides) break;
      float sa=TAU*float(s)/float(sides)+TAU*P;
      vec2 v=cp+vec2(cos(sa),sin(sa))*r;
      if(s>0) L+=line(seg(p,prev,v)/px,0.74)*0.84;
      prev=v;
    }
    beacon(p,cp,px,2.2,0.72,L);
  }
  motes(p,px,13.9,L);
  return L;
}`,
  },

  'research-benchmarks': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.48*R.y))/R.y; float L=0.;
  studio(p,14.5,L);
  // Base calibration grid
  for(int g=-2;g<=2;g++){
    float fg=float(g)*0.085;
    L+=line(seg(p,iso(vec3(fg,0,-0.18)),iso(vec3(fg,0,0.18)))/px,0.42)*0.16;
  }
  // 5 isometric benchmark score towers ascending toward Pareto frontier
  float hs[5]=float[5](0.12,0.19,0.25,0.31,0.38);
  vec2 prev;
  for(int i=0;i<5;i++){
    float fi=float(i)-2.;
    float h=hs[i]+0.018*sin(TAU*(P+float(i)*0.15));
    vec3 b=vec3(fi*0.078,0.,-fi*0.025);
    prism(p,b,vec3(0.028,h,0.028),px,float(i)*0.18,L);
    vec2 top=iso(b+vec3(0,h+0.03,0));
    if(i>0) L+=line(seg(p,prev,top)/px,0.85)*0.90;
    if(i==4) beacon(p,top,px,3.0,1.05,L);
    prev=top;
  }
  motes(p,px,15.0,L);
  return L;
}`,
  },

  'research-compare': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,15.6,L);
  float shift=0.045*sin(TAU*P);
  vec2 cL=vec2(-0.085+shift,0.0), cR=vec2(0.085-shift,0.0);
  // Dual counter-rotating vernier comparison lenses
  for(int s=0;s<2;s++){
    vec2 c=(s==0)?cL:cR;
    float dir=(s==0)?1.:-1.;
    float dRing=abs(length(p-c)-0.155)/px;
    L+=line(dRing,0.82)*0.86+exp(-dRing*0.16)*0.14;
    for(int t=0;t<16;t++){
      float a=TAU*float(t)/16.+dir*TAU*P*0.25;
      vec2 q0=c+vec2(cos(a),sin(a))*0.132;
      vec2 q1=c+vec2(cos(a),sin(a))*((t%4==0)?0.152:0.142);
      L+=line(seg(p,q0,q1)/px,0.55)*0.52;
    }
  }
  // Vesica overlap calibration axis
  L+=line(seg(p,vec2(0,-0.17),vec2(0,0.17))/px,0.68)*0.68;
  beacon(p,vec2(0,0.07*sin(TAU*P)),px,2.8,0.95,L);
  motes(p,px,16.2,L);
  return L;
}`,
  },

  'research-hips': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,16.9,L);
  float spread=0.085+0.024*sin(TAU*P);
  // 4 exploded isometric HIP specification strata + 4 vertical alignment pins
  for(int s=-1;s<=1;s+=2)for(int t=-1;t<=1;t+=2){
    vec2 pB=iso(vec3(float(s)*0.13,-0.14,float(t)*0.13));
    vec2 pT=iso(vec3(float(s)*0.13,0.18,float(t)*0.13));
    L+=line(seg(p,pB,pT)/px,0.45)*0.28;
  }
  for(int k=0;k<4;k++){
    float y=-0.11+float(k)*spread;
    prism(p,vec3(0,y,0),vec3(0.14,0.016,0.14),px,float(k)*0.25,L);
  }
  motes(p,px,17.4,L);
  return L;
}`,
  },

  // ==================== PRODUCTS -> CREATIVE AI (6) ====================
  'prod-video': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,18.1,L);
  float ay=-0.45, ax=0.22;
  // Cinema iris ring + gliding 16:9 filmstrip frames
  ring3(p,vec3(0),vec3(0.22,0,0),vec3(0,0.22,0),0.,0.,px,0.72,0.58,L);
  for(int b=0;b<6;b++){
    float a=TAU*float(b)/6.+0.3*sin(TAU*P);
    vec2 q0=vec2(cos(a),sin(a))*0.13, q1=vec2(cos(a+0.7),sin(a+0.7))*0.22;
    L+=line(seg(p,q0,q1)/px,0.55)*0.42;
  }
  for(int i=-2;i<=2;i++){
    float x=(float(i)-fract(P))*0.17;
    float fade=smoothstep(0.38,0.08,abs(x));
    plate(p,vec3(x,0,0),vec3(0.072,0,0),vec3(0,0.045,0),ay,ax,px,fade,L);
  }
  motes(p,px,18.6,L);
  return L;
}`,
  },

  'prod-images': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,19.2,L);
  // Viewfinder corner brackets + rule-of-thirds grid + rotating octahedron crystal
  float W=0.22, H=0.165, C=0.048;
  for(int sx=-1;sx<=1;sx+=2)for(int sy=-1;sy<=1;sy+=2){
    vec2 cr=vec2(float(sx)*W,float(sy)*H);
    L+=line(seg(p,cr,cr-vec2(float(sx)*C,0))/px,0.85)*0.88;
    L+=line(seg(p,cr,cr-vec2(0,float(sy)*C))/px,0.85)*0.88;
  }
  L+=line(seg(p,vec2(-W,H/3.),vec2(W,H/3.))/px,0.42)*0.22;
  L+=line(seg(p,vec2(-W,-H/3.),vec2(W,-H/3.))/px,0.42)*0.22;
  L+=line(seg(p,vec2(-W/3.,-H),vec2(-W/3.,H))/px,0.42)*0.22;
  L+=line(seg(p,vec2(W/3.,-H),vec2(W/3.,H))/px,0.42)*0.22;
  float ay=TAU*P, ax=0.45;
  vec2 top=proj(vec3(0,0.13,0),ay,ax), bot=proj(vec3(0,-0.13,0),ay,ax);
  for(int k=0;k<4;k++){
    float a=TAU*float(k)/4., na=TAU*float(k+1)/4.;
    vec2 v0=proj(vec3(cos(a)*0.11,0,sin(a)*0.11),ay,ax);
    vec2 v1=proj(vec3(cos(na)*0.11,0,sin(na)*0.11),ay,ax);
    L+=line(seg(p,top,v0)/px,0.78)*0.85+line(seg(p,bot,v0)/px,0.72)*0.72+line(seg(p,v0,v1)/px,0.72)*0.76;
  }
  beacon(p,top,px,2.4,0.85,L);
  motes(p,px,19.8,L);
  return L;
}`,
  },

  'prod-3d': {
    seconds: 8,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,20.3,L);
  float ay=TAU*P, ax=0.48+0.15*sin(TAU*P);
  // 3-axis XYZ gizmo + rotating icosahedral cage
  vec2 o=proj(vec3(0),ay,ax);
  vec2 gx=proj(vec3(0.24,0,0),ay,ax), gy=proj(vec3(0,0.24,0),ay,ax), gz=proj(vec3(0,0,0.24),ay,ax);
  L+=line(seg(p,o,gx)/px,0.75)*0.72+line(seg(p,o,gy)/px,0.75)*0.85+line(seg(p,o,gz)/px,0.75)*0.65;
  beacon(p,gx,px,2.1,0.8,L); beacon(p,gy,px,2.1,0.9,L); beacon(p,gz,px,2.1,0.75,L);
  float phi=1.618034*0.095, u=0.095;
  vec3 V[12]=vec3[12](
    vec3(0,u,phi),vec3(0,-u,phi),vec3(0,u,-phi),vec3(0,-u,-phi),
    vec3(u,phi,0),vec3(-u,phi,0),vec3(u,-phi,0),vec3(-u,-phi,0),
    vec3(phi,0,u),vec3(-phi,0,u),vec3(phi,0,-u),vec3(-phi,0,-u)
  );
  for(int i=0;i<12;i++)for(int j=i+1;j<12;j++){
    if(length(V[i]-V[j])<0.21){
      L+=line(seg(p,proj(V[i],ay,ax),proj(V[j],ay,ax))/px,0.64)*0.62;
    }
  }
  motes(p,px,20.9,L);
  return L;
}`,
  },

  'prod-sfx': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,21.4,L);
  // Acoustic transducer cone + concentric transient shockwaves
  beacon(p,vec2(-0.10,0),px,3.4,1.1,L);
  for(int k=0;k<5;k++){
    float t=fract(P+float(k)*0.2);
    float r=0.04+t*0.26;
    float fade=sin(PI*t);
    ring3(p,vec3(-0.10+t*0.22,0,0),vec3(0,r,0),vec3(0,0,r),0.45,0.22,px,0.80,0.92*fade,L);
  }
  L+=line(seg(p,vec2(-0.22,0),vec2(0.26,0))/px,0.52)*0.38;
  motes(p,px,21.9,L);
  return L;
}`,
  },

  'prod-voice': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,22.5,L);
  // Vocal formant harmonic ribbons with Gaussian speech envelope
  for(int r=0;r<5;r++){
    float fr=float(r)-2.;
    vec2 prev;
    for(int i=0;i<=44;i++){
      float u=float(i)/44.;
      float x=(u-0.5)*0.54;
      float env=exp(-x*x*24.0);
      float y=fr*0.032+env*0.095*sin(u*18.0-TAU*P*2.0+fr*0.8);
      vec2 cur=vec2(x,y);
      if(i>0){
        float d=seg(p,prev,cur)/px;
        float w=(r==2)?0.92:0.58;
        L+=line(d,w)*(r==2?0.95:0.48)+exp(-d*0.18)*0.08;
      }
      prev=cur;
    }
  }
  motes(p,px,23.1,L);
  return L;
}`,
  },

  'prod-music': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,23.7,L);
  float ay=-0.38, ax=0.36;
  // 6 vibrating harmonic strings stretched between crystalline bridges
  vec2 bL0=proj(vec3(-0.24,-0.12,0),ay,ax), bL1=proj(vec3(-0.24,0.12,0),ay,ax);
  vec2 bR0=proj(vec3(0.24,-0.12,0),ay,ax), bR1=proj(vec3(0.24,0.12,0),ay,ax);
  L+=line(seg(p,bL0,bL1)/px,0.85)*0.82+line(seg(p,bR0,bR1)/px,0.85)*0.82;
  for(int s=0;s<6;s++){
    float fs=(float(s)-2.5)*0.044;
    float mode=float(s%3+1);
    vec2 prev;
    for(int k=0;k<=28;k++){
      float u=float(k)/28.;
      float vib=sin(PI*u*mode)*sin(TAU*P*2.0+float(s)*0.9)*0.028;
      vec2 cur=proj(vec3((u-0.5)*0.48,fs,vib*2.2),ay,ax);
      if(k>0) L+=line(seg(p,prev,cur)/px,0.68)*0.72;
      prev=cur;
    }
  }
  motes(p,px,24.2,L);
  return L;
}`,
  },

  // ==================== SOLUTIONS (21) ====================
  'sol-enterprise': {
    seconds: 8,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.47*R.y))/R.y; float L=0.;
  studio(p,25.0,L);
  // Sovereign VPC core surrounded by 4 fortress bastion monoliths
  prism(p,vec3(-0.12,0,-0.12),vec3(0.038,0.22,0.038),px,0.0,L);
  prism(p,vec3(0.12,0,-0.12),vec3(0.038,0.22,0.038),px,0.25,L);
  prism(p,vec3(0,-0.02,0),vec3(0.068,0.34+0.015*sin(TAU*P),0.068),px,0.5,L);
  prism(p,vec3(-0.12,0,0.12),vec3(0.038,0.22,0.038),px,0.75,L);
  prism(p,vec3(0.12,0,0.12),vec3(0.038,0.22,0.038),px,0.12,L);
  ring3(p,vec3(0,0.18,0),vec3(0.24,0,0),vec3(0,0,0.24),TAU*P*0.5,0.52,px,0.64,0.58,L);
  motes(p,px,25.4,L);
  return L;
}`,
  },

  'sol-customers': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.47*R.y))/R.y; float L=0.;
  studio(p,26.1,L);
  // 4 ascending customer outcome milestones + trajectory pulse
  vec2 pts[4];
  for(int i=0;i<4;i++){
    float fi=float(i)-1.5;
    float h=0.10+float(i)*0.075;
    vec3 b=vec3(fi*0.095,-0.04,0.);
    prism(p,b,vec3(0.032,h,0.032),px,float(i)*0.2,L);
    pts[i]=iso(b+vec3(0,h+0.04,0));
    beacon(p,pts[i],px,2.4,0.85,L);
    if(i>0) L+=line(seg(p,pts[i-1],pts[i])/px,0.86)*0.88;
  }
  float u=fract(P)*3.;
  int segI=min(int(floor(u)),2);
  beacon(p,mix(pts[segI],pts[segI+1],fract(u)),px,3.2,1.15,L);
  motes(p,px,26.7,L);
  return L;
}`,
  },

  'sol-contact-sales': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,27.2,L);
  float gap=0.075+0.025*sin(TAU*P);
  plate(p,vec3(-gap,0,0),vec3(0.09,0,0.06),vec3(0,0.15,0),0.32,0.28,px,0.8,L);
  plate(p,vec3(gap,0,0),vec3(0.09,0,-0.06),vec3(0,0.15,0),-0.32,0.28,px,0.8,L);
  for(int r=-1;r<=1;r++){
    vec2 a=proj(vec3(-gap,float(r)*0.07,0),0.32,0.28);
    vec2 b=proj(vec3(gap,float(r)*0.07,0),-0.32,0.28);
    L+=line(seg(p,a,b)/px,0.78)*0.86;
    beacon(p,mix(a,b,fract(P+float(r+1)*0.33)),px,2.5,0.95,L);
  }
  motes(p,px,27.8,L);
  return L;
}`,
  },

  'sol-finance': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.45*R.y))/R.y; float L=0.;
  studio(p,28.3,L);
  // Isometric quantitative yield surface mesh
  const int G=6;
  for(int i=0;i<=G;i++){
    vec2 prevX, prevZ;
    for(int j=0;j<=G;j++){
      float x=(float(i)/float(G)-0.5)*0.38;
      float z=(float(j)/float(G)-0.5)*0.38;
      float y=0.075*sin(x*10.+TAU*P)*cos(z*10.+TAU*P*0.5)+0.05*(x+z);
      vec2 curX=iso(vec3(x,y,z));
      float x2=(float(j)/float(G)-0.5)*0.38, z2=(float(i)/float(G)-0.5)*0.38;
      float y2=0.075*sin(x2*10.+TAU*P)*cos(z2*10.+TAU*P*0.5)+0.05*(x2+z2);
      vec2 curZ=iso(vec3(x2,y2,z2));
      if(j>0){
        L+=line(seg(p,prevX,curX)/px,0.58)*0.56;
        L+=line(seg(p,prevZ,curZ)/px,0.58)*0.56;
      }
      prevX=curX; prevZ=curZ;
    }
  }
  beacon(p,iso(vec3(0.08,0.09,-0.06)),px,2.8,0.95,L);
  motes(p,px,28.9,L);
  return L;
}`,
  },

  'sol-sales': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,29.4,L);
  // Concentric velocity funnel rings accelerating downward into focal conversion point
  for(int k=0;k<5;k++){
    float fk=float(k)/4.;
    float r=mix(0.24,0.045,fk);
    float y=mix(0.14,-0.14,fk);
    ring3(p,vec3(0,y,0),vec3(r,0,0),vec3(0,0,r),0.,0.52,px,0.68,0.48+0.42*fk,L);
  }
  for(int s=0;s<6;s++){
    float t=fract(P+float(s)/6.);
    float a=TAU*(float(s)/6.+t*0.8);
    float r=mix(0.24,0.02,t);
    float y=mix(0.14,-0.16,t);
    beacon(p,proj(vec3(cos(a)*r,y,sin(a)*r),0.,0.52),px,2.3,sin(PI*t)*0.95,L);
  }
  beacon(p,proj(vec3(0,-0.16,0),0.,0.52),px,3.2,1.05,L);
  motes(p,px,29.9,L);
  return L;
}`,
  },

  'sol-marketing': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,30.5,L);
  beacon(p,vec2(0),px,3.2,1.0,L);
  for(int w=0;w<3;w++){
    float t=fract(P+float(w)/3.);
    ring3(p,vec3(0),vec3(0.06+t*0.22,0,0),vec3(0,0,0.06+t*0.22),0.,0.55,px,0.62,sin(PI*t)*0.75,L);
  }
  for(int i=0;i<4;i++){
    float a=TAU*(float(i)/4.+P*0.25);
    vec3 c=vec3(cos(a)*0.22,0.02*sin(a*2.),sin(a)*0.22);
    plate(p,c,vec3(0.048,0,0),vec3(0,0.064,0),a,0.35,px,0.75,L);
  }
  motes(p,px,31.0,L);
  return L;
}`,
  },

  'sol-operations': {
    seconds: 8,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,31.6,L);
  // Two meshing horological precision escapement wheels
  for(int g=0;g<2;g++){
    vec2 c=(g==0)?vec2(-0.085,-0.02):vec2(0.105,0.035);
    float r=(g==0)?0.135:0.095;
    int teeth=(g==0)?12:8;
    float dir=(g==0)?1.:-1.5;
    L+=line(abs(length(p-c)-r)/px,0.78)*0.82;
    L+=line(abs(length(p-c)-r*0.38)/px,0.62)*0.55;
    for(int t=0;t<12;t++){
      if(t>=teeth) break;
      float a=TAU*float(t)/float(teeth)+dir*TAU*P*0.25;
      vec2 d=vec2(cos(a),sin(a));
      L+=line(seg(p,c+d*(r-0.014),c+d*(r+0.022))/px,0.85)*0.85;
      if(t%2==0) L+=line(seg(p,c+d*(r*0.38),c+d*r)/px,0.52)*0.40;
    }
    beacon(p,c,px,2.4,0.85,L);
  }
  motes(p,px,32.1,L);
  return L;
}`,
  },

  'sol-design': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,32.8,L);
  // Cubic Bezier spline ribbon + control polygon & luminous anchor handles
  vec2 p0=vec2(-0.24,0.10), p1=vec2(-0.10,-0.20+0.05*sin(TAU*P));
  vec2 p2=vec2(0.10,0.20-0.05*sin(TAU*P)), p3=vec2(0.24,-0.08);
  L+=line(seg(p,p0,p1)/px,0.52)*0.42+line(seg(p,p2,p3)/px,0.52)*0.42;
  beacon(p,p0,px,2.4,0.85,L); beacon(p,p1,px,2.4,0.78,L);
  beacon(p,p2,px,2.4,0.78,L); beacon(p,p3,px,2.4,0.85,L);
  for(int s=-2;s<=2;s++){
    float off=float(s)*0.018;
    vec2 prev=p0+vec2(0,off);
    for(int k=1;k<=32;k++){
      float t=float(k)/32., it=1.-t;
      vec2 cur=it*it*it*p0+3.*it*it*t*p1+3.*it*t*t*p2+t*t*t*p3+vec2(0,off);
      L+=line(seg(p,prev,cur)/px,s==0?0.95:0.50)*(s==0?0.95:0.38);
      prev=cur;
    }
  }
  motes(p,px,33.3,L);
  return L;
}`,
  },

  'sol-cyber': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,34.0,L);
  float ay=TAU*P*0.5, ax=0.45;
  // Geodesic perimeter shield + radar sweep
  for(int k=1;k<=3;k++){
    float lat=float(k)*0.42;
    float r=cos(lat)*0.24, y=sin(lat)*0.24-0.06;
    ring3(p,vec3(0,y,0),vec3(r,0,0),vec3(0,0,r),ay,ax,px,0.62,0.58,L);
  }
  for(int j=0;j<6;j++){
    float a=TAU*float(j)/6.+ay;
    vec2 prev=proj(vec3(cos(a)*0.24,-0.06,sin(a)*0.24),0.,ax);
    for(int s=1;s<=8;s++){
      float th=float(s)/8.*PI*0.5;
      vec2 cur=proj(vec3(cos(a)*cos(th)*0.24,-0.06+sin(th)*0.24,sin(a)*cos(th)*0.24),0.,ax);
      L+=line(seg(p,prev,cur)/px,0.55)*0.48;
      prev=cur;
    }
  }
  prism(p,vec3(0,-0.08,0),vec3(0.042,0.10,0.042),px,0.0,L);
  motes(p,px,34.5,L);
  return L;
}`,
  },

  'sol-finserv': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,35.1,L);
  // High-frequency atomic settlement rails converging through central clearing vault
  prism(p,vec3(0,-0.07,0),vec3(0.062,0.15,0.062),px,0.2,L);
  for(int r=-2;r<=2;r++){
    float z=float(r)*0.062;
    vec2 a=iso(vec3(-0.28,0.01,z)), b=iso(vec3(0.28,0.01,z));
    L+=line(seg(p,a,b)/px,0.58)*0.48;
    float u=fract(P*1.5+float(r+2)*0.21);
    beacon(p,mix(a,b,u),px,2.4,0.92,L);
  }
  motes(p,px,35.6,L);
  return L;
}`,
  },

  'sol-healthcare': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,36.2,L);
  // 3D molecular double-helix with base-pair rungs
  vec2 prevA, prevB;
  for(int i=0;i<=24;i++){
    float u=float(i)/24.;
    float y=(u-0.5)*0.42;
    float a=u*TAU*1.4+TAU*P;
    vec2 pA=proj(vec3(cos(a)*0.11,y,sin(a)*0.11),0.,0.22);
    vec2 pB=proj(vec3(-cos(a)*0.11,y,-sin(a)*0.11),0.,0.22);
    if(i>0){
      L+=line(seg(p,prevA,pA)/px,0.85)*0.86;
      L+=line(seg(p,prevB,pB)/px,0.85)*0.86;
    }
    if(i%3==0){
      L+=line(seg(p,pA,pB)/px,0.55)*0.46;
      beacon(p,pA,px,2.0,0.72,L);
      beacon(p,pB,px,2.0,0.72,L);
    }
    prevA=pA; prevB=pB;
  }
  motes(p,px,36.8,L);
  return L;
}`,
  },

  'sol-law': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.45*R.y))/R.y; float L=0.;
  studio(p,37.3,L);
  // Precision analytical torsion scale + suspended folio plates
  L+=line(seg(p,vec2(0,-0.18),vec2(0,0.18))/px,0.82)*0.78;
  L+=line(seg(p,vec2(-0.09,0.18),vec2(0.09,0.18))/px,0.75)*0.68;
  float sw=0.03*sin(TAU*P);
  vec2 bL=vec2(-0.18,-0.12+sw), bR=vec2(0.18,-0.12-sw);
  L+=line(seg(p,bL,bR)/px,0.88)*0.88;
  beacon(p,vec2(0,-0.12),px,2.6,0.92,L);
  for(int s=0;s<2;s++){
    vec2 top=(s==0)?bL:bR;
    vec2 pan=top+vec2(0,0.14);
    L+=line(seg(p,top,pan+vec2(-0.055,0))/px,0.52)*0.52;
    L+=line(seg(p,top,pan+vec2(0.055,0))/px,0.52)*0.52;
    L+=line(seg(p,pan+vec2(-0.065,0),pan+vec2(0.065,0))/px,0.85)*0.86;
  }
  motes(p,px,37.9,L);
  return L;
}`,
  },

  'sol-retail': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.46*R.y))/R.y; float L=0.;
  studio(p,38.4,L);
  // 3x3 isometric fulfillment cube matrix with wave lift
  for(int ix=-1;ix<=1;ix++)for(int iz=-1;iz<=1;iz++){
    float ph=float(ix+iz)*0.18;
    float lift=0.05+0.045*max(0.,sin(TAU*(P+ph)));
    prism(p,vec3(float(ix)*0.105,-0.05,float(iz)*0.105),vec3(0.038,lift,0.038),px,ph,L);
  }
  motes(p,px,39.0,L);
  return L;
}`,
  },

  'sol-government': {
    seconds: 8,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.47*R.y))/R.y; float L=0.;
  studio(p,39.5,L);
  // Classical sovereign colonnade + rotunda dome ring
  ring3(p,vec3(0,-0.08,0),vec3(0.22,0,0),vec3(0,0,0.22),0.,0.55,px,0.68,0.62,L);
  ring3(p,vec3(0,0.14,0),vec3(0.20,0,0),vec3(0,0,0.20),0.,0.55,px,0.72,0.75,L);
  for(int c=0;c<6;c++){
    float a=TAU*float(c)/6.+TAU*P*0.167;
    vec3 base=vec3(cos(a)*0.19,-0.08,sin(a)*0.19);
    prism(p,base,vec3(0.022,0.22,0.022),px,float(c)/6.,L);
  }
  ring3(p,vec3(0,0.20,0),vec3(0.11,0,0),vec3(0,0,0.11),0.,0.55,px,0.62,0.68,L);
  beacon(p,iso(vec3(0,0.25,0)),px,2.6,0.92,L);
  motes(p,px,40.1,L);
  return L;
}`,
  },

  'sol-education': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,40.7,L);
  float ay=TAU*P*0.5, ax=0.38;
  float open=0.055+0.035*(0.5+0.5*sin(TAU*P));
  // Unfolding cube-net facets radiating around glowing inner spark
  beacon(p,vec2(0),px,3.4,1.1,L);
  plate(p,vec3(0,0,-open),vec3(0.065,0,0),vec3(0,0.065,0),ay,ax,px,0.7,L);
  plate(p,vec3(0,0,open),vec3(0.065,0,0),vec3(0,0.065,0),ay,ax,px,0.7,L);
  plate(p,vec3(-open,0,0),vec3(0,0,0.065),vec3(0,0.065,0),ay,ax,px,0.7,L);
  plate(p,vec3(open,0,0),vec3(0,0,0.065),vec3(0,0.065,0),ay,ax,px,0.7,L);
  ring3(p,vec3(0),vec3(0.24,0,0),vec3(0,0,0.24),-ay,0.55,px,0.52,0.44,L);
  motes(p,px,41.2,L);
  return L;
}`,
  },

  'sol-content': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,41.8,L);
  float ay=0.28*sin(TAU*P), ax=0.24;
  // Multi-aspect 16:9, 1:1, and 9:16 creative frames orbiting in depth
  plate(p,vec3(-0.08,0.02,0.08),vec3(0.14,0,0),vec3(0,0.082,0),ay,ax,px,0.65,L);
  plate(p,vec3(0.02,-0.01,0.0),vec3(0.10,0,0),vec3(0,0.10,0),ay,ax,px,0.82,L);
  plate(p,vec3(0.11,0.01,-0.08),vec3(0.068,0,0),vec3(0,0.125,0),ay,ax,px,0.95,L);
  motes(p,px,42.3,L);
  return L;
}`,
  },

  'sol-research': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,42.9,L);
  float ay=0.35, ax=0.32;
  // Michelson optical interferometer: splitter plate + 2 mirrors + fringe detector
  plate(p,vec3(0),vec3(0.08,0,0.08),vec3(0,0.09,0),ay,ax,px,0.85,L);
  plate(p,vec3(0.22,0,0),vec3(0,0,0.07),vec3(0,0.08,0),ay,ax,px,0.65,L);
  plate(p,vec3(0,0,-0.22),vec3(0.07,0,0),vec3(0,0.08,0),ay,ax,px,0.65,L);
  vec2 c=proj(vec3(0),ay,ax), m1=proj(vec3(0.22,0,0),ay,ax), m2=proj(vec3(0,0,-0.22),ay,ax);
  vec2 src=proj(vec3(-0.24,0,0),ay,ax), det=proj(vec3(0,0,0.22),ay,ax);
  L+=line(seg(p,src,c)/px,0.88)*0.88+line(seg(p,c,m1)/px,0.82)*0.82;
  L+=line(seg(p,c,m2)/px,0.82)*0.82+line(seg(p,c,det)/px,0.92)*0.95;
  beacon(p,c,px,2.8,0.95,L); beacon(p,det,px,3.0,1.0,L);
  motes(p,px,43.4,L);
  return L;
}`,
  },

  'sol-agents': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,44.0,L);
  // 6 autonomous agent nodes passing task batons around an orchestration ring
  ring3(p,vec3(0),vec3(0.23,0,0),vec3(0,0,0.23),0.,0.52,px,0.68,0.58,L);
  beacon(p,vec2(0),px,3.0,0.95,L);
  vec2 nodes[6];
  for(int i=0;i<6;i++){
    float a=TAU*(float(i)/6.+P*0.25);
    nodes[i]=proj(vec3(cos(a)*0.23,0.025*sin(a*3.),sin(a)*0.23),0.,0.52);
    beacon(p,nodes[i],px,2.4,0.85,L);
    L+=line(seg(p,vec2(0),nodes[i])/px,0.46)*0.30;
  }
  for(int b=0;b<3;b++){
    int i0=(b*2)%6, i1=(i0+1)%6;
    L+=line(seg(p,nodes[i0],nodes[i1])/px,0.78)*0.72;
    beacon(p,mix(nodes[i0],nodes[i1],fract(P*2.+float(b)*0.33)),px,2.5,1.0,L);
  }
  motes(p,px,44.6,L);
  return L;
}`,
  },

  'sol-reserved': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.46*R.y))/R.y; float L=0.;
  studio(p,45.2,L);
  // Dedicated locked 4-blade GPU vault bay + pulsing busbars
  for(int i=0;i<4;i++){
    float z=(float(i)-1.5)*0.072;
    prism(p,vec3(0,-0.08,z),vec3(0.14,0.16,0.024),px,float(i)*0.25,L);
  }
  for(int b=-1;b<=1;b+=2){
    vec2 a=iso(vec3(float(b)*0.16,0.10,-0.16)), d=iso(vec3(float(b)*0.16,0.10,0.16));
    L+=line(seg(p,a,d)/px,0.88)*0.88;
    beacon(p,mix(a,d,fract(P*1.5+(b>0?0.5:0.))),px,2.6,0.95,L);
  }
  motes(p,px,45.8,L);
  return L;
}`,
  },

  'sol-startups': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,46.4,L);
  // Aerodynamic delta wedge ascending through 3 staged booster rings
  float lift=0.025*sin(TAU*P);
  vec2 nose=iso(vec3(0,0.22+lift,0));
  vec2 wL=iso(vec3(-0.13,-0.02+lift,0.08)), wR=iso(vec3(0.13,-0.02+lift,0.08)), wB=iso(vec3(0,0.02+lift,-0.10));
  L+=line(seg(p,nose,wL)/px,0.92)*0.95+line(seg(p,nose,wR)/px,0.92)*0.95+line(seg(p,nose,wB)/px,0.78)*0.78;
  L+=line(seg(p,wL,wR)/px,0.75)*0.72+line(seg(p,wL,wB)/px,0.62)*0.55+line(seg(p,wR,wB)/px,0.62)*0.55;
  beacon(p,nose,px,2.8,1.0,L);
  for(int k=0;k<3;k++){
    float t=fract(P+float(k)/3.);
    float y=0.04-t*0.26;
    float r=0.09+t*0.14;
    ring3(p,vec3(0,y,0),vec3(r,0,0),vec3(0,0,r),0.,0.55,px,0.72,sin(PI*t)*0.85,L);
  }
  motes(p,px,47.0,L);
  return L;
}`,
  },

  'sol-partners': {
    seconds: 8,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,47.6,L);
  float ay=TAU*P*0.5, ax=0.42;
  // Three mutually interlocking Borromean rings in orthogonal planes
  ring3(p,vec3(0),vec3(0.21,0,0),vec3(0,0.13,0),ay,ax,px,0.84,0.88,L);
  ring3(p,vec3(0),vec3(0,0.21,0),vec3(0,0,0.13),ay,ax,px,0.84,0.84,L);
  ring3(p,vec3(0),vec3(0.13,0,0),vec3(0,0,0.21),ay,ax,px,0.84,0.80,L);
  beacon(p,vec2(0),px,2.8,0.90,L);
  motes(p,px,48.1,L);
  return L;
}`,
  },

  // ==================== DEVELOPERS (1) ====================
  'dev-integrations': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,48.8,L);
  // Central hexagonal dock + 6 snapping satellite connectors
  vec2 prev;
  for(int i=0;i<=6;i++){
    float a=TAU*float(i)/6.+PI/6.;
    vec2 cur=vec2(cos(a),sin(a))*0.095;
    if(i>0) L+=line(seg(p,prev,cur)/px,0.88)*0.92;
    prev=cur;
  }
  for(int k=0;k<6;k++){
    float a=TAU*float(k)/6.+PI/6.;
    vec2 dir=vec2(cos(a),sin(a));
    float d=0.175+0.045*(0.5+0.5*sin(TAU*(P+float(k)/6.)));
    vec2 sat=dir*d;
    L+=line(seg(p,dir*0.095,sat)/px,0.62)*0.58;
    beacon(p,sat,px,2.5,0.90,L);
  }
  beacon(p,vec2(0),px,2.6,0.85,L);
  motes(p,px,49.3,L);
  return L;
}`,
  },

  // ==================== LEARN & UNIVERSITY (12) ====================
  'learn-coding': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,50.0,L);
  // Parallel git worktree branches splitting, running & merging cleanly
  vec2 s0=vec2(-0.26,0), f0=vec2(-0.13,0), m0=vec2(0.13,0), e0=vec2(0.26,0);
  L+=line(seg(p,s0,f0)/px,0.90)*0.90+line(seg(p,m0,e0)/px,0.90)*0.90;
  for(int b=-1;b<=1;b++){
    vec2 mid1=vec2(-0.05,float(b)*0.11), mid2=vec2(0.05,float(b)*0.11);
    L+=line(seg(p,f0,mid1)/px,0.75)*0.78+line(seg(p,mid1,mid2)/px,0.78)*0.82+line(seg(p,mid2,m0)/px,0.75)*0.78;
    float u=fract(P+float(b+1)*0.28);
    vec2 dotP=u<0.33?mix(f0,mid1,u*3.):u<0.66?mix(mid1,mid2,(u-0.33)*3.):mix(mid2,m0,(u-0.66)*3.);
    beacon(p,dotP,px,2.4,0.95,L);
  }
  beacon(p,f0,px,2.6,0.9,L); beacon(p,m0,px,2.8,1.0,L);
  motes(p,px,50.6,L);
  return L;
}`,
  },

  'learn-guides': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,51.2,L);
  // Precision compass rose + needle locking onto true north
  ring3(p,vec3(0),vec3(0.22,0,0),vec3(0,0.22,0),0.,0.30,px,0.76,0.78,L);
  ring3(p,vec3(0),vec3(0.16,0,0),vec3(0,0.16,0),0.,0.30,px,0.52,0.42,L);
  float ang=-0.8+0.22*sin(TAU*P);
  vec2 tipN=vec2(cos(ang),sin(ang))*0.19, tipS=-tipN;
  vec2 side=vec2(-sin(ang),cos(ang))*0.032;
  L+=line(seg(p,tipN,side)/px,0.88)*0.95+line(seg(p,tipN,-side)/px,0.88)*0.95;
  L+=line(seg(p,tipS,side)/px,0.65)*0.55+line(seg(p,tipS,-side)/px,0.65)*0.55;
  beacon(p,tipN,px,2.6,1.0,L); beacon(p,vec2(0),px,2.4,0.85,L);
  motes(p,px,51.8,L);
  return L;
}`,
  },

  'learn-cookbook': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.45*R.y))/R.y; float L=0.;
  studio(p,52.4,L);
  // Modular recipe blocks docking smoothly into a 2x2x2 cube
  float gap=0.045+0.035*(0.5+0.5*sin(TAU*P));
  for(int ix=-1;ix<=1;ix+=2)for(int iy=0;iy<=1;iy++)for(int iz=-1;iz<=1;iz+=2){
    vec3 b=vec3(float(ix)*gap,-0.08+float(iy)*(gap*1.8),float(iz)*gap);
    prism(p,b,vec3(0.036,0.062,0.036),px,float(ix+iy+iz)*0.2,L);
  }
  motes(p,px,53.0,L);
  return L;
}`,
  },

  'learn-docs': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,53.6,L);
  // Open smoked-glass reference codex with fanning pages
  vec2 spB=iso(vec3(0,-0.14,0)), spT=iso(vec3(0,0.14,0));
  L+=line(seg(p,spB,spT)/px,0.90)*0.92;
  for(int pg=-3;pg<=3;pg++){
    if(pg==0) continue;
    float sgn=pg<0?-1.:1.;
    float idx=abs(float(pg));
    float ang=sgn*(0.35+idx*0.24+0.06*sin(TAU*P+idx));
    vec3 edge=vec3(sin(ang)*0.19,0.,cos(ang)*0.08);
    vec2 c0=iso(vec3(0,-0.12,0)+edge), c1=iso(vec3(0,0.12,0)+edge);
    L+=line(seg(p,spT,c1)/px,0.68)*0.68+line(seg(p,c1,c0)/px,0.68)*0.68+line(seg(p,c0,spB)/px,0.62)*0.52;
  }
  motes(p,px,54.2,L);
  return L;
}`,
  },

  'learn-support': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.47*R.y))/R.y; float L=0.;
  studio(p,54.8,L);
  // Guiding lighthouse monolith + sweeping horizon beam
  prism(p,vec3(0,-0.10,0),vec3(0.048,0.26,0.048),px,0.0,L);
  vec2 lamp=iso(vec3(0,0.20,0));
  beacon(p,lamp,px,3.6,1.15,L);
  float a=0.45*sin(TAU*P)-0.25;
  vec2 dir=vec2(cos(a),sin(a));
  vec2 rel=p-lamp;
  float along=dot(rel,dir);
  if(along>0.){
    float perp=abs(rel.x*dir.y-rel.y*dir.x);
    L+=0.28*exp(-perp/(0.04+along*0.24))*exp(-along*3.2);
  }
  ring3(p,vec3(0,0.20,0),vec3(0.14,0,0),vec3(0,0,0.14),TAU*P,0.55,px,0.60,0.55,L);
  motes(p,px,55.4,L);
  return L;
}`,
  },

  'learn-university': {
    seconds: 8,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.46*R.y))/R.y; float L=0.;
  studio(p,56.0,L);
  // Concentric tiered glass amphitheater arcs around lectern spark
  beacon(p,iso(vec3(0,-0.04,0)),px,3.0,1.0,L);
  for(int tier=1;tier<=4;tier++){
    float r=float(tier)*0.062;
    float y=-0.04+float(tier)*0.036;
    vec2 prev;
    for(int s=0;s<=18;s++){
      float a=-PI*0.85+PI*1.7*float(s)/18.+0.08*sin(TAU*P);
      vec2 cur=iso(vec3(cos(a)*r,y,sin(a)*r));
      if(s>0) L+=line(seg(p,prev,cur)/px,0.72)*(0.52+0.10*float(tier));
      prev=cur;
    }
  }
  motes(p,px,56.6,L);
  return L;
}`,
  },

  'uni-agentic-coding': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.44*R.y))/R.y; float L=0.;
  studio(p,57.2,L);
  float ay=TAU*P*0.5, ax=0.40;
  // Shared codebase cube constructed simultaneously by 3 orbiting agent cursors
  prism(p,vec3(0,-0.07,0),vec3(0.068,0.14,0.068),px,0.0,L);
  for(int a=0;a<3;a++){
    float ang=TAU*(float(a)/3.+P);
    vec2 cur=proj(vec3(cos(ang)*0.22,0.05*sin(ang*2.),sin(ang)*0.22),0.,ax);
    vec2 tgt=iso(vec3(0,0.02,0));
    L+=line(seg(p,cur,tgt)/px,0.68)*0.68;
    beacon(p,cur,px,2.7,0.98,L);
  }
  motes(p,px,57.8,L);
  return L;
}`,
  },

  'uni-rl': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,58.4,L);
  float ay=TAU*P*0.5, ax=0.48;
  // Toroidal policy-reward feedback loop (lemniscate infinity ribbon in 3D)
  vec2 prev;
  for(int i=0;i<=48;i++){
    float t=TAU*float(i)/48.;
    float den=1.+sin(t)*sin(t);
    vec3 q=vec3(0.26*cos(t)/den,0.07*sin(2.*t),0.22*sin(t)*cos(t)/den);
    vec2 cur=proj(q,0.22*sin(TAU*P),ax);
    if(i>0) L+=line(seg(p,prev,cur)/px,0.88)*0.86;
    prev=cur;
  }
  for(int k=0;k<3;k++){
    float t=TAU*fract(P+float(k)/3.);
    float den=1.+sin(t)*sin(t);
    vec3 q=vec3(0.26*cos(t)/den,0.07*sin(2.*t),0.22*sin(t)*cos(t)/den);
    beacon(p,proj(q,0.22*sin(TAU*P),ax),px,2.8,1.05,L);
  }
  motes(p,px,59.0,L);
  return L;
}`,
  },

  'uni-systems': {
    seconds: 6,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.45*R.y))/R.y; float L=0.;
  studio(p,59.6,L);
  // Bare-metal 4x4 systolic tensor wafer array firing diagonal compute wavefront
  float wave=fract(P)*6.-1.5;
  for(int ix=0;ix<4;ix++)for(int iz=0;iz<4;iz++){
    float x=(float(ix)-1.5)*0.082, z=(float(iz)-1.5)*0.082;
    float fire=exp(-pow(float(ix+iz)-wave*1.5,2.)*1.2);
    prism(p,vec3(x,-0.04,z),vec3(0.028,0.024+0.045*fire,0.028),px,fire,L);
  }
  motes(p,px,60.2,L);
  return L;
}`,
  },

  'uni-practitioner': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,60.8,L);
  // Optical collimator lens transforming scattered prompts into parallel structured vectors
  ring3(p,vec3(0),vec3(0,0.17,0),vec3(0,0,0.17),0.42,0.18,px,0.85,0.90,L);
  for(int r=-2;r<=2;r++){
    float fr=float(r);
    vec2 inP=vec2(-0.26,fr*0.058+0.02*sin(TAU*P+fr));
    vec2 lensP=vec2(0,fr*0.028);
    vec2 outP=vec2(0.26,fr*0.028);
    L+=line(seg(p,inP,lensP)/px,0.58)*0.55;
    L+=line(seg(p,lensP,outP)/px,0.82)*0.88;
    beacon(p,mix(lensP,outP,fract(P*1.5+float(r+2)*0.18)),px,2.2,0.92,L);
  }
  motes(p,px,61.4,L);
  return L;
}`,
  },

  'uni-architect': {
    seconds: 8,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.45*R.y))/R.y; float L=0.;
  studio(p,62.0,L);
  // 3-tier sovereign cloud architecture connected by encrypted vertical trunks
  float ys[3]=float[3](-0.12,0.01,0.14);
  float ws[3]=float[3](0.15,0.115,0.08);
  for(int t=0;t<3;t++){
    prism(p,vec3(0,ys[t],0),vec3(ws[t],0.022,ws[t]),px,float(t)*0.33,L);
  }
  for(int c=-1;c<=1;c+=2){
    vec2 b=iso(vec3(float(c)*0.07,-0.10,0)), tp=iso(vec3(float(c)*0.07,0.16,0));
    L+=line(seg(p,b,tp)/px,0.72)*0.75;
    beacon(p,mix(b,tp,fract(P*1.5+(c>0?0.5:0.))),px,2.4,0.95,L);
  }
  motes(p,px,62.6,L);
  return L;
}`,
  },

  'uni-marketing': {
    seconds: 7,
    shader: `
float scene(vec2 f){
  float px=1./R.y; vec2 p=(f-vec2(.58*R.x,.43*R.y))/R.y; float L=0.;
  studio(p,63.2,L);
  // Generative campaign prism fanning one core signal into 5 radial asset cards
  vec2 origin=vec2(-0.18,0.0);
  beacon(p,origin,px,3.0,1.0,L);
  for(int k=-2;k<=2;k++){
    float a=float(k)*0.26+0.04*sin(TAU*P+float(k));
    vec2 target=origin+vec2(cos(a),sin(a))*0.34;
    L+=line(seg(p,origin,target)/px,0.68)*0.68;
    plate(p,vec3(target.x,target.y,0),vec3(0.036,0,0),vec3(0,0.048,0),0.25,0.20,px,0.5+0.5*sin(TAU*(P+float(k)*0.2)),L);
  }
  motes(p,px,63.8,L);
  return L;
}`,
  },
};

const VS_SRC = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

function buildFragmentSource(body: string): string {
  return `${COMMON_GLSL}
${body}
void main() {
  vec2 f = vec2(gl_FragCoord.x, R.y - gl_FragCoord.y);
  float s0 = scene(f + vec2(0.25, 0.25));
  float s1 = scene(f - vec2(0.25, 0.25));
  float L = 0.5 * (s0 + s1);
  L *= mix(0.14, 1.0, smoothstep(0.02, 0.34, f.x / R.x));
  L *= mix(0.18, 1.0, smoothstep(0.02, 0.24, 1.0 - f.y / R.y));
  float c = pow(tone(L * 1.24), 0.94);
  c += (h21(floor(gl_FragCoord.xy)) - 0.5) / 255.0;
  O = vec4(vec3(clamp(c, 0.0, 1.0)), 1.0);
}`;
}

export default function StageCinemaGL({ scene }: { scene: CinemaSceneId }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const def = CINEMA_SHADERS[scene];
    if (!def) return;

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: true,
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(`[StageCinemaGL:${scene}]`, gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VS_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, buildFragmentSource(def.shader));
    if (!vs || !fs) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return;
    }

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(`[StageCinemaGL:${scene}] link`, gl.getProgramInfoLog(prog));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return;
    }

    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const W = 640;
    const H = 580;
    canvas.width = W;
    canvas.height = H;
    gl.viewport(0, 0, W, H);

    const uR = gl.getUniformLocation(prog, 'R');
    const uP = gl.getUniformLocation(prog, 'P');
    gl.uniform2f(uR, W, H);

    const calm = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const periodMs = def.seconds * 1000;
    const t0 = performance.now();
    let raf = 0;

    const draw = (now: number) => {
      const p = calm ? 0.18 : ((now - t0) % periodMs) / periodMs;
      gl.uniform1f(uP, p);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!calm) raf = requestAnimationFrame(draw);
    };
    draw(t0);

    return () => {
      cancelAnimationFrame(raf);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [scene]);

  return <canvas ref={ref} className="x-nav-stage-gl" data-gl-scene={scene} aria-hidden="true" />;
}
