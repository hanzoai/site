/** Dollars per million tokens, in and out. */
export interface Rates { input: number; output: number }

/** One of Hanzo's own models in the price list (GET /v1/pricing). */
export interface Model {
  name: string;
  fullName?: string;
  family?: string;
  pricing?: { input?: number | null; output?: number | null };
}

/** A lab's model, which the price list always prices. */
export interface Listed extends Model {
  id: string;
  provider: string;
  featured?: boolean;
  isFree?: boolean;
  pricing: Rates;
}

/** An on-demand GPU rack and its hourly rate. */
export interface Gpu { gpu: string; vram: string; price: number }

/** The price list as the calculator keeps it. */
export interface PriceList { updated: string | null; hanzoModels: Model[]; thirdPartyModels: Listed[]; gpu: Gpu[] }

/** What the gateway bills a model at (GET /v1/models), dollars per million tokens. */
export interface Served { id: string; pricing: { input_per_million: number | null; output_per_million: number | null } }

/** Where a read stands. */
export type Reading<T> = { state: 'loading' } | { state: 'ready'; data: T } | { state: 'unreachable'; error: unknown };

/** One model the reader prices: tokens in and out in millions, or a monthly spend and the share of it that is output. */
export interface Usage { model: string; mTokIn: number; mTokOut: number; spend: number; share: number }

/** The Team seat of the plan list. */
export interface Seat { name: string; priceMonthly: number; maxMembers?: number | string | null }
