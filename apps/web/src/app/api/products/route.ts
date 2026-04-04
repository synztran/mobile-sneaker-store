import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ─── Public Types ────────────────────────────────────────────────────────────

export type SortOption = "newest" | "price_asc" | "price_desc";

export interface ShopProduct {
	id: number;
	slug: string;
	model_name: string;
	brand: string;
	description: string | null;
	condition: "new" | "used" | "deadstock" | null;
	retail_price: number | null;
	min_price: number;
	images: string[];
	colors: { name: string; hex: string }[];
	sizes: { size: number; available: boolean }[];
	badge: "NEW" | "SALE" | "LIMITED" | null;
}

export interface ProductsResponse {
	products: ShopProduct[];
	total: number;
}

// ─── Color name → hex map ────────────────────────────────────────────────────

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
type ImageRow = {
	image_url: string;
	is_primary: boolean;
	sort_order: number;
};
type VariantRow = {
	size: string;
	color: string;
	color_id: number | null;
	price: number;
	stock_quantity: number;
	colors: { name: string; color_value: string } | null;
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

// ─── Helper ───────────────────────────────────────────────────────────────────

const MAX_PRICE = 500;

// ─── GET /api/products ────────────────────────────────────────────────────────
//
// Query params:
//   search    — full-text search on model_name
//   brand     — brand name (partial match)
//   sizes     — comma-separated list of US sizes  e.g. "10,10.5,11"
//   color     — one color name                    e.g. "Black"
//   priceMin  — minimum variant price             default 0
//   priceMax  — maximum variant price             default MAX_PRICE (no filter if == MAX_PRICE)
//   sort      — "newest" | "price_asc" | "price_desc"    default "newest"
//
// Response:
//   { products: ShopProduct[], total: number }

export async function GET(req: NextRequest) {
	const sp = req.nextUrl.searchParams;

	const search = sp.get("search")?.trim() ?? "";
	const brand = sp.get("brand")?.trim() ?? "";
	const color = sp.get("color")?.trim() ?? "";
	const sizesParam = sp.get("sizes") ?? "";
	const priceMin = Number(sp.get("priceMin") ?? 0);
	const priceMax = Number(sp.get("priceMax") ?? MAX_PRICE);
	const sort = (sp.get("sort") as SortOption | null) ?? "newest";

	const filterSizes = sizesParam
		? sizesParam
				.split(",")
				.map((s) => parseFloat(s.trim()))
				.filter((n) => !isNaN(n))
		: [];

	try {
		const supabase = createClient();

		// Resolve brand name → id when provided
		let brandId: number | null = null;
		if (brand) {
			const { data: brandRow } = await supabase
				.from("brands")
				.select("id")
				.ilike("name", `%${brand}%`)
				.limit(1)
				.maybeSingle();
			if (!brandRow) {
				return NextResponse.json<ProductsResponse>({
					products: [],
					total: 0,
				});
			}
			brandId = (brandRow as { id: number }).id;
		}

		// Build base query — DB-level filters (model name, brand)
		let query = supabase.from("products").select(
			`id, slug, model_name, description, retail_price, resale_price, condition, created_at,
			 brands(id, name),
			 product_images(image_url, is_primary, sort_order),
			 product_variants(size, color, color_id, price, stock_quantity, colors(name, color_value))`,
		);

		if (search) query = query.ilike("model_name", `%${search}%`);
		if (brandId !== null) query = query.eq("brand_id", brandId);

		// Always fetch newest first from DB; price sort applied in JS below
		query = query.order("created_at", { ascending: false });

		const { data, error } = await query;
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// ── Shape raw rows into ShopProduct ──────────────────────────────
		let products: ShopProduct[] = (
			(data ?? []) as unknown as RawListRow[]
		).map((p) => {
			const brandInfo = p.brands;

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
				...new Set(variants.map((v) => parseFloat(v.size))),
			].sort((a, b) => a - b);

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
				brand: brandInfo?.name ?? "Unknown",
				description: p.description,
				condition: p.condition as ShopProduct["condition"],
				retail_price: p.retail_price,
				min_price: minPrice,
				images,
				colors: uniqueColors.map((name) => {
					const variant = variants.find((v) => v.color === name);
					return {
						name,
						hex:
							variant?.colors?.color_value ??
							COLOR_HEX[name] ??
							"#9ca3af",
					};
				}),
				sizes: uniqueSizes.map((size) => ({
					size,
					available: variants.some(
						(v) =>
							parseFloat(v.size) === size && v.stock_quantity > 0,
					),
				})),
				badge,
			};
		});

		// ── JS-level filters (variant attributes & price) ────────────────
		if (filterSizes.length > 0) {
			products = products.filter((p) =>
				filterSizes.some((fs) =>
					p.sizes.some((s) => s.size === fs && s.available),
				),
			);
		}

		if (color) {
			products = products.filter((p) =>
				p.colors.some(
					(c) => c.name.toLowerCase() === color.toLowerCase(),
				),
			);
		}

		// Only filter by price when the user has explicitly set a range
		if (priceMin > 0 || priceMax < MAX_PRICE) {
			products = products.filter(
				(p) => p.min_price >= priceMin && p.min_price <= priceMax,
			);
		}

		// ── JS-level sort ────────────────────────────────────────────────
		if (sort === "price_asc") {
			products.sort((a, b) => a.min_price - b.min_price);
		} else if (sort === "price_desc") {
			products.sort((a, b) => b.min_price - a.min_price);
		}
		// "newest" is already sorted by DB query

		return NextResponse.json<ProductsResponse>({
			products,
			total: products.length,
		});
	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
