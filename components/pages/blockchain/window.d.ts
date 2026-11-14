/* The /blockchain entrances publish one flag on window so a second evaluation of the module does not track the pointer twice. */
interface Window {
  __bceTrack?: boolean;
}
