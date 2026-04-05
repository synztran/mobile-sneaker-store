/**
 * Stateless Supabase client using only the anon key — no cookie/session
 * dependencies. Use this for reading public data (products, brands, etc.)
 * that is gated by RLS `to anon` policies.
 *
 * Returns a new client per call to avoid module-level side effects that
 * interfere with Turbopack/edge chunking.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export function getPublicClient() {
	return createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL ??
			"https://placeholder.supabase.co",
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key",
	);
}
