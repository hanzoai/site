'use client';
/* The last resort: if the shell itself (layout, header) fails, this whole document replaces it. Plain HTML and inline
   styles only, since nothing else can be trusted to have loaded. */
export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100svh', display: 'grid', placeItems: 'center', background: '#0a0a0b', color: '#f5f5f7', fontFamily: 'Zen, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
        <main style={{ padding: 24, textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(40px, 7vw, 88px)', fontWeight: 560, letterSpacing: '-.05em', lineHeight: 1 }}>Hanzo AI</h1>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 32 }}>
            <button type="button" onClick={() => reset()} style={{ height: 44, padding: '0 22px', borderRadius: 999, border: 0, background: '#f5f5f7', color: '#0a0a0b', font: '500 15px/1 inherit', cursor: 'pointer' }}>Try again</button>
            <a href="/" style={{ height: 44, padding: '0 22px', borderRadius: 999, border: '1px solid rgba(255,255,255,.22)', color: '#f5f5f7', font: '500 15px/44px inherit', textDecoration: 'none' }}>Go home</a>
          </div>
        </main>
      </body>
    </html>
  );
}
