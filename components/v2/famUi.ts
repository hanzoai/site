/* famUi (Families A kit): functional strings come only from content/ui-strings.json (PLAN-COMPONENTS 0.6).
   ui('close') returns the registered string, for an aria-label or a title; a control whose string still needs James's
   yes renders icon-only and carries this as its accessible name. Add an entry to the register before using a new key. */
import REG from '../../content/ui-strings.json';
export const ui = (k) => (REG.strings[k] && REG.strings[k].string) || k;
