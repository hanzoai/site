'use client';
/* The person's appearance, exactly as live hanzo.ai applies it (docs/DARK-MODE.md). Hanzo's own @hanzo/appearance:
   bootScript() in <head> (app/layout.jsx) paints the saved choice before the first frame; this root call to
   useAppearance() applies the resolved choice on mount, follows the device while the theme is "system", and re-applies
   when the choice changes in another tab or through the `hanzo:appearance` event. The install layer is "system", as live's
   boot seed is ({"vars":{},"theme":"system"}). It renders nothing: no visible switch, because live shows none. */
import { useAppearance } from '@hanzo/appearance';

const INSTALL = { theme: 'system' };

export default function Appearance() {
  useAppearance({ install: INSTALL });
  return null;
}
