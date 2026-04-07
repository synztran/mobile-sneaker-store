import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface SubmitPaymentRequest {
	transaction_id: string;
	total_amount: number;
	delivery_fee: number;
	shipping: {
		fullName: string;
		streetAddress: string;
		apartment?: string;
		city: string;
		postalCode?: string;
		phoneNumber?: string;
		deliverySpeed: string;
	};
	items: {
		variant_id: number | null;
		quantity: number;
		price: number;
	}[];
}

export interface SubmitPaymentResponse {
	order_id: number;
	order_code: string;
	submitted_at: string;
	transaction_id: string;
}

export async function POST(req: NextRequest) {
	try {
		const body: SubmitPaymentRequest = await req.json();

		if (!body.items?.length) {
			return NextResponse.json(
				{ error: "Giỏ hàng trống" },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

		// Get current user (optional — guest checkout allowed)
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const submittedAt = new Date().toISOString();
    const generateTransactionId = () => {
      const timestamp = Date.now().toString(36); // Convert timestamp to base36
      const randomStr = Math.random().toString(36).substring(2, 8); // Generate random string
      return `${timestamp}-${randomStr}`;
    };
    const transactionId = generateTransactionId();

		// Create the order
		const { data: order, error: orderError } = await supabase
			.from("orders")
			.insert({
				user_id: user?.id ?? null,
				status: "pending",
				total_amount: body.total_amount,
				transaction_id: transactionId,
				submitted_at: submittedAt,
				shipping_address:
					body.shipping as unknown as import("@/lib/supabase/database.types").Json,
			})
			.select("id, order_code")
			.single();

		if (orderError || !order) {
			console.error("[submit] order insert error:", orderError);
			return NextResponse.json(
				{ error: orderError?.message ?? "Không thể tạo đơn hàng" },
				{ status: 500 },
			);
		}

		// Create order items
		const orderItems = body.items
			.filter((i) => i.variant_id !== null)
			.map((i) => ({
				order_id: order.id,
				variant_id: i.variant_id,
				quantity: i.quantity,
				price_at_purchase: i.price,
			}));

		if (orderItems.length > 0) {
			const { error: itemsError } = await supabase
				.from("order_items")
				.insert(orderItems);

			if (itemsError) {
				console.error("[submit] order_items insert error:", itemsError);
				// Non-fatal — order is created, items can be re-linked later
			}
		}

		if (!order || !order.order_code) {
			return NextResponse.json(
				{ error: "Đơn hàng không hợp lệ" },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			order_id: order.id,
			order_code: order.order_code,
			submitted_at: submittedAt,
			transaction_id: transactionId,
		} satisfies SubmitPaymentResponse);
	} catch (err: unknown) {
		console.error("[submit] unexpected error:", err);
		return NextResponse.json(
			{ error: "Lỗi hệ thống, vui lòng thử lại" },
			{ status: 500 },
		);
	}
}
