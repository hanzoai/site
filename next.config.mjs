// Production: a static export of every page (out/). Live dev (npm run dev): its own build folder, hot reload, and any
// file this repo lacks — Hanzo's /public images and media — is fetched from hanzo.ai so pages look complete.
const dev = !!process.env.HZ_DEV;
export default dev
  ? { distDir: '.next-dev', images: { unoptimized: true }, trailingSlash: true, devIndicators: false, async rewrites() { return { fallback: [{ source: '/:path*', destination: 'https://hanzo.ai/:path*' }] }; } }
  : { output: 'export', images: { unoptimized: true }, trailingSlash: true, devIndicators: false };
