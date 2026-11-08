/* The frontier models as a journey through space (home, #models). Loaded only when the section comes near the screen
   (components/models/Journey.jsx imports this file, and with it three.js, on demand), so the home page's first load
   carries none of it.
   Nine faceted, glossy solids sit along a gentle curve over a halftone floor that recedes into a soft horizon. Each
   wears its model's own artwork (public/models/<slug>.webp) etched into its facets. Scroll moves the camera from one
   to the next; the one in front can be dragged round and clicked open. Graphite and silver in dark; in light the
   space turns white and the solids stay graphite. The page's text is never drawn here: it stays HTML. */
// three's own modules (three/src), not its prebuilt bundle: only what this scene uses is shipped, in this one lazy chunk
import {
  WebGLRenderer, Scene, PerspectiveCamera, Vector3, Vector2, Group, Mesh, MeshStandardMaterial, MeshBasicMaterial, Color,
  BoxGeometry, BackSide,
  IcosahedronGeometry, OctahedronGeometry, DodecahedronGeometry, BufferAttribute, BufferGeometry,
  EdgesGeometry, LineSegments, LineBasicMaterial, LineLoop, Points, ShaderMaterial, TextureLoader, SRGBColorSpace,
  PMREMGenerator, ACESFilmicToneMapping, Raycaster, CatmullRomCurve3, MathUtils,
} from 'three/src/Three.js';

export const GAP = 13; // distance between two models along the path

// one silhouette per model, all low-poly
const SHAPES = [
  () => new IcosahedronGeometry(1.55, 1), // enso
  () => new OctahedronGeometry(1.5, 0).scale(1, 1.3, 1), // kai, a diamond
  () => new IcosahedronGeometry(1.5, 1).scale(1.08, 0.82, 1.08), // zen, a pebble
  () => new DodecahedronGeometry(1.5, 0), // iro
  () => new IcosahedronGeometry(1.6, 0), // koma
  () => new OctahedronGeometry(1.5, 1), // oto
  () => new DodecahedronGeometry(1.45, 1), // koe
  () => new IcosahedronGeometry(1.5, 1).scale(1, 1.12, 1), // uta
  () => new OctahedronGeometry(1.6, 2), // mori
];

// the artwork is projected onto the solid from the front (and mirrored onto the back), so it reads as an etching
// across the facets; the 4:5 poster is cropped to its centre square
function etch(geo) {
  geo = geo.index ? geo.toNonIndexed() : geo;
  geo.computeBoundingSphere();
  const R = geo.boundingSphere.radius, p = geo.attributes.position, uv = new Float32Array(p.count * 2);
  for (let k = 0; k < p.count; k++) {
    const x = p.getX(k) / (2 * R), y = p.getY(k) / (2 * R), back = p.getZ(k) < 0;
    uv[k * 2] = 0.5 + (back ? -x : x) * 1.05;
    uv[k * 2 + 1] = 0.5 + y * 0.84;
  }
  geo.setAttribute('uv', new BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  return geo;
}

const PALETTE = {
  dark: { body: 0x3a3a40, metal: 0.9, rough: 0.3, glow: 1.25, edge: 0xe6e6ea, edgeA: 0.22, ring: 0xffffff, ringA: 0.1, dotA: 0.8, env: 0.9 },
  light: { body: 0x2a2a2e, metal: 0.72, rough: 0.34, glow: 1.0, edge: 0x0a0a0a, edgeA: 0.3, ring: 0x0a0a0a, ringA: 0.14, dotA: 0.45, env: 0.75 },
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

export function createScene(canvas, { models, media, theme, onReady }) {
  const N = models.length;
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

  // the path: a soft S through space, one stop per model
  const stops = models.map((_, i) => new Vector3(Math.sin(i * 1.15) * 1.7, Math.cos(i * 0.85) * 0.45, -i * GAP));
  const path = new CatmullRomCurve3(stops, false, 'centripetal');

  const loader = new TextureLoader();
  const disposables = [];
  const bodies = [];
  const holders = models.map((m, i) => {
    const holder = new Group();
    holder.position.copy(stops[i]);
    const spin = new Group();
    holder.add(spin);
    const geo = etch(SHAPES[i % SHAPES.length]());
    const mat = new MeshStandardMaterial({ flatShading: true, transparent: true, emissive: 0xffffff, emissiveIntensity: 0 });
    loader.load(media(m.slug, 'webp'), (tex) => {
      tex.colorSpace = SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      mat.emissiveMap = tex; mat.needsUpdate = true;
      disposables.push(tex);
    });
    const body = new Mesh(geo, mat);
    body.userData.i = i;
    const edges = new LineSegments(new EdgesGeometry(geo, 1), new LineBasicMaterial({ transparent: true, depthWrite: false }));
    // a faint orbit round each solid
    const ringPts = [];
    for (let k = 0; k < 128; k++) { const a = (k / 128) * Math.PI * 2; ringPts.push(Math.cos(a) * 2.55, 0, Math.sin(a) * 2.55); }
    const ringGeo = new BufferGeometry();
    ringGeo.setAttribute('position', new BufferAttribute(new Float32Array(ringPts), 3));
    const ring = new LineLoop(ringGeo, new LineBasicMaterial({ transparent: true, depthWrite: false }));
    ring.rotation.set(1.18 + i * 0.07, 0, 0.32 - (i % 3) * 0.22);
    spin.add(body, edges);
    holder.add(ring);
    holder.userData = { spin, body, edges, ring, drag: new Vector2(), vel: new Vector2(), seed: i * 1.7 };
    disposables.push(geo, mat, edges.geometry, edges.material, ringGeo, ring.material);
    bodies.push(body);
    scene.add(holder);
    return holder;
  });

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
      const { body, edges, ring } = h.userData;
      body.material.color.setHex(pal.body);
      body.material.metalness = pal.metal;
      body.material.roughness = pal.rough;
      body.material.envMapIntensity = pal.env;
      edges.material.color.setHex(pal.edge);
      ring.material.color.setHex(pal.ring);
    });
    floorMat.uniforms.uInk.value.set(ink || (next === 'light' ? '#0a0a0a' : '#e5e5e5'));
    floorMat.uniforms.uA.value = pal.dotA;
    dirty = true;
  }

  // size
  let W = 1, H = 1, dirty = true;
  function resize() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    floorMat.uniforms.uPR.value = pr * (H / 800);
    dirty = true;
  }

  // camera along the path; the model in front sits right of centre, clear of the text on the left
  const look = new Vector3(), at = new Vector3(), tmp = new Vector3();
  let t = 0, vel = 0;
  function frameCamera(time) {
    const k = MathUtils.clamp(t / (N - 1), 0, 1);
    path.getPoint(k, at);
    const dist = 11.2;
    const halfW = dist * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    const off = halfW * (camera.aspect > 1.2 ? 0.36 : 0.22);
    look.set(at.x - off, at.y + 0.05, at.z);
    camera.position.set(at.x - off + Math.sin(time * 0.21) * 0.12, at.y + 0.85 + Math.sin(time * 0.17) * 0.08, at.z + dist);
    camera.lookAt(look);
    camera.rotateZ(MathUtils.clamp(-vel * 0.9, -0.08, 0.08)); // a slight bank while travelling
  }

  // drag rotates the model in front; inertia carries it a little further
  const raycaster = new Raycaster(), ndc = new Vector2();
  function pick(x, y) {
    ndc.set((x / W) * 2 - 1, -(y / H) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(bodies, false)[0];
    return hit ? hit.object.userData.i : -1;
  }
  function drag(i, dx, dy) {
    const h = holders[i];
    if (!h) return;
    h.userData.vel.set(dy * 0.006, dx * 0.008);
  }

  // per-frame read-out for the HTML around the canvas: label anchors and the model's screen box
  const ANCH = [new Vector3(1.05, 0.95, 0.45), new Vector3(1.25, -0.7, 0.35), new Vector3(-1.1, -1.0, 0.5)];
  const out = { t: 0, i: 0, anchors: [], box: null };
  function readOut(i) {
    const h = holders[i];
    out.anchors.length = 0;
    if (!h) { out.box = null; return out; }
    h.updateMatrixWorld(true);
    const R = h.userData.body.geometry.boundingSphere.radius;
    ANCH.forEach((a) => {
      tmp.copy(a).normalize().multiplyScalar(R * 0.92);
      h.userData.spin.localToWorld(tmp);
      tmp.project(camera);
      out.anchors.push({ x: (tmp.x * 0.5 + 0.5) * W, y: (-tmp.y * 0.5 + 0.5) * H, front: tmp.z < 1 });
    });
    tmp.copy(h.position).project(camera);
    const cx = (tmp.x * 0.5 + 0.5) * W, cy = (-tmp.y * 0.5 + 0.5) * H;
    const d = camera.position.distanceTo(h.position);
    const r = (R / (d * Math.tan(MathUtils.degToRad(camera.fov / 2)))) * (H / 2);
    out.box = { x: cx - r, y: cy - r, w: r * 2, h: r * 2 };
    return out;
  }

  let raf = 0, running = false, last = 0, clock = 0, target = 0, ready = false, firstLoad = 0;
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
      u.drag.x *= 1 - Math.min(1, dt * 0.35); // the pitch drifts back upright
      u.spin.rotation.set(
        Math.sin(clock * 0.31 + u.seed) * 0.16 + u.drag.x,
        Math.sin(clock * 0.27 + u.seed) * 0.62 + clock * 0.06 + u.drag.y,
        Math.sin(clock * 0.19 + u.seed) * 0.05,
      );
      u.ring.rotation.y = clock * 0.05 + u.seed;
      // far stops fade and the next one drifts in; one already passed fades fast, before it reaches the camera
      const vis = i < t ? MathUtils.clamp(1 - (t - i - 0.08) * 2.6, 0, 1) : MathUtils.clamp(1 - (near - 0.25) * 1.1, 0, 1);
      const lit = MathUtils.clamp(1 - near * 1.4, 0, 1); // only the model in front glows fully
      h.visible = vis > 0.01;
      u.body.material.opacity = vis;
      u.body.material.emissiveIntensity = pal.glow * (0.3 + 0.7 * lit) * (firstLoad);
      u.edges.material.opacity = pal.edgeA * vis;
      u.ring.material.opacity = pal.ringA * vis * (0.4 + 0.6 * lit);
      h.position.y = stops[i].y + Math.sin(clock * 0.5 + u.seed) * 0.08;
    });
    firstLoad = Math.min(1, firstLoad + dt * 1.2);
    floorMat.uniforms.uT.value = clock;
    renderer.render(scene, camera);
    // the text, the labels and the click target follow where the scroll is going; the camera follows them
    out.t = t; out.i = Math.round(target);
    if (onFrame) onFrame(readOut(out.i));
    if (!ready) { ready = true; onReady && onReady(); }
  }

  function start() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(tick); }
  function stop() { running = false; cancelAnimationFrame(raf); raf = 0; }

  resize();
  setTheme(theme);

  return {
    start, stop, resize, setTheme, pick, drag,
    jump(v) { t = v; },
    bind(fns) { getTarget = fns.getTarget || getTarget; onFrame = fns.onFrame || null; },
    dispose() {
      stop();
      disposables.forEach((d) => d.dispose && d.dispose());
      scene.environment?.dispose?.();
      renderer.dispose();
      renderer.forceContextLoss?.();
    },
  };
}
