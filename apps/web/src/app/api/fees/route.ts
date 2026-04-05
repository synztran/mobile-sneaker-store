import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("fees")
		.select(
			"delivery_immediate_price, delivery_basic_price, insurance_fee, packing_fee, handling_fee, updated_at",
		)
		.limit(1)
		.single();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}
