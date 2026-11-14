/* A bot's face: the memoji of bot `id`, which side of the handoff it is on (k: 'p' primary, 'v' verifier, '' neither)
   and its size in px. */
export interface FaceProps {
  k?: string;
  size?: number;
  id: string;
}
