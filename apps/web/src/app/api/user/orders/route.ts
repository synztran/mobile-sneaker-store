import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface OrderSummary {
	id: number;
	order_code: string | null;
	transaction_id: string | null;
	status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
	total_amount: number;
	submitted_at: string | null;
	created_at: string;
	item_count: number;
	shipping_address: {
		fullName?: string;
		city?: string;
		deliverySpeed?: string;
	} | null;
}

export interface OrdersResponse {
	orders: OrderSummary[];
	total: number;
}

export async function GET(req: NextRequest) {
	try {
		const supabase = await createClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const { searchParams } = new URL(req.url);
		const q = searchParams.get("q")?.trim() ?? "";
		const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
		const limit = 20;
		const offset = (page - 1) * limit;

		// Fetch orders with item counts
		let query = supabase
			.from("orders")
			.select(
				`id, order_code, transaction_id, status, total_amount, submitted_at, created_at, shipping_address,
				order_items(count)`,
				{ count: "exact" },
			)
			.eq("user_id", user.id)
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (q) {
			query = query.or(
				`order_code.ilike.%${q}%,transaction_id.ilike.%${q}%`,
			);
		}

		const { data, error, count } = (await (query as ReturnType<
			typeof query.range
		>)) as unknown as {
			data: Array<{
				id: number;
				order_code: string | null;
				transaction_id: string | null;
				status: OrderSummary["status"];
				total_amount: number;
				submitted_at: string | null;
				created_at: string;
				shipping_address: unknown;
				order_items: Array<{ count: number }>;
			}> | null;
			error: { message: string } | null;
			count: number | null;
		};

		if (error) {
			console.error("[orders] fetch error:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		const orders: OrderSummary[] = (data ?? []).map((row) => ({
			id: row.id,
			order_code: row.order_code,
			transaction_id: row.transaction_id,
			status: row.status,
			total_amount: row.total_amount,
			submitted_at: row.submitted_at,
			created_at: row.created_at,
			item_count: row.order_items?.[0]?.count ?? 0,
			shipping_address:
				row.shipping_address as OrderSummary["shipping_address"],
		}));

		return NextResponse.json({
			orders,
			total: count ?? 0,
		} satisfies OrdersResponse);
	} catch (err) {
		console.error("[orders] unexpected error:", err);
		return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
	}
}
