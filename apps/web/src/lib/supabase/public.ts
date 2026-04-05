/**
 * Stateless Supabase client using only the anon key — no cookie/session
 * dependencies. Works in all contexts: server components, API routes, edge.
 *
 * Uses @supabase/supabase-js directly with persistSession: false so it never
 * touches cookies, localStorage, or document — safe in Node.js API routes
 * where createBrowserClient would fail.
 *
 * Called as a factory (not module-level) to avoid Turbopack chunking issues.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export function getPublicClient() {
	return createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL ??
			"https://placeholder.supabase.co",
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key",
		{
			auth: {
				persistSession: false,
				autoRefreshToken: false,
				detectSessionInUrl: false,
			},
		},
	);
}
