// The shapes behind the hero's three devices: the day in hero-scenes.json and the terminal's examples.

/** The places a scene happens in. The Beta scene is a chat on the desktop and its own page on the phone. */
export type Place = 'chat' | 'dev' | 'studio' | 'tabs' | 'beta';

/** A step of a scene: plain text, or a template and the file that fills its `{file}`. */
export type Step = string | [template: string, file: string];

/** An image a Studio scene made. */
export interface Art {
  kind: string;
  src: string;
  shape?: string;
}

/** One terminal of a Tabs scene. */
export interface Pane {
  name: string;
  run: string;
  ask: string;
  lines: string[];
}

/** What the phone says for a scene, where it says something other than the desktop does. */
export interface PhoneCopy {
  ask: string;
  cells: string[];
}

/** One line the shell prints: the wait after the one before it (ms), its kind (run, ask, out, ...), its text. */
export type ShellLine = [after: number, kind: string, text: string];

export interface Shell {
  tab: string;
  lines: ShellLine[];
}

/** One scene of the day. The fields a scene has depend on its place; the rest are absent. */
export interface HeroScene {
  place: Place;
  title?: string;
  ask?: string;
  answer?: string;
  card?: boolean;
  run?: string;
  steps?: Step[];
  ship?: boolean;
  ships?: string;
  prompt?: string;
  made?: Art[];
  pick?: number;
  status?: string;
  panes?: Pane[];
  phone?: PhoneCopy;
  shell?: Shell;
}

/** A line of a terminal example: its kind (out, ok, sub, ask, console) and its text. */
export type TermLine = [kind: string, text: string];

/** A command the terminal types and the lines it prints. */
export interface TermExample {
  cmd: string;
  lines: TermLine[];
}

/** Jump to a scene (-1 is the opening), lighting the rail's mark `navId`. */
export type SelectScene = (sc: number, navId?: string | null) => void;
