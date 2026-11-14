'use client';
/* The gui runtime. Its atomic CSS is app/gui.css (scripts/gui-css.ts), a real stylesheet; nothing is injected at render. */
import type { ReactNode } from 'react';
import { GuiProvider as Gui } from '@hanzo/gui';
import { useScheme } from '@hanzo/appearance';
import config from '../lib/gui';

export default function GuiProvider({ children }: { children: ReactNode }) {
  const scheme = useScheme();
  return (
    <Gui config={config} defaultTheme={scheme} disableRootThemeClass disableInjectCSS>
      {children}
    </Gui>
  );
}
