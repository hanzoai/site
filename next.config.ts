// Production: a static export of every page (out/). Live dev (npm run dev): its own build folder, hot reload, and any
// file this repo lacks — Hanzo's /public images and media — is fetched from hanzo.ai so pages look complete. Only files
// are proxied; an unknown page shows this repo's own 404, as it will in production.
const dev = !!process.env.HZ_DEV;
// The gui packages ship untranspiled ESM resolved against react-native: aliased to react-native-web, web build of a file first.
const gui = {
  transpilePackages: ['@hanzo/gui', '@hanzo/ui', 'react-native-web', 'react-native-svg'],
  experimental: { optimizePackageImports: ['@icons-pack/react-simple-icons'] },
  turbopack: {
    resolveAlias: { 'react-native': 'react-native-web', '@react-native/assets-registry/registry': 'react-native-web/dist/modules/AssetRegistry' },
    resolveExtensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
};
export default dev
  ? { ...gui, distDir: '.next-dev', turbopack: { ...gui.turbopack, root: import.meta.dirname }, images: { unoptimized: true }, devIndicators: false, agentRules: false, async rewrites() { return { fallback: [{ source: '/:file(.+\\.[a-zA-Z0-9]{2,5})', destination: 'https://hanzo.ai/:file' }] }; } }
  // The build's own files are served under /assets: hanzo.ai's /_next is the app's, whose sign-in pages the edge
  // serves here (universe sites.yaml hanzo-ai). The build writes them to out/_next; `build` moves them under it.
  : { ...gui, output: 'export', assetPrefix: '/assets', images: { unoptimized: true }, devIndicators: false };
