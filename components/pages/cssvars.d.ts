/* A style object may carry CSS custom properties (style={{ '--i': 3 }}); React's CSSProperties lists none of them. */
import 'react';

declare module 'react' {
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined;
  }
}
