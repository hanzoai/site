/* /reviews: Hanzo Reviews' curated reviews, word for word as hanzo.ai prints them, and the small rules that draw and
   keep them. Nothing here is sent anywhere: a review a visitor writes is kept in this browser (STORAGE_KEY) and shown
   first, as hanzo.ai shows it, and that is the whole of it. */

export const PRODUCTS = ['Hanzo Dev', 'Enso & Models', 'Hanzo Cloud', 'Hanzo Design', 'Enterprise'];
export const CATEGORIES = ['All', ...PRODUCTS];

export const STORAGE_KEY = 'hanzo.hosted.reviews.v1';

export interface Review {
  id: string;
  author: string;
  role: string;
  company: string;
  product: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

/** What the form holds while a visitor writes. */
export interface Draft {
  name: string;
  role: string;
  company: string;
  product: string;
  rating: number;
  title: string;
  body: string;
}

export const REVIEWS: Review[] = [
  {
    id: 'rev-damon',
    author: 'Jay Giraud',
    role: 'Founder & CEO',
    company: 'Damon Motorcycles',
    product: 'Enterprise',
    rating: 5,
    title: 'Transformed our electric hypersport telemetry & embedded AI',
    body: 'Hanzo has transformed our approach to electric motorcycle development. Their platform gives us the tools to innovate at a pace that would be impossible with traditional infrastructure, hitting sub-50ms edge inference latency.',
    date: 'Oct 2026',
    verified: true,
  },
  {
    id: 'rev-skully',
    author: 'Marcus Weller',
    role: 'CEO',
    company: 'SKULLY Technologies',
    product: 'Hanzo Dev',
    rating: 5,
    title: 'Streamlined DX platform with zero compromise on safety',
    body: 'Working with Hanzo transformed our ability to ship the highest funded campaign in Indiegogo history. Their DX platform and autonomous agents streamlined our entire firmware and AR HUD development pipeline.',
    date: 'Oct 2026',
    verified: true,
  },
  {
    id: 'rev-bellabeat',
    author: 'Sandro Mur',
    role: 'Co-founder & CEO',
    company: 'Bellabeat',
    product: 'Hanzo Cloud',
    rating: 5,
    title: 'Scaled biometric AI and private clusters to millions of devices',
    body: "As a company focused on women's health technology, we need partners who understand both tech and human needs. Hanzo has been instrumental in helping us scale our infrastructure to millions of connected devices.",
    date: 'Oct 2026',
    verified: true,
  },
  {
    id: 'rev-triller',
    author: 'Vincent Butta',
    role: 'Board Member',
    company: 'Triller',
    product: 'Hanzo Cloud',
    rating: 5,
    title: 'Rock-solid global edge throughput for 169M+ viewers',
    body: "With Trillerfest reaching over 169M people, Hanzo's platform has been essential to our success. Their scalable AI and cloud infrastructure allowed us to deliver real-time personalization at global scale.",
    date: 'Sep 2026',
    verified: true,
  },
  {
    id: 'rev-karma',
    author: 'Antje Worring',
    role: 'CEO',
    company: 'Karma Fashion',
    product: 'Hanzo Design',
    rating: 5,
    title: '3.4× campaign growth lift with Hanzo AI & Design',
    body: "Hanzo's platform transformed our growth strategy and catalyzed sales. Their AI-driven creative studio and semantic merchandising helped us connect with our audience and make our latest launch our most successful to date.",
    date: 'Sep 2026',
    verified: true,
  },
  {
    id: 'rev-dev-1',
    author: 'Elena Rostova',
    role: 'Staff Systems Engineer',
    company: 'Vanguard Labs',
    product: 'Hanzo Dev',
    rating: 5,
    title: 'Replaced 4 separate coding subscriptions with Hanzo Dev',
    body: 'Running `hanzo dev` inside our monorepo cut PR turnaround from 2 days to 25 minutes. Having Claude Code, Codex, and Zen models unified under one MCP toolset and one bill is a superpower.',
    date: 'Oct 2026',
    verified: true,
  },
  {
    id: 'rev-enso-1',
    author: 'Marcus Vance',
    role: 'VP of AI Engineering',
    company: 'Kinetix Financial',
    product: 'Enso & Models',
    rating: 5,
    title: 'Cut inference spend by 68% without dropping a point on evals',
    body: 'We switched our OpenAI base URL to Enso 1 (`api.hanzo.ai/v1`). Within 24 hours our token bill dropped by two-thirds while our internal coding and financial extraction benchmarks actually went up.',
    date: 'Oct 2026',
    verified: true,
  },
  {
    id: 'rev-kai-1',
    author: 'Dr. Kenji Takahashi',
    role: 'Principal ML Architect',
    company: 'Aether Robotics',
    product: 'Enso & Models',
    rating: 5,
    title: 'Sub-millisecond deterministic decisions with Kai 1',
    body: 'Before Kai, we were burning thousands of dollars on LLM output tokens just to classify intents and route tool calls. Kai gives us calibrated probability distributions in under a millisecond.',
    date: 'Oct 2026',
    verified: true,
  },
  {
    id: 'rev-studio-1',
    author: 'Sofia Chen',
    role: 'Creative Director',
    company: 'Lumina Interactive',
    product: 'Hanzo Design',
    rating: 5,
    title: 'Iro, Koma, and Mori in a single node canvas',
    body: 'We generate concept art with Iro, turn frames into 4K motion with Koma, and export 3D meshes with Mori without ever leaving the browser. Hanzo Design replaced our entire fragmented creative pipeline.',
    date: 'Sep 2026',
    verified: true,
  },
];

/** Where hanzo.ai sends a review: the gateway, never another host. */
export const API = 'https://api.hanzo.ai';

/** The sales lead hanzo.ai files for a review (POST /v1/marketing/leads, hanzo-inc/app reviews/page.tsx). */
export const lead = (e: Review) => ({
  program: 'hanzo_review',
  name: e.author,
  role: e.role,
  company: e.company,
  product: e.product,
  rating: e.rating,
  title: e.title,
  review: e.body,
  source: 'hanzo.reviews',
});

/** The same review as a response to the hanzo.review-submit form (POST /v1/form/public/hanzo.review-submit/responses). */
export const response = (e: Review, now = Date.now()) => ({
  token: `rv_${now}`,
  answers: [
    { field: 'name', text: e.author },
    { field: 'role', text: e.role },
    { field: 'company', text: e.company },
    { field: 'product', text: e.product },
    { field: 'rating', number: e.rating },
    { field: 'title', text: e.title },
    { field: 'review', text: e.body },
  ],
  hidden: { source: 'hanzo.reviews' },
});

/** The reviews a visitor kept in this browser, read from what localStorage holds; anything that is not a list is nothing. */
export function kept(raw: string | null): Review[] {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** The review a visitor's answers make: a name, a headline and a review are needed; a role and a company default as hanzo.ai defaults them. Null where one is missing. */
export function entry({ name, role, company, product, rating, title, body }: Draft, now = Date.now()): Review | null {
  if (!name.trim() || !title.trim() || !body.trim()) return null;
  return {
    id: `user-${now}`,
    author: name.trim(),
    role: role.trim() || 'Builder',
    company: company.trim() || 'Community',
    product,
    rating,
    title: title.trim(),
    body: body.trim(),
    date: 'Just now',
    verified: true,
  };
}

/** What a category shows: every review, the visitor's first, or only the ones of that product. */
export const visible = (mine: Review[], category: string): Review[] => {
  const all = [...mine, ...REVIEWS];
  return category === 'All' ? all : all.filter((r) => r.product === category);
};
