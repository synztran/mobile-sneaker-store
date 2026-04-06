"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateProfileName(
	fullName: string,
): Promise<{ error: string | null }> {
	const trimmed = fullName.trim();
	if (!trimmed) return { error: "Name cannot be empty" };

	try {
		const supabase = await createClient();

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) return { error: "Unauthorized" };

		const { error } = await supabase
			.from("profiles")
			.update({ full_name: trimmed })
			.eq("id", user.id);

		if (error) return { error: error.message };
		return { error: null };
	} catch (err: unknown) {
		return {
			error: err instanceof Error ? err.message : "Unknown error",
		};
	}
}
