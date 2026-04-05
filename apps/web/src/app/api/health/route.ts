import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
	const results: Record<string, unknown> = {};

	try {
		const supabase = await createClient();

		// 1. Check auth service is reachable
		const { error: authError } = await supabase.auth.getSession();
		results.auth = authError
			? { ok: false, error: authError.message }
			: { ok: true };

		// 2. Check each table exists and is accessible
		const tables = [
			"profiles",
			"brands",
			"products",
			"product_variants",
			"product_images",
			"cart_items",
			"orders",
			"order_items",
			"wishlist_items",
		] as const;

		results.tables = {};
		for (const table of tables) {
			const { error, count } = await supabase
				.from(table)
				.select("*", { count: "exact", head: true });

			(results.tables as Record<string, unknown>)[table] = error
				? { ok: false, error: error.message, code: error.code }
				: { ok: true, rowCount: count };
		}

		const allTablesOk = Object.values(
			results.tables as Record<string, { ok: boolean }>,
		).every((t) => t.ok);

		return NextResponse.json(
			{
				status:
					results.auth &&
					(results.auth as { ok: boolean }).ok &&
					allTablesOk
						? "healthy"
						: "degraded",
				supabaseUrl: process.env.SUPABASE_URL ?? "(not set)",
				...results,
			},
			{ status: 200 },
		);
	} catch (err) {
		return NextResponse.json(
			{
				status: "error",
				error: err instanceof Error ? err.message : String(err),
			},
			{ status: 500 },
		);
	}
}
