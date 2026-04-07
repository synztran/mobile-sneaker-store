import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface OrderItemDetail {
	id: number;
	variant_id: number | null;
	quantity: number;
	price_at_purchase: number;
	product_name: string | null;
	product_image: string | null;
	size_label: string | null;
	color_name: string | null;
}

export interface OrderDetail {
	id: number;
	order_code: string | null;
	transaction_id: string | null;
	status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
	total_amount: number;
	submitted_at: string | null;
	created_at: string;
	shipping_address: {
		fullName?: string;
		streetAddress?: string;
		apartment?: string;
		city?: string;
		postalCode?: string;
		phoneNumber?: string;
		deliverySpeed?: string;
	} | null;
	items: OrderItemDetail[];
}

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
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

		const { id } = await params;
		const orderId = parseInt(id, 10);
		if (isNaN(orderId)) {
			return NextResponse.json(
				{ error: "Invalid order ID" },
				{ status: 400 },
			);
		}

		// Fetch the order
		const { data: order, error: orderError } = await supabase
			.from("orders")
			.select(
				"id, order_code, transaction_id, status, total_amount, submitted_at, created_at, shipping_address",
			)
			.eq("id", orderId)
			.eq("user_id", user.id)
			.single();

		if (orderError || !order) {
			return NextResponse.json(
				{ error: "Order not found" },
				{ status: 404 },
			);
		}

		// Fetch order items joined with variant → product + images + sizes + colors
		const { data: rawItems } = await supabase
			.from("order_items")
			.select(
				`
				id, variant_id, quantity, price_at_purchase,
				product_variants (
					product_id,
					products ( model_name, product_images ( image_url, is_primary, sort_order ) ),
					sizes ( name ),
					colors ( name )
				)
			`,
			)
			.eq("order_id", orderId);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const items: OrderItemDetail[] = (rawItems ?? []).map((row: any) => {
			const variant = row.product_variants;
			const product = variant?.products;
			const images: Array<{
				image_url: string;
				is_primary: boolean;
				sort_order: number;
			}> = product?.product_images ?? [];
			const primaryImage =
				images.find((img) => img.is_primary)?.image_url ??
				images.sort((a, b) => a.sort_order - b.sort_order)[0]
					?.image_url ??
				null;

			return {
				id: row.id,
				variant_id: row.variant_id,
				quantity: row.quantity,
				price_at_purchase: row.price_at_purchase,
				product_name: product?.model_name ?? null,
				product_image: primaryImage,
				size_label: variant?.sizes?.name ?? null,
				color_name: variant?.colors?.name ?? null,
			};
		});

		return NextResponse.json({
			...order,
			shipping_address:
				order.shipping_address as OrderDetail["shipping_address"],
			items,
		} satisfies OrderDetail);
	} catch (err) {
		console.error("[order detail] unexpected error:", err);
		return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
	}
}
