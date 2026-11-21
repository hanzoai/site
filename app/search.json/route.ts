// /search.json: every page's path, title and description (lib/search.json), the index the 404 page and the header
// search import as a chunk. Written as a file of the export so the WebMCP search tool (lib/webmcp.ts) can fetch it from a
// script in the head, which has no chunk loader.
import SEARCH from '../../lib/search.json';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(SEARCH);
}
