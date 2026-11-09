/* The products as a journey through space (home, #products). Loaded only when the section comes near the screen
   (components/home/Platform.jsx imports Journey.jsx, and with it this file and three.js, on demand), so the home page's
   first load carries none of it.
   Nine faceted graphite slabs sit along a gentle curve over a halftone floor that recedes into a soft horizon. Each one
   carries its product's own screen on its face (public/home/products/<name>-<theme>.webp, captured from the product
   stage and set in Hanzo monochrome). Scroll moves the camera from one to the next; the one in front can be dragged
   round and clicked open. In light the space turns white and the slabs stay graphite. The page's text is never drawn
   here: it stays HTML. */
// three's own modules (three/src), not its prebuilt bundle: only what this scene uses is shipped, in this one lazy chunk
import {
  WebGLRenderer, Scene, PerspectiveCamera, Vector3, Vector2, Group, Mesh, MeshStandardMaterial, MeshBasicMaterial, Color,
  BoxGeometry, BackSide, Shape, ExtrudeGeometry, BufferAttribute, BufferGeometry, EdgesGeometry, LineSegments,
  LineBasicMaterial, Points, ShaderMaterial, TextureLoader, SRGBColorSpace, PMREMGenerator, ACESFilmicToneMapping,
  Raycaster, CatmullRomCurve3, MathUtils,
} from 'three/src/Three.js';

export const GAP = 13; // distance between two products along the path
const SW = 4.4, SH = SW * 0.508; // a slab's face, the screens' own proportion

// a slab with cut corners and a chamfered rim, so every edge is a facet that catches the light
function slab(depth) {
  const w = SW / 2, h = SH / 2, c = 0.34;
  const s = new Shape();
  s.moveTo(-w + c, -h); s.lineTo(w - c, -h); s.lineTo(w, -h + c); s.lineTo(w, h - c);
  s.lineTo(w - c, h); s.lineTo(-w + c, h); s.lineTo(-w, h - c); s.lineTo(-w, -h + c); s.closePath();
  const geo = new ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.09, bevelSegments: 1, curveSegments: 1 });
  geo.translate(0, 0, -depth / 2);
  // the face takes the whole screen: caps get uv from their own extent (the back reads mirrored, like glass)
  const p = geo.attributes.position, uv = geo.attributes.uv;
  for (let k = 0; k < p.count; k++) {
    const back = p.getZ(k) < 0;
    const u = (p.getX(k) + w) / (2 * w), v = (p.getY(k) + h) / (2 * h);
    uv.setXY(k, back ? 1 - u : u, v);
  }
  geo.computeVertexNormals();
  return geo;
}

const PALETTE = {
  dark: { body: 0x3a3a40, metal: 0.9, rough: 0.3, screen: 0.95, edge: 0xe6e6ea, edgeA: 0.26, dotA: 0.8, env: 0.9 },
  light: { body: 0x2a2a2e, metal: 0.72, rough: 0.34, screen: 0.82, edge: 0x0a0a0a, edgeA: 0.3, dotA: 0.45, env: 0.75 },
};

const FLOOR_VS = `
attribute float aS;
uniform float uPR; uniform float uT;
varying float vA; varying float vS;
void main() {
  vec3 p = position;
  p.y += sin(p.x * 0.35 + uT * 0.6) * cos(p.z * 0.22 - uT * 0.4) * 0.12;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = -mv.z;
  vA = smoothstep(46.0, 18.0, d) * smoothstep(0.5, 4.0, d);
  vS = aS;
  gl_PointSize = (0.75 + aS * 2.6) * uPR * 18.0 / d;
  gl_Position = projectionMatrix * mv;
}`;
const FLOOR_FS = `
uniform vec3 uInk; uniform float uA;
varying float vA; varying float vS;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  if (dot(c, c) > 0.25) discard;
  gl_FragColor = vec4(uInk, uA * vA * (0.35 + vS * 0.65));
}`;

// the reflections: a dark studio with a broad softbox overhead, a long strip key on the left and a thin rim on the right,
// so graphite reads as graphite and every facet edge catches a line of silver
function studio() {
  const room = new Scene(), box = new BoxGeometry(), mats = [];
  const add = (mat, p, sc) => { const m = new Mesh(box, mat); m.position.set(...p); m.scale.set(...sc); room.add(m); mats.push(mat); };
  add(new MeshBasicMaterial({ color: 0x2a2a2e, side: BackSide }), [0, 0, 0], [40, 30, 40]);
  const light = (k) => new MeshBasicMaterial({ color: new Color(k, k, k) });
  add(light(14), [0, 14, 2], [16, 0.2, 10]); // softbox
  add(light(20), [-14, 4, 4], [0.2, 14, 2.2]); // strip key
  add(light(12), [14, 2, -6], [0.2, 12, 1.2]); // rim
  add(light(4), [0, -2, 16], [10, 3, 0.2]); // front fill
  return { room, dispose: () => { box.dispose(); mats.forEach((m) => m.dispose()); } };
}

export function createScene(canvas, { items, art, theme, onReady }) {
  const N = items.length;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const env = studio();
  scene.environment = pmrem.fromScene(env.room, 0.04).texture;
  env.dispose();
  pmrem.dispose();

  const camera = new PerspectiveCamera(32, 1, 0.1, 160);

  // the path: a soft S through space, one stop per product
  const stops = items.map((_, i) => new Vector3(Math.sin(i * 1.15) * 1.7, Math.cos(i * 0.85) * 0.45, -i * GAP));
  const path = new CatmullRomCurve3(stops, false, 'centripetal');

  const loader = new TextureLoader();
  const disposables = [];
  const bodies = [];
  const geo = slab(0.36);
  const edgesGeo = new EdgesGeometry(geo, 1);
  disposables.push(geo, edgesGeo);
  const holders = items.map((it, i) => {
    const holder = new Group();
    holder.position.copy(stops[i]);
    const spin = new Group();
    holder.add(spin);
    // the face: the product's screen, self-lit like a display under glass; the rim: glossy graphite
    const face = new MeshStandardMaterial({ roughness: 0.22, metalness: 0.05, envMapIntensity: 0.3, transparent: true, emissive: 0xffffff, emissiveIntensity: 0, color: 0x000000 });
    const rim = new MeshStandardMaterial({ flatShading: true, transparent: true });
    const body = new Mesh(geo, [face, rim]);
    body.userData.i = i;
    const edges = new LineSegments(edgesGeo, new LineBasicMaterial({ transparent: true, depthWrite: false }));
    spin.add(body, edges);
    holder.userData = { spin, body, face, rim, edges, drag: new Vector2(), vel: new Vector2(), seed: i * 1.7, tex: {} };
    disposables.push(face, rim, edges.material);
    bodies.push(body);
    scene.add(holder);
    return holder;
  });

  // each product's screen, in the theme on show (the other theme loads when the page switches)
  let themeName = theme;
  function screens(t) {
    holders.forEach((h, i) => {
      const u = h.userData;
      const use = (tex) => { if (themeName !== t) return; u.face.emissiveMap = tex; u.face.needsUpdate = true; };
      if (u.tex[t]) { use(u.tex[t]); return; }
      loader.load(art(items[i], t), (tex) => {
        tex.colorSpace = SRGBColorSpace;
        tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        u.tex[t] = tex; disposables.push(tex);
        use(tex);
      });
    });
  }

  // the halftone floor: Hanzo's dot field laid flat and receding into the horizon, denser away from the path
  const floorPts = [], floorS = [];
  const z0 = 16, z1 = -(N - 1) * GAP - 40, S = 0.62;
  for (let z = z0; z > z1; z -= S) for (let x = -34; x <= 34; x += S) {
    const cx = Math.sin((-z / GAP) * 1.15) * 1.7;
    const edge = Math.min(1, Math.abs(x - cx) / 16);
    const n = 0.55 + 0.45 * Math.sin(x * 0.21 + z * 0.13) * Math.cos(z * 0.17 - x * 0.07);
    const s = Math.max(0, Math.min(1, (0.15 + edge * 0.95) * n));
    if (s < 0.08) continue;
    floorPts.push(x, -2.6, z); floorS.push(s);
  }
  const floorGeo = new BufferGeometry();
  floorGeo.setAttribute('position', new BufferAttribute(new Float32Array(floorPts), 3));
  floorGeo.setAttribute('aS', new BufferAttribute(new Float32Array(floorS), 1));
  const floorMat = new ShaderMaterial({
    vertexShader: FLOOR_VS, fragmentShader: FLOOR_FS, transparent: true, depthWrite: false,
    uniforms: { uInk: { value: new Color() }, uA: { value: 0.5 }, uPR: { value: 1 }, uT: { value: 0 } },
  });
  scene.add(new Points(floorGeo, floorMat));
  disposables.push(floorGeo, floorMat);

  let pal = PALETTE.dark;
  function setTheme(next, ink) {
    pal = PALETTE[next] || PALETTE.dark;
    holders.forEach((h) => {
      const { rim, edges } = h.userData;
      rim.color.setHex(pal.body);
      rim.metalness = pal.metal;
      rim.roughness = pal.rough;
      rim.envMapIntensity = pal.env;
      edges.material.color.setHex(pal.edge);
    });
    floorMat.uniforms.uInk.value.set(ink || (next === 'light' ? '#0a0a0a' : '#e5e5e5'));
    floorMat.uniforms.uA.value = pal.dotA;
    if (next !== themeName) { themeName = next; screens(next); }
  }

  // size
  let W = 1, H = 1;
  function resize() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    floorMat.uniforms.uPR.value = pr * (H / 800);
  }

  // camera along the path; the product in front sits right of centre, clear of the text on the left
  const look = new Vector3(), at = new Vector3(), tmp = new Vector3();
  let t = 0, vel = 0;
  function frameCamera(time) {
    const k = MathUtils.clamp(t / (N - 1), 0, 1);
    path.getPoint(k, at);
    const dist = 11.6;
    const halfW = dist * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    const off = halfW * (camera.aspect > 1.2 ? 0.33 : 0.2);
    look.set(at.x - off, at.y + 0.15, at.z);
    camera.position.set(at.x - off + Math.sin(time * 0.21) * 0.12, at.y + 0.95 + Math.sin(time * 0.17) * 0.08, at.z + dist);
    camera.lookAt(look);
    camera.rotateZ(MathUtils.clamp(-vel * 0.9, -0.08, 0.08)); // a slight bank while travelling
  }

  // drag turns the product in front; inertia carries it a little further, then it settles back to face you
  const raycaster = new Raycaster(), ndc = new Vector2();
  function pick(x, y) {
    ndc.set((x / W) * 2 - 1, -(y / H) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(bodies, false)[0];
    return hit ? hit.object.userData.i : -1;
  }
  function drag(i, dx, dy) {
    const h = holders[i];
    if (h) h.userData.vel.set(dy * 0.006, dx * 0.008);
  }

  // per-frame read-out for the HTML around the canvas: one label anchor (the slab's upper corner) and its screen box
  const out = { t: 0, i: 0, anchors: [], box: null };
  const ANCH = [new Vector3(SW / 2 - 0.2, SH / 2 - 0.1, 0.2)];
  function readOut(i) {
    const h = holders[i];
    out.anchors.length = 0;
    if (!h) { out.box = null; return out; }
    h.updateMatrixWorld(true);
    ANCH.forEach((a) => {
      tmp.copy(a);
      h.userData.spin.localToWorld(tmp);
      tmp.project(camera);
      out.anchors.push({ x: (tmp.x * 0.5 + 0.5) * W, y: (-tmp.y * 0.5 + 0.5) * H });
    });
    tmp.copy(h.position).project(camera);
    const cx = (tmp.x * 0.5 + 0.5) * W, cy = (-tmp.y * 0.5 + 0.5) * H;
    const d = camera.position.distanceTo(h.position);
    const k = (H / 2) / (d * Math.tan(MathUtils.degToRad(camera.fov / 2)));
    out.box = { x: cx - (SW / 2) * k, y: cy - (SH / 2) * k, w: SW * k, h: SH * k };
    return out;
  }

  let raf = 0, running = false, last = 0, clock = 0, target = 0, ready = false, fade = 0;
  let getTarget = () => 0, onFrame = null;
  function tick(now) {
    raf = running ? requestAnimationFrame(tick) : 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now; clock += dt;
    target = getTarget();
    const prev = t;
    t += (target - t) * (1 - Math.exp(-dt * 4.2));
    if (Math.abs(target - t) < 0.0005) t = target;
    vel += ((t - prev) / Math.max(dt, 0.001) * 0.05 - vel) * 0.1;
    frameCamera(clock);
    holders.forEach((h, i) => {
      const u = h.userData, near = Math.abs(i - t);
      u.drag.x += u.vel.x; u.drag.y += u.vel.y;
      u.vel.multiplyScalar(Math.pow(0.04, dt));
      u.drag.multiplyScalar(1 - Math.min(1, dt * 0.45)); // a turned slab drifts back to face you
      u.spin.rotation.set(
        Math.sin(clock * 0.31 + u.seed) * 0.07 - 0.04 + u.drag.x,
        Math.sin(clock * 0.27 + u.seed) * 0.32 - 0.22 + u.drag.y,
        Math.sin(clock * 0.19 + u.seed) * 0.025,
      );
      // far stops fade and the next one drifts in; one already passed fades fast, before it reaches the camera
      const vis = i < t ? MathUtils.clamp(1 - (t - i - 0.08) * 2.6, 0, 1) : MathUtils.clamp(1 - (near - 0.25) * 1.1, 0, 1);
      const lit = MathUtils.clamp(1 - near * 1.4, 0, 1); // only the product in front is fully lit
      h.visible = vis > 0.01;
      u.face.opacity = vis; u.rim.opacity = vis;
      u.face.emissiveIntensity = pal.screen * (0.35 + 0.65 * lit) * fade;
      u.edges.material.opacity = pal.edgeA * vis;
      h.position.y = stops[i].y + Math.sin(clock * 0.5 + u.seed) * 0.08;
    });
    fade = Math.min(1, fade + dt * 1.2);
    floorMat.uniforms.uT.value = clock;
    renderer.render(scene, camera);
    // the text, the label and the click target follow where the scroll is going; the camera follows them
    out.t = t; out.i = Math.round(target);
    if (onFrame) onFrame(readOut(out.i));
    if (!ready) { ready = true; onReady && onReady(); }
  }

  function start() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(tick); }
  function stop() { running = false; cancelAnimationFrame(raf); raf = 0; }

  resize();
  setTheme(theme);
  screens(theme);

  return {
    start, stop, resize, setTheme, pick, drag,
    jump(v) { t = v; vel = 0; },
    bind(fns) { getTarget = fns.getTarget || getTarget; onFrame = fns.onFrame || null; },
    dispose() {
      stop();
      disposables.forEach((d) => d.dispose && d.dispose());
      scene.environment?.dispose?.();
      // no forceContextLoss(): the canvas element outlives this scene when React remounts the component (Strict Mode in
      // dev), and a new renderer on a canvas whose context was force-lost fails (getShaderPrecisionFormat returns null)
      renderer.dispose();
    },
  };
}
