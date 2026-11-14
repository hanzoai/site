/* The one gui config: @hanzo/ui's, the fleet's token table, monochrome (the site draws no hue). `css` is the package's
   own emitter for it; scripts/gui-css.ts writes it to app/gui.css. */
import { css as sheet, monochrome } from '@hanzo/ui/gui-config';

export default monochrome;
export const css = () => sheet(monochrome);
