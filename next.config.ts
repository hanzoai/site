// Production: a static export of every page (out/). Live dev (npm run dev): its own build folder, hot reload, and any
// file this repo lacks — Hanzo's /public images and media — is fetched from hanzo.ai so pages look complete. Only files
// are proxied; an unknown page shows this repo's own 404, as it will in production.
const dev = !!process.env.HZ_DEV;
export default dev
  ? { distDir: '.next-dev', typescript: { ignoreBuildErrors: true }, turbopack: { root: import.meta.dirname }, images: { unoptimized: true }, devIndicators: false, agentRules: false, async rewrites() { return { fallback: [{ source: '/:file(.+\\.[a-zA-Z0-9]{2,5})', destination: 'https://hanzo.ai/:file' }] }; } }
  // The build's own files are served under /assets: hanzo.ai's /_next is the app's, whose sign-in pages the edge
  // serves here (universe sites.yaml hanzo-ai). The build writes them to out/_next; `build` moves them under it.
  : { output: 'export', assetPrefix: '/assets', typescript: { ignoreBuildErrors: true }, images: { unoptimized: true }, devIndicators: false };
