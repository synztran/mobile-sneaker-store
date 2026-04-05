/**
 * Server-side product data fetching — used by async server components.
 * Mirrors the shaping logic in /api/products/route.ts.
 */

import type { ShopProduct } from "@/app/api/products/route";
import { createClient } from "@/lib/supabase/server";

// ─── Color name → hex ─────────────────────────────────────────────────────────

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

// ─── Internal row types ───────────────────────────────────────────────────────

type BrandRow = { id: number; name: string } | null;
type ImageRow = { image_url: string; is_primary: boolean; sort_order: number };
type VariantRow = {
	color: string;
	color_id: number;
	size_id: number;
	price: number;
	stock_quantity: number;
	colors: { name: string; color_value: string; id: number | null } | null;
	sizes: {
		id: number;
		name: string;
		us_size: number | null;
		gender: string;
		available: boolean;
	} | null;
};
type RawListRow = {
	id: number;
	slug: string;
	model_name: string;
	description: string | null;
	retail_price: number | null;
	resale_price: number | null;
	condition: string | null;
	created_at: string;
	brands: BrandRow;
	product_images: ImageRow[] | null;
	product_variants: VariantRow[] | null;
};

// ─── Shared shaping logic ─────────────────────────────────────────────────────

function shapeRow(p: RawListRow): ShopProduct {
	const images = (p.product_images ?? [])
		.sort(
			(a, b) =>
				(b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) ||
				a.sort_order - b.sort_order,
		)
		.map((i) => i.image_url);

	const variants = p.product_variants ?? [];
	const uniqueColors = [...new Set(variants.map((v) => v.color))];
	const uniqueSizes = [
		...new Map(
			variants.filter((v) => v.sizes).map((v) => [v.sizes!.id, v.sizes!]),
		).values(),
	].sort((a, b) => (a.us_size ?? 0) - (b.us_size ?? 0));

	const minPrice =
		variants.length > 0
			? Math.min(...variants.map((v) => v.price))
			: (p.resale_price ?? p.retail_price ?? 0);

	let badge: ShopProduct["badge"] = null;
	if (p.condition === "deadstock") badge = "LIMITED";
	else if (p.condition === "new") badge = "NEW";
	else if (
		p.retail_price &&
		p.resale_price &&
		p.resale_price < p.retail_price
	)
		badge = "SALE";

	return {
		id: p.id,
		slug: p.slug,
		model_name: p.model_name,
		brand: p.brands?.name ?? "Unknown",
		description: p.description,
		condition: p.condition as ShopProduct["condition"],
		retail_price: p.retail_price,
		min_price: minPrice,
		images,
		colors: uniqueColors.map((name) => {
			const variant = variants.find((v) => v.color === name);
			return {
				name,
				color_value:
					variant?.colors?.color_value ?? COLOR_HEX[name] ?? "",
				id: variant?.color_id ?? null,
			};
		}),
		sizes: uniqueSizes.map((sizeRow) => ({
			label: sizeRow.name ?? "",
			gender: sizeRow.gender,
			id: sizeRow.id || null,
			available: variants.some(
				(v) => v.sizes?.id === sizeRow.id && v.stock_quantity > 0,
			),
		})),
		badge,
	};
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch the N newest products for use in server components.
 */
export async function getNewestProducts(limit: number): Promise<ShopProduct[]> {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("products")
			.select(
				`id, slug, model_name, description, retail_price, resale_price, condition, created_at,
				 brands(id, name),
				 product_images(image_url, is_primary, sort_order),
				 product_variants(color, color_id, size_id, price, stock_quantity, colors(name, color_value), sizes(id, name, us_size, gender))`,
			)
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error || !data) return [];
		return (data as unknown as RawListRow[]).map(shapeRow);
	} catch {
		return [];
	}
}
