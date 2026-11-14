/* @types/react-dom is not a dependency of this site (the lockfile is frozen in CI); these are the two calls it is used for. */
declare module 'react-dom' {
  import type { ReactNode, ReactPortal } from 'react';
  export function createPortal(children: ReactNode, container: Element | DocumentFragment, key?: string | null): ReactPortal;
  export function flushSync<R>(fn: () => R): R;
}
