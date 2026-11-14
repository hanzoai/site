'use client';
/* A page ported from hanzo.ai as Hanzo renders it, given the new motion layer: each block rises into place as it
   is reached, and links inside the site navigate without a reload. */
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { has } from '../lib/route';

export default function Ported({ html }: { html?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    // the blocks worth revealing: top-level sections, else the first layer of children
    let blocks: Element[] = [...root.querySelectorAll(':scope > section, :scope > div > section, :scope > div > div > section')];
    if (blocks.length < 2) blocks = [...root.children].flatMap((c) => (c.children.length > 1 ? [...c.children] : [c]));
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const vh = innerHeight;
    blocks.forEach((b) => { if (!calm && b.getBoundingClientRect().top > vh * 0.9) b.classList.add('x-rv'); });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
    blocks.forEach((b) => b.classList.contains('x-rv') && io.observe(b));
    const click = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="/"]');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || a.hasAttribute('download') || !has(a.getAttribute('href')!)) return;
      e.preventDefault();
      router.push(a.getAttribute('href')!);
    };
    root.addEventListener('click', click);
    return () => { io.disconnect(); root.removeEventListener('click', click); };
  }, [html, router]);
  return <div ref={ref} className="x-port" dangerouslySetInnerHTML={{ __html: html ?? '' }} />;
}
