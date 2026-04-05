import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ─── GET /api/user/profile ────────────────────────────────────────────────────
// Returns the authenticated user's profile row.
// Creates it first if it doesn't exist (self-healing for pre-migration users).

export async function GET() {
	try {
		const supabase = await createClient();

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		// Try to fetch existing profile
		const { data: profile, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", user.id)
			.maybeSingle();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// Self-heal: create profile if missing (covers auth users from before trigger fix)
		if (!profile) {
			const { data: created, error: insertError } = await supabase
				.from("profiles")
				.insert({
					id: user.id,
					full_name:
						(user.user_metadata?.full_name as string | undefined) ??
						null,
					avatar_url:
						(user.user_metadata?.avatar_url as
							| string
							| undefined) ?? null,
				})
				.select()
				.single();

			if (insertError) {
				return NextResponse.json(
					{ error: insertError.message },
					{ status: 500 },
				);
			}

			return NextResponse.json(created);
		}

		return NextResponse.json(profile);
	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "Unknown error" },
			{ status: 500 },
		);
	}
}

// ─── PATCH /api/user/profile ──────────────────────────────────────────────────
// Updates the authenticated user's profile.
// Accepted body fields: full_name, avatar_url, shipping_address

export async function PATCH(req: NextRequest) {
	try {
		const supabase = await createClient();

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const body = await req.json();

		// Only allow safe, updatable fields
		const allowedFields = ["full_name", "avatar_url", "shipping_address"];
		const updates: Record<string, unknown> = {};
		for (const field of allowedFields) {
			if (field in body) {
				updates[field] = body[field];
			}
		}

		if (Object.keys(updates).length === 0) {
			return NextResponse.json(
				{ error: "No valid fields to update" },
				{ status: 400 },
			);
		}

		// Upsert so we self-heal missing profiles here too
		const { data: profile, error } = await supabase
			.from("profiles")
			.upsert({ id: user.id, ...updates })
			.select()
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(profile);
	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
