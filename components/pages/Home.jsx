'use client';
import { Marquee } from '../Chrome';
import Hero from '../Hero';
import Models from '../Models';
import Platform from '../Platform';
import Agents from '../Agents';
import Race from '../Race';
import Cheaper from '../Cheaper';
import Pareto from '../Pareto';
import Open from '../Open';
import Pricing from '../Pricing';
import C from '../../content';

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee items={C.backed} label="Backed by" />
      <Models />
      <Platform />
      <Agents />
      <Race />
      <Cheaper />
      <Pareto />
      <Open />
      <Pricing />
      <Marquee items={C.trusted} label="Trusted by" reverse />
    </main>
  );
}
