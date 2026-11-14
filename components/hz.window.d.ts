/* Flags the page shell and its transitions pass to each other on window. */
interface Window {
  /** A close transition is restoring the previous scroll; a new page leaves the scroll alone. */
  __hzHold?: boolean;
  /** The navigation in flight is Back or Forward; the browser restores where the visitor was. */
  __hzPop?: boolean;
}
