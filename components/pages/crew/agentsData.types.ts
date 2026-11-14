/* The shapes of an /agents/<page> read from Hanzo's captured page (agentsData.ts) and drawn by the room (AgentRoom.tsx). */
export type Link = { label: string; href: string };
export type Pic = { src: string; alt: string };
export type CodeLines = [string, string][][];
export type Heading = { eyebrow: string; h2: string; lede: string };

export type ConsoleDoc = {
  title: string;
  nav: { label: string; href: string; current: boolean }[];
  turns: { who: 'you' | 'enso'; text: string }[];
  endpoint: string;
  open: Link | undefined;
  home: '/home' | null | undefined;
  caption: string;
};
export type Fold = {
  label: string;
  h1: string;
  lede: string[];
  actions: Link[];
  note: string;
  install: string[];
  through: string[];
  console: ConsoleDoc | undefined;
};

export type RosterSection = Heading & { k: 'roster'; agents: { name: string; role: string; img: Pic | undefined; href: string }[]; more: Link | null };
export type RoomSection = Heading & { k: 'room'; actions: Link[]; url: string; caption: string; shots: Pic[]; sketch: { runs: string[]; to: string } | null };
export type CodeSection = Heading & { k: 'code'; lang: string; lines: CodeLines; actions: Link[] };
export type GetSection = { k: 'get'; h2: string; lede: string; license: [string, string] | null; github: Link | null; actions: Link[] };
export type Cards = Heading & { cards: { n: string; title: string; text: string }[] };
export type PillarsSection = Cards & { k: 'pillars' };
export type PartsSection = Cards & { k: 'parts' };
export type CloseSection = Heading & { k: 'close'; actions: Link[] };
export type Section = RosterSection | RoomSection | CodeSection | GetSection | PillarsSection | PartsSection | CloseSection;

export type AgentsDoc = { slug: string; route: string; fold: Fold | null; sections: Section[] };
