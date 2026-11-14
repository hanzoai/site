'use client';
/* The day the list prices were read. hanzo.ai stamps its cost notes with the day the page reads the price list
   ("at list prices, Nov 8, 2026"), so ours does the same: the build's read of the list on the server, today once
   the page opens. Renders bare text, so the sentence around it stays one run. */
import { useEffect, useState } from 'react';
import P from '../../../content/live/_pricing.json';

const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export const READ = fmt(new Date(P.fetched_at));
export const DAY = /(at list prices, )([A-Z][a-z]{2} \d{1,2}, \d{4})/;

export default function ListDay() {
  const [d, setD] = useState(READ);
  useEffect(() => setD(fmt(new Date())), []);
  return d;
}
