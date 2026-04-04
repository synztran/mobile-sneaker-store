import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ─── Public Types ─────────────────────────────────────────────────────────────

export interface ProductVariantDetail {
	id: number;
	color_id: number | null;
	size_id: number | null;
	size: number;
	color: string;
	color_hex: string;
	price: number;
	stock_quantity: number;
	sku: string | null;
}

export interface ProductDetail {
	id: number;
	slug: string;
	model_name: string;
	brand: string;
	brand_id: number | null;
	description: string | null;
	condition: "new" | "used" | "deadstock" | null;
	retail_price: number | null;
	resale_price: number | null;
	release_date: string | null;
	images: { url: string; alt: string | null; is_primary: boolean }[];
	variants: ProductVariantDetail[];
	colors: { name: string; hex: string }[];
	sizes: { size: number; available: boolean }[];
	min_price: number;
	badge: "NEW" | "SALE" | "LIMITED" | null;
}

// ─── Color name → hex map ─────────────────────────────────────────────────────

const COLOR_HEX: Record<string, string> = {
	Black: "#1a1a1a",
	White: "#ffffff",
	Grey: "#9ca3af",
	Gray: "#9ca3af",
	Red: "#ef4444",
	Blue: "#3b82f6",
	Green: "#22c55e",
	Yellow: "#eab308",
	Orange: "#f97316",
	Pink: "#ec4899",
	Purple: "#a855f7",
	Brown: "#92400e",
	Navy: "#1e3a5f",
	Beige: "#d4b483",
	Tan: "#c4a882",
	Cream: "#f5f0e8",
};

// ─── Internal raw row type ──────────────────────────────────────────────────

type RawProductRow = {
	id: number;
	slug: string;
	model_name: string;
	description: string | null;
	retail_price: number | null;
	resale_price: number | null;
	condition: string | null;
	release_date: string | null;
	brand_id: number | null;
	brands: { id: number; name: string } | null;
	product_images: {
		image_url: string;
		alt_text: string | null;
		is_primary: boolean;
		sort_order: number;
	}[];
	product_variants: {
		id: number;
		size: string;
		color: string;
		color_id: number | null;
		size_id: number | null;
		price: number;
		stock_quantity: number;
		sku: string | null;
		colors: { name: string; color_value: string } | null;
	}[];
};

// ─── GET /api/products/[slug] ─────────────────────────────────────────────────

export async function GET(
	_req: NextRequest,
	{ params }: { params: { slug: string } },
) {
	const { slug } = params;

	if (!slug) {
		return NextResponse.json(
			{ error: "Slug is required" },
			{ status: 400 },
		);
	}

	try {
		const supabase = createClient();

		const { data: rawData, error } = await supabase
			.from("products")
			.select(
				`id, slug, model_name, description, retail_price, resale_price,
				 condition, release_date, brand_id,
				 brands(id, name),
				 product_images(image_url, alt_text, is_primary, sort_order),
				 product_variants(id, size, color, color_id, size_id, price, stock_quantity, sku, colors(name, color_value))`,

			)
			.eq("slug", slug)
			.limit(1)
			.maybeSingle();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		if (!rawData) {
			return NextResponse.json(
				{ error: "Product not found" },
				{ status: 404 },
			);
		}

		const data = rawData as unknown as RawProductRow;

		// ── Shape images ──────────────────────────────────────────────────
		const images = (data.product_images ?? [])
			.sort(
				(a, b) =>
					(b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) ||
					a.sort_order - b.sort_order,
			)
			.map((i) => ({
				url: i.image_url,
				alt: i.alt_text,
				is_primary: i.is_primary,
			}));

		// ── Shape variants ────────────────────────────────────────────────
		const variants: ProductVariantDetail[] = (
			data.product_variants ?? []
		).map((v) => ({
			id: v.id,
			color_id: v.color_id,
			size_id: v.size_id,
			size: parseFloat(String(v.size).replace(/[^0-9.]/g, "")),
			color: v.color,
			color_hex: v.colors?.color_value ?? COLOR_HEX[v.color] ?? "#9ca3af",
			price: v.price,
			stock_quantity: v.stock_quantity,
			sku: v.sku,
		})).filter((v) => !isNaN(v.size));

		// ── Derived helpers ───────────────────────────────────────────────
		const uniqueColors = [
			...new Map(
				variants.map((v) => [
					v.color,
					{ name: v.color, hex: v.color_hex },
				]),
			).values(),
		];

		// Build size list sorted numerically
		const uniqueSizes = [
			...new Map(
				variants.map((v) => [
					v.size,
					{
						size: v.size,
						available: variants.some(
							(vv) => vv.size === v.size && vv.stock_quantity > 0,
						),
					},
				]),
			).values(),
		].sort((a, b) => a.size - b.size);

		const minPrice =
			variants.length > 0
				? Math.min(...variants.map((v) => v.price))
				: (data.resale_price ?? data.retail_price ?? 0);

		let badge: ProductDetail["badge"] = null;
		if (data.condition === "deadstock") badge = "LIMITED";
		else if (data.condition === "new") badge = "NEW";
		else if (
			data.retail_price &&
			data.resale_price &&
			data.resale_price < data.retail_price
		)
			badge = "SALE";

		const product: ProductDetail = {
			id: data.id,
			slug: data.slug,
			model_name: data.model_name,
			brand: data.brands?.name ?? "Unknown",
			brand_id: data.brand_id,
			description: data.description,
			condition: data.condition as ProductDetail["condition"],
			retail_price: data.retail_price,
			resale_price: data.resale_price,
			release_date: data.release_date,
			images,
			variants,
			colors: uniqueColors,
			sizes: uniqueSizes,
			min_price: minPrice,
			badge,
		};

		return NextResponse.json(product);
	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
