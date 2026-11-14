/* The shapes /integrations reads from Hanzo's captured pages (intData) and draws (Guide, intParts, IntegrationsIndex). */
import type { Child } from '../htmltree';

// a run of code: one array of [kind, text] tokens per line, and the whole text
export type Token = [kind: string, text: string];
export interface Code { lines: Token[][]; text: string }

export interface Link { label: string; href: string; emoji?: string; desc?: string; tag?: string }
export interface Crumb { label: string; href?: string }

// one chapter of a guide: a sample of code (or prose nodes) under its heading
export interface Sample { title: string; lang: string | null; code: Code | null; nodes: Child[]; links: Link[]; ps: string[] }

// a guide on the index: its mark's two letters come from name; slug is the last part of href
export interface Card { href: string; emoji: string; name: string; desc: string; tag: string; slug: string }

// what a card opens into: its guide's headline and the first lines of its first sample
export interface Preview { title: string; sample: string; lang: string | null; lines: Token[][] }
