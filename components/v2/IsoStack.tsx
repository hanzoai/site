'use client';
/* IsoStack (v2; owned by the Platform + Cloud chat). A stack of plates in isometric view that a scroll can pull apart
   (layered explode) and a camera can travel along (zoom into one part). Orthographic, transform only: each plate is
   one translateZ inside one rotated layer, and the camera is one translate + scale outside it.

   Usage:
     <IsoStack items={[{ key: 'gw', n: '01', name: 'Gateway' }, …]}   // top plate first
       explode={mv0to1} camX={mvPx} camY={mvPx} camScale={mv} tone="dark"
       mark={(i) => 'lit' | 'dim' | 'match' | ''} onPick={(i) => …} onHot={(i) => …} />
   - explode: a MotionValue from 0 (one slab) to 1 (every gap open). camX / camY / camScale: optional MotionValues.
   - zOf(b, e) is exported so a page can aim its camera at a plate (b counts from the bottom plate, 0).
   - The plates are a picture (aria-hidden): give keyboard users the same choices as real buttons elsewhere.
   Styles: IsoStack.css (--iso-acc colours a lit plate's edge, --iso-w / --iso-h the plate size, --iso-tx / --iso-tz
   turn the stack in degrees, e.g. from the pointer; it follows with a soft transition). */
import { motion, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import './IsoStack.css';

export const BASE = 7;
export const GAP = 40;
export const zOf = (b: number, e: number) => b * (BASE + GAP * e);
export const LIFT = Math.sin((56 * Math.PI) / 180); // screen pixels per unit of height, at the 56° tilt

interface IsoItem {
  key: string;
  n: string;
  name: string;
}

interface PlateProps {
  it: IsoItem;
  b: number;
  explode: MotionValue<number>;
  mark?: string;
  onPick?: (i: number) => void;
  onHot?: (i: number) => void;
  i: number;
}

function Plate({ it, b, explode, mark, onPick, onHot, i }: PlateProps) {
  const z = useTransform(explode, (e) => zOf(b, e));
  return (
    <motion.div
      className={'iso-plate ' + (mark || '')}
      style={{ z }}
      onClick={onPick ? () => onPick(i) : undefined}
      onPointerEnter={onHot ? (e) => (e.pointerType === 'mouse' || e.pointerType === 'pen') && onHot(i) : undefined}
      onPointerLeave={onHot ? () => onHot(-1) : undefined}
    >
      <i className="iso-n">{it.n}</i>
      <i className="iso-name">{it.name}</i>
    </motion.div>
  );
}

interface IsoStackProps {
  items: readonly IsoItem[];
  explode: MotionValue<number>;
  camX?: MotionValue<number>;
  camY?: MotionValue<number>;
  camScale?: MotionValue<number>;
  tone?: string;
  mark?: (i: number) => string;
  onPick?: (i: number) => void;
  onHot?: (i: number) => void;
  className?: string;
}

export default function IsoStack({ items, explode, camX, camY, camScale, tone = 'light', mark = () => '', onPick, onHot, className = '' }: IsoStackProps) {
  const N = items.length;
  return (
    <div className={'iso ' + tone + ' ' + className} aria-hidden="true">
      <motion.div className="iso-cam" style={{ x: camX, y: camY, scale: camScale }}>
        <span className="iso-shadow" />
        <div className="iso-rot">
          {items.map((it, i) => (
            <Plate key={it.key} it={it} i={i} b={N - 1 - i} explode={explode} mark={mark(i)} onPick={onPick} onHot={onHot} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
